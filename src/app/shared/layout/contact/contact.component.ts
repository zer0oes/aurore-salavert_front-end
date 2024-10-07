import { HttpClient } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { Contact } from '@app/models/frontend/project';
import { environment } from '@src/environment';

@Component({
  selector: 'contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent  {
  private url = environment.url;
  
  constructor(private http: HttpClient) { }

  @Input() contactInfos: Array<Contact> = [];

  ngOnInit(): void {
    this.http.get(`${this.url}/api/contact?populate=*`).subscribe(
      (response: any) => {
        const contactData = response?.data;

        if (contactData) {
          const contact: Contact = {
            slug: contactData.slug || 'no-slug',
            title: contactData.Title || 'No Title',
            email: contactData.Email || 'No Email'
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
}
