import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@src/environment';
import { LocaleService } from '@app/services/locale.service';

@Injectable({ providedIn: 'root' })
export class PrivacyPolicyResolver implements Resolve<any> {
  constructor(private http: HttpClient, private localeService: LocaleService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    const locale = this.localeService.getLocale();
    return this.http.get(`${environment.url}/api/privacy-policy?populate=*&locale=${locale}`);
  }
}