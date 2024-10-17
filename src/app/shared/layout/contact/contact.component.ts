import { HttpClient } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { Contact } from '@app/models/frontend/project';
import { LocaleService } from '@app/services/locale.service';
import { environment } from '@src/environment';

@Component({
  selector: 'contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent {
  private url = environment.url;
  contactDescriptionHtml: string = '';
  
  constructor(private http: HttpClient, private localeService: LocaleService) { }

  @Input() contactInfos: Array<Contact> = [];

  ngOnInit(): void {
    const locale = this.localeService.getLocale();
    this.http.get(`${this.url}/api/contact?populate=*&locale=${locale}`).subscribe(
      (response: any) => {
        const contactData = response.data;
  
        if (contactData) {
          const pictureUrl = contactData.picture?.url 
            ? (contactData.picture.url.startsWith('http') 
                ? contactData.picture.url 
                : this.url + contactData.picture.url) 
            : null;

          const signatureUrl = contactData.Signature?.url 
            ? (contactData.Signature.url.startsWith('http') 
                ? contactData.Signature.url 
                : this.url + contactData.Signature.url) 
            : null;

          const contact: Contact = {
            slug: contactData.slug || 'no-slug',
            title: contactData.Title || 'No Title',
            email: contactData.Email || 'No Email',
            picture: pictureUrl || null,
            desc: this.convertMarkdownToHtml(contactData.Description || 'No Description available'),
            signature: signatureUrl || null,
          };
  
          this.contactInfos.push(contact);
        } else {
          console.error("Les données de contact sont manquantes ou mal structurées.");
        }
      },
      (error) => {
        console.error("Erreur lors du chargement des données de contact:", error);
      }
    );
  }

  private convertMarkdownToHtml(markdown: string): string {
    if (!markdown) return '';
    let html = markdown
      .split(/\n+/)
      .map(line => `<p>${line}</p>`)
      .join('');
    
    // Conversion des éléments Markdown en HTML
    html = html
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\_(.*?)\_/g, '<em>$1</em>')
      .replace(/\<u\>(.*?)\<\/u\>/g, '<u>$1</u>')
      .replace(/\[([^\]]+)\]\((https?:\/\/[^\)]+)\)/g, '<a href="$2" target="_blank">$1</a>');

    return html;
  }
}
