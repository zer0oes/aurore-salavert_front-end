import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@src/environment';
import { BehaviorSubject, forkJoin, map, Observable } from 'rxjs';
import { LocaleService } from './locale.service';

interface MenuItem {
  title: string;
  slug: string;
}

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  private url = environment.url;

  private menuOpenedSubject = new BehaviorSubject<boolean>(false);
  menuOpened$ = this.menuOpenedSubject.asObservable();

  constructor(private http: HttpClient, private localeService: LocaleService) { }

  toggleMenu(): void {
    this.menuOpenedSubject.next(!this.menuOpenedSubject.value);
  }

  setMenuOpened(opened: boolean): void {
    this.menuOpenedSubject.next(opened);
  }

  getMenuItems(): Observable<MenuItem[]> {
    const locale = this.localeService.getLocale(); // Obtention de la locale actuelle

    // Ajoute le paramètre `?locale=`
    const showcaseUrl = `${this.url}/api/showcase?locale=${locale}&populate=*`;
    const skillUrl = `${this.url}/api/competence?locale=${locale}&populate=*`;
    const servicesUrl = `${this.url}/api/service?locale=${locale}&populate=*`;
    const contactUrl = `${this.url}/api/contact?locale=${locale}&populate=*`;

    return forkJoin([
      this.http.get<any>(showcaseUrl),
      this.http.get<any>(skillUrl),
      this.http.get<any>(servicesUrl),
      this.http.get<any>(contactUrl)
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
