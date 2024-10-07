import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SocialNetworkService {
  private apiUrl = environment.url + 'api/social-networks?populate=*'; // URL de l'API

  constructor(private http: HttpClient) { } // Injection de HttpClient

  // Méthode pour récupérer les réseaux sociaux
  getSocialNetworks(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }
}
