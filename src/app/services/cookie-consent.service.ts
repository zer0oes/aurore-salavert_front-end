import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@src/environment';
import { BehaviorSubject, catchError, map, Observable, of, shareReplay } from 'rxjs';
import { LocaleService } from './locale.service';

export interface CookieBannerLabels {
  message: string;
  policyLinkLabel: string;
  acceptLabel: string;
  rejectLabel: string;
  manageLabel: string;
}

type ConsentValue = 'granted' | 'denied';

const STORAGE_KEY = 'cookieConsent.v2';
const LEGACY_STORAGE_KEY = 'cookieConsent';
const GA_ID = 'G-HC971RXVZG';
// The CNIL recommends asking again after six months, whatever the choice.
const CONSENT_LIFETIME_MS = 182 * 24 * 60 * 60 * 1000;

const DEFAULT_LABELS: Record<string, CookieBannerLabels> = {
  fr: {
    message: 'Ce site utilise des cookies de mesure d’audience (Google Analytics) pour comprendre sa fréquentation. Ils ne sont déposés qu’avec votre accord, et vous pouvez changer d’avis à tout moment depuis le lien « Gérer les cookies » en bas de page.',
    policyLinkLabel: 'Politique de confidentialité',
    acceptLabel: 'Accepter',
    rejectLabel: 'Refuser',
    manageLabel: 'Gérer les cookies'
  },
  en: {
    message: 'This website uses audience measurement cookies (Google Analytics) to understand how it is visited. They are only set with your consent, and you can change your mind at any time from the “Manage cookies” link at the bottom of the page.',
    policyLinkLabel: 'Privacy policy',
    acceptLabel: 'Accept',
    rejectLabel: 'Reject',
    manageLabel: 'Manage cookies'
  }
};

@Injectable({
  providedIn: 'root'
})
export class CookieConsentService {
  private bannerVisibleSubject = new BehaviorSubject<boolean>(false);
  bannerVisible$ = this.bannerVisibleSubject.asObservable();
  private analyticsLoaded = false;
  private labels$?: Observable<CookieBannerLabels>;

  constructor(private http: HttpClient, private localeService: LocaleService) { }

  init(): void {
    localStorage.removeItem(LEGACY_STORAGE_KEY);
    const consent = this.readConsent();
    if (consent === 'granted') {
      this.loadGoogleAnalytics();
    }
    this.bannerVisibleSubject.next(consent === null);
  }

  getLabels(): Observable<CookieBannerLabels> {
    // The banner and the footer share a single request.
    this.labels$ ??= this.fetchLabels();
    return this.labels$;
  }

  private fetchLabels(): Observable<CookieBannerLabels> {
    const locale = this.localeService.getLocale();
    const defaults = DEFAULT_LABELS[locale] || DEFAULT_LABELS['en'];
    return this.http.get<any>(`${environment.url}/api/cookie-banner?locale=${locale}`).pipe(
      catchError(() => of({ data: null })),
      map((response) => {
        const content = response?.data?.attributes || response?.data || {};
        const label = (field: string, fallback: string): string =>
          typeof content[field] === 'string' && content[field].trim() ? content[field] : fallback;
        return {
          message: label('Message', defaults.message),
          policyLinkLabel: label('PolicyLinkLabel', defaults.policyLinkLabel),
          acceptLabel: label('AcceptLabel', defaults.acceptLabel),
          rejectLabel: label('RejectLabel', defaults.rejectLabel),
          manageLabel: label('ManageLabel', defaults.manageLabel)
        };
      }),
      shareReplay(1)
    );
  }

  openBanner(): void {
    this.bannerVisibleSubject.next(true);
  }

  accept(): void {
    this.saveConsent('granted');
    this.loadGoogleAnalytics();
    this.bannerVisibleSubject.next(false);
  }

  reject(): void {
    this.saveConsent('denied');
    this.disableGoogleAnalytics();
    this.bannerVisibleSubject.next(false);
  }

  private readConsent(): ConsentValue | null {
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
      if (
        (stored?.value === 'granted' || stored?.value === 'denied') &&
        Date.now() - stored.date < CONSENT_LIFETIME_MS
      ) {
        return stored.value;
      }
    } catch {
      // Unreadable storage counts as no choice.
    }
    return null;
  }

  private saveConsent(value: ConsentValue): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ value, date: Date.now() }));
    } catch {
      // The choice still applies for this visit.
    }
  }

  private loadGoogleAnalytics(): void {
    (window as any)[`ga-disable-${GA_ID}`] = false;
    if (this.analyticsLoaded) return;
    this.analyticsLoaded = true;

    const script = document.createElement('script');
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
    script.async = true;
    document.head.appendChild(script);

    const w = window as any;
    w.dataLayer = w.dataLayer || [];
    w.gtag = function () { w.dataLayer.push(arguments); };
    w.gtag('js', new Date());
    w.gtag('config', GA_ID);
  }

  private disableGoogleAnalytics(): void {
    (window as any)[`ga-disable-${GA_ID}`] = true;
    const domains = ['', `; domain=${location.hostname}`, `; domain=.${location.hostname.replace(/^www\./, '')}`];
    document.cookie.split(';')
      .map((cookie) => cookie.split('=')[0].trim())
      .filter((name) => name === '_ga' || name.startsWith('_ga_'))
      .forEach((name) => domains.forEach((domain) => {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/${domain}`;
      }));
  }
}
