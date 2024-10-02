import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CustomService, Gallery } from '@app/models/frontend/project'; 

@Component({
  selector: 'custom-services',
  templateUrl: './custom-services.component.html',
  styleUrls: ['./custom-services.component.scss'],
})
export class CustomServicesComponent implements OnInit {
  services: CustomService[] = [];
  private apiUrl = 'http://localhost:1337/api/service?populate=*';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadServices();
  }

  loadServices(): void {
    this.http.get<{ data: any[] }>(this.apiUrl).subscribe(
      (response) => {
        this.services = response.data.map(item => ({
          title: item.attributes.title,
          text: item.attributes.text,
          gallery: item.attributes.gallery.map((g: { id: number; img: string; alt: string }) => ({
            id: g.id,
            img: g.img,
            alt: g.alt
          })) as Gallery[],
        }));
      },
      (error) => {
        console.error('Erreur lors du chargement des services:', error);
      }
    );
  }
}
