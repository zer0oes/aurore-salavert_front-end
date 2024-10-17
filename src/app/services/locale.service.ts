import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LocaleService {
  private locale: string;

  constructor() {
    const userLanguage = navigator.language || navigator.languages[0];
    this.locale = userLanguage.startsWith('fr') ? 'fr' : 'en';
  }

  getLocale(): string {
    return this.locale;
  }
}