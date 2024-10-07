import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@src/environment';
import { BehaviorSubject, forkJoin, map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  private url = environment.url;
  private showcaseUrl = environment.url + 'api/showcase?populate=*';
  private skillUrl = environment.url + 'api/competence?populate=*';
  private servicesUrl = environment.url + 'api/service?populate=*';
  private contactUrl = environment.url + 'api/contact?populate=*';

  constructor(private http: HttpClient) { }

  private menuOpenedSubject = new BehaviorSubject<boolean>(false);
  menuOpened$ = this.menuOpenedSubject.asObservable();

  toggleMenu() {
    this.menuOpenedSubject.next(!this.menuOpenedSubject.value);
  }

  setMenuOpened(opened: boolean) {
    this.menuOpenedSubject.next(opened);
  }

  getMenuItems(): Observable<any[]> {
    return forkJoin([
      this.http.get<any>(this.showcaseUrl),
      this.http.get<any>(this.skillUrl),
      this.http.get<any>(this.servicesUrl),
      this.http.get<any>(this.contactUrl)
    ]).pipe(
      map((responses: any[]) => {
        return responses.map(response => {
          if (response && Array.isArray(response.data)) {
            return response.data.map((item: any) => ({
              title: item.attributes.Title || item.attributes.title,
              slug: item.attributes.slug
            }));
          } else if (response && response.data) {
            const item = response.data;
            return [{
              title: item.attributes.Title || item.attributes.title,
              slug: item.attributes.slug
            }];
          } else {
            return [];
          }
        }).flat();
      })
    );
  }
  
}