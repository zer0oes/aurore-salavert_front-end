import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@src/environment';
import { BehaviorSubject, catchError, forkJoin, map, Observable, of } from 'rxjs';
import { LocaleService } from './locale.service';
import { applyMenuLabels, MenuItem, MenuSection } from './menu-labels';

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
    return this.getSections();
  }

  getNavigationItems(): Observable<MenuItem[]> {
    const locale = this.localeService.getLocale();
    return forkJoin([
      this.getSections(),
      this.getOptionalContent(`${this.url}/api/menu?locale=${locale}`)
    ]).pipe(map(([sections, labels]) => applyMenuLabels(sections, labels, locale)));
  }

  private getSections(): Observable<MenuSection[]> {
    const locale = this.localeService.getLocale(); // Obtention de la locale actuelle

    // Ajoute le paramètre `?locale=`
    const showcaseUrl = `${this.url}/api/showcase?locale=${locale}&populate=*`;
    const skillUrl = `${this.url}/api/competence?locale=${locale}&populate=*`;
    const servicesUrl = `${this.url}/api/service?locale=${locale}&populate=*`;
    const contactUrl = `${this.url}/api/contact?locale=${locale}&populate=*`;

    return forkJoin([
      this.getOptionalContent(showcaseUrl),
      this.getOptionalContent(skillUrl),
      this.getOptionalContent(servicesUrl),
      this.getOptionalContent(contactUrl)
    ]).pipe(
      map((responses: any[]) => {
        const labelFields = ['ShowcaseLabel', 'SkillsLabel', 'ServicesLabel', 'ContactLabel'];
        return responses.flatMap((response, index) => {
          if (response && response.data) {
            if (Array.isArray(response.data)) {
              return response.data.map((item: any) => this.mapMenuItem(item, labelFields[index]));
            } else {
              return [this.mapMenuItem(response.data, labelFields[index])];
            }
          } else {
            return [];
          }
        });
      })
    );
  }

  private getOptionalContent(url: string): Observable<any> {
    return this.http.get<any>(url).pipe(
      catchError(() => of({ data: null }))
    );
  }

  private mapMenuItem(item: any, labelField: string): MenuSection {
    const content = item.attributes || item;
    const title = content.Title || content.title || 'Untitled';
    const slug = content.slug || 'default-slug';
    return { title, slug, labelField };
  }
}
