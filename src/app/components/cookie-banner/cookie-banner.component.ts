import { Component, OnInit } from '@angular/core';
import { CookieBannerLabels, CookieConsentService } from '@app/services/cookie-consent.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-cookie-banner',
  templateUrl: './cookie-banner.component.html',
  styleUrls: ['./cookie-banner.component.scss']
})
export class CookieBannerComponent implements OnInit {
  visible$: Observable<boolean>;
  labels$: Observable<CookieBannerLabels>;

  constructor(private cookieConsentService: CookieConsentService) {
    this.visible$ = this.cookieConsentService.bannerVisible$;
    this.labels$ = this.cookieConsentService.getLabels();
  }

  ngOnInit(): void {
    this.cookieConsentService.init();
  }

  rejectCookies(): void {
    this.cookieConsentService.reject();
  }

  acceptCookies(): void {
    this.cookieConsentService.accept();
  }
}
