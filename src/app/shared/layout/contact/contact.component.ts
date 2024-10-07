import { HttpClient } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { Contact } from '@app/models/frontend/project';
import { environment } from '../../../../environments/environment';


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
    this.http.get(`${this.url}api/contact?populate=*`).subscribe((response: any) => {
      const contactData = response.data;

      const contact: Contact = {
        slug: contactData.attributes.slug,
        title: contactData.attributes.Title,
        email: contactData.attributes.Email
      };

      this.contactInfos.push(contact);
    });
  }
}
