import { Component, Input, OnInit, OnDestroy, HostListener } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CustomService, Gallery } from '@app/models/frontend/project';
import { environment } from '@src/environment';
import { LocaleService } from '@app/services/locale.service';

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

  private touchStartX: number = 0;
  private touchEndX: number = 0;
  private swipeThreshold: number = 50;

  constructor(private http: HttpClient, private localeService: LocaleService) {}

  ngOnInit(): void {
    this.loadServices();
    this.autoSlideImages();
  }

  ngOnDestroy(): void {
    this.pauseSlider();
  }

  loadServices(): void {
    const locale = this.localeService.getLocale();
    this.http.get<{ data: any }>(`${this.url}/api/service?populate=*&locale=${locale}`).subscribe(
      (response) => {
        const item = response.data;
        this.services = [{
          slug: item.slug,
          title: item.Title,
          text: item.Text,
          gallery: item.Gallery.map((g: { id: number; name: string; alternativeText: string; url: string }) => ({
            id: g.id,
            img: g.url.startsWith('http') ? g.url : this.url + g.url, 
            alt: g.alternativeText || 'No alternative text'
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

  onPrevClick(service: CustomService): void {
    const currentImageIndex = service.gallery.findIndex(img => img.id === this.currentImageId);
    if (currentImageIndex === 0) {
      this.currentImageId = service.gallery[service.gallery.length - 1].id;
    } else {
      this.currentImageId = service.gallery[currentImageIndex - 1].id;
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

  @HostListener('touchstart', ['$event'])
  onTouchStart(event: TouchEvent): void {
    this.touchStartX = event.changedTouches[0].screenX;
  }

  @HostListener('touchend', ['$event'])
  onTouchEnd(event: TouchEvent): void {
    this.touchEndX = event.changedTouches[0].screenX;
    this.handleSwipe();
  }

  handleSwipe(): void {
    const swipeDistance = this.touchStartX - this.touchEndX;
    if (this.services.length > 0) {
      if (swipeDistance > this.swipeThreshold) {
        this.onNextClick(this.services[0]);
      } else if (swipeDistance < -this.swipeThreshold) {
        this.onPrevClick(this.services[0]);
      }
    }
  }
}