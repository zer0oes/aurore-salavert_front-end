import { HttpClient } from '@angular/common/http';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent {
  constructor(private http: HttpClient) { }

  @Input() title: string = 'Let’s work together';
  @Input() email: string = 'hello@aurore-salavert.fr';
}
