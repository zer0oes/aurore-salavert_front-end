import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-cookie-banner',
  templateUrl: './cookie-banner.component.html',
  styleUrls: ['./cookie-banner.component.scss']
})
  
export class CookieBannerComponent implements OnInit {
  cookiesAccepted: boolean = false;

  constructor() { }

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
    script.src = 'https://www.googletagmanager.com/gtag/js?id=G-HC971RXVZG';  // Ton ID Google Analytics
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