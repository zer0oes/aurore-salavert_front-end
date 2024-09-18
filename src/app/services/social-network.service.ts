import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SocialNetworkService {
  private apiUrl = 'http://localhost:1337/api/social-networks?populate=*'; // URL de l'API

  constructor(private http: HttpClient) { } // Injection de HttpClient

  // Méthode pour récupérer les réseaux sociaux
  getSocialNetworks(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }
}
