import { AfterViewInit, Component, ElementRef, NgZone, OnDestroy, OnInit } from '@angular/core';
import { SocialNetworkService } from '@app/services/social-network.service';
import { PrivacyPolicyService } from '@app/services/privacy-policy.service';
import { LocaleService } from '@app/services/locale.service';
import { CookieConsentService } from '@app/services/cookie-consent.service';
import { privacyRevealOffset } from './footer-position';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit, AfterViewInit, OnDestroy {
  private footerObserver?: ResizeObserver;
  private contentObserver?: MutationObserver;
  private frame = 0;
  private readonly schedulePosition = () => {
    if (this.frame) return;
    this.frame = requestAnimationFrame(() => {
      this.frame = 0;
      const footer = this.elementRef.nativeElement.querySelector('footer');
      const privacy = this.elementRef.nativeElement.querySelector<HTMLElement>('.privacy-policy-mobile');
      if (!footer) return;
      const host = this.elementRef.nativeElement;
      const rect = host.getBoundingClientRect();
      const body = document.body;
      const viewportBottom = Math.min(window.innerHeight, body.getBoundingClientRect().top + body.clientHeight);
      const offset = rect && privacy?.getClientRects().length
        ? privacyRevealOffset(body.scrollTop, viewportBottom, rect.top, rect.height, 0)
        : 0;
      const value = `${offset}px`;
      if (host.style.getPropertyValue('--privacy-reveal') !== value) {
        host.style.setProperty('--privacy-reveal', value);
      }
    });
  };
  currentYear: number = new Date().getFullYear();
  socialNetworks: any[] = [];
  privacyPolicyLink: string | null = null;
  privacyPolicyTitle: string | null = null;
  manageCookiesLabel: string | null = null;

  constructor(
    private elementRef: ElementRef<HTMLElement>,
    private zone: NgZone,
    private socialNetworkService: SocialNetworkService,
    private privacyPolicyService: PrivacyPolicyService,
    private localeService: LocaleService,
    private cookieConsentService: CookieConsentService
  ) { }

  ngAfterViewInit(): void {
    this.zone.runOutsideAngular(() => {
      document.addEventListener('scroll', this.schedulePosition, true);
      window.addEventListener('resize', this.schedulePosition);
      document.addEventListener('load', this.schedulePosition, true);
      this.contentObserver = new MutationObserver(this.schedulePosition);
      this.contentObserver.observe(document.body, { childList: true, subtree: true, characterData: true });
      this.footerObserver = new ResizeObserver(this.schedulePosition);
      // Body scroll height changes as API content and images arrive.
      this.footerObserver.observe(this.elementRef.nativeElement);
      this.footerObserver.observe(document.body);
      this.schedulePosition();
    });
  }

  ngOnDestroy(): void {
    document.removeEventListener('scroll', this.schedulePosition, true);
    window.removeEventListener('resize', this.schedulePosition);
    document.removeEventListener('load', this.schedulePosition, true);
    this.contentObserver?.disconnect();
    this.footerObserver?.disconnect();
    cancelAnimationFrame(this.frame);
  }

  ngOnInit(): void {
    this.socialNetworkService.getSocialNetworks().subscribe((response: any) => {
      if (response && response.data) {
        this.socialNetworks = response.data.map((network: any) => ({
          icon: network.icon,
          url: network.url
        }));
      } else {
        console.error('Erreur: Aucune donnée trouvée dans la réponse de l\'API');
      }
    });

    this.cookieConsentService.getLabels().subscribe((labels) => {
      this.manageCookiesLabel = labels.manageLabel;
    });

    const locale = this.localeService.getLocale();
    this.privacyPolicyService.getPrivacyPolicy(locale).subscribe((response: any) => {
      if (response && response.data) {
        this.privacyPolicyLink = '/privacy-policy';
        this.privacyPolicyTitle = response.data.title;
      } else {
        console.error('Erreur: Aucune donnée trouvée dans la réponse de l\'API');
      }
    });
  }

  openCookieBanner(): void {
    this.cookieConsentService.openBanner();
  }
}
