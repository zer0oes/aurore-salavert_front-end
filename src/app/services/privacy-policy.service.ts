import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@src/environment';

@Injectable({
  providedIn: 'root'
})
export class PrivacyPolicyService {
  private apiUrl = `${environment.url}/api/privacy-policy`;

  constructor(private http: HttpClient) {}

  getPrivacyPolicy(locale: string): Observable<any> {
    return this.http.get(`${this.apiUrl}?locale=${locale}`);
  }
}