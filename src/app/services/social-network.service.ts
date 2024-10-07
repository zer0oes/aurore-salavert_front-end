import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@src/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SocialNetworkService {
  private url = environment.url + 'api/social-networks?populate=*';

  constructor(private http: HttpClient) { }

  getSocialNetworks(): Observable<any> {
    return this.http.get<any>(this.url);
  }
}
