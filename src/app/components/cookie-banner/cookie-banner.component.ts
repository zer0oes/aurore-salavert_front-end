import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-cookie-banner',
  templateUrl: './cookie-banner.component.html',
  styleUrls: ['./cookie-banner.component.scss']
})
export class CookieBannerComponent implements OnInit {
  cookiesAccepted: boolean = false;
  currentLang: string;
  translations: any = {
    en: {
      messageStart: 'We use cookies to enhance your experience. By continuing to visit this site you agree to our use of ',
      linkText: 'cookies',
      messageEnd: '.',
      rejectButton: 'Close and reject',
      acceptButton: 'Accept'
    },
    fr: {
      messageStart: 'Nous utilisons des cookies pour améliorer votre expérience. En continuant à visiter ce site, vous acceptez notre utilisation des ',
      linkText: 'cookies',
      messageEnd: '.',
      rejectButton: 'Fermer et refuser',
      acceptButton: 'Accepter'
    }
  };
  translatedText: any;

  constructor() {
    // Détecter la langue du navigateur
    const userLang = navigator.language.split('-')[0]; // 'fr', 'en', etc.
    this.currentLang = ['fr', 'en'].includes(userLang) ? userLang : 'en';
    this.translatedText = this.translations[this.currentLang];
  }

  ngOnInit(): void {
    this.checkCookieStatus();
  }

  checkCookieStatus(): void {
    const cookieConsent = localStorage.getItem('cookieConsent');
    this.cookiesAccepted = cookieConsent === 'true';
  }

  rejectCookies(): void {
    localStorage.setItem('cookieConsent', 'false');
    this.cookiesAccepted = true;
  }

  acceptCookies(): void {
    localStorage.setItem('cookieConsent', 'true');
    this.cookiesAccepted = true;
    this.loadGoogleAnalytics();
  }

  loadGoogleAnalytics(): void {
    const script = document.createElement('script');
    script.src = 'https://www.googletagmanager.com/gtag/js?id=G-HC971RXVZG';
    script.async = true;
    document.head.appendChild(script);

    const script2 = document.createElement('script');
    script2.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-HC971RXVZG');
    `;
    document.head.appendChild(script2);
  }
}