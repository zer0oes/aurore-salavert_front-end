import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CustomService, Gallery } from '@app/models/frontend/project';
import { environment } from '../../../../environments/environment';


@Component({
  selector: 'custom-services',
  templateUrl: './custom-services.component.html',
  styleUrls: ['./custom-services.component.scss'],
})
export class CustomServicesComponent implements OnInit, OnDestroy {
  @Input() services: Array<CustomService> = [];
  @Input() slideInterval: number = 10000;
  @Input() currentImageId: number | null = null;
  @Input() autoSlideTimer: any;
  private url = environment.url;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadServices();
    this.autoSlideImages();
  }

  ngOnDestroy(): void {
    this.pauseSlider();
  }

  loadServices(): void {
    this.http.get<{ data: any }>(`${this.url}api/service?populate=*`).subscribe(
      (response) => {
        const item = response.data;
        this.services = [{
          slug: item.attributes.slug,
          title: item.attributes.Title,
          text: item.attributes.Text,
          gallery: item.attributes.Gallery.data.map((g: { id: number; attributes: { url: string; alternativeText: string } }) => ({
            id: g.id,
            img: this.url + g.attributes.url,
            alt: g.attributes.alternativeText
          })) as Gallery[],
        }];
        if (this.services[0]?.gallery?.length > 0) {
          this.currentImageId = this.services[0].gallery[0].id;
        }
      },
      (error) => {
        console.error('Erreur lors du chargement des services:', error);
      }
    );
  }

  selectImage(imageId: number): void {
    this.currentImageId = imageId;
  }

  onNextClick(service: CustomService): void {
    const currentImageIndex = service.gallery.findIndex(img => img.id === this.currentImageId);
    if (currentImageIndex === service.gallery.length - 1) {
      this.currentImageId = service.gallery[0].id;
    } else {
      this.currentImageId = service.gallery[currentImageIndex + 1].id;
    }
    this.pauseSlider();
    this.autoSlideImages();
  }
  

  autoSlideImages(): void {
    this.autoSlideTimer = setInterval(() => {
      if (this.services.length > 0) {
        this.onNextClick(this.services[0]);
      }
    }, this.slideInterval);
  }

  pauseSlider(): void {
    clearInterval(this.autoSlideTimer);
  }
}
