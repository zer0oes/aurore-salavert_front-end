import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@src/environment';
import { BehaviorSubject, forkJoin, map, Observable } from 'rxjs';

interface MenuItem {
  title: string;
  slug: string;
}

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  private url = environment.url;
  private showcaseUrl = this.url + '/api/showcase?populate=*';
  private skillUrl = this.url + '/api/competence?populate=*';
  private servicesUrl = this.url + '/api/service?populate=*';
  private contactUrl = this.url + '/api/contact?populate=*';

  private menuOpenedSubject = new BehaviorSubject<boolean>(false);
  menuOpened$ = this.menuOpenedSubject.asObservable();

  constructor(private http: HttpClient) { }

  toggleMenu(): void {
    this.menuOpenedSubject.next(!this.menuOpenedSubject.value);
  }

  setMenuOpened(opened: boolean): void {
    this.menuOpenedSubject.next(opened);
  }

  getMenuItems(): Observable<MenuItem[]> {
    return forkJoin([
      this.http.get<any>(this.showcaseUrl),
      this.http.get<any>(this.skillUrl),
      this.http.get<any>(this.servicesUrl),
      this.http.get<any>(this.contactUrl)
    ]).pipe(
      map((responses: any[]) => {
        return responses.flatMap(response => {
          if (response && response.data) {
            if (Array.isArray(response.data)) {
              return response.data.map((item: any) => this.mapMenuItem(item));
            } else {
              return [this.mapMenuItem(response.data)];
            }
          } else {
            return [];
          }
        });
      })
    );
  }

  private mapMenuItem(item: any): MenuItem {
    const title = item.Title || item.title || 'Untitled';
    const slug = item.slug || 'default-slug';
    return { title, slug };
  }
}
