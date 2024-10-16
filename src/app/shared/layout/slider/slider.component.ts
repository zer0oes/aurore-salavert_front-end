import { HttpClient } from '@angular/common/http';
import { Component, HostListener, Input, OnInit } from '@angular/core';
import { SliderItems } from '@app/models/frontend/project';
import { environment } from '@src/environment';

@Component({
  selector: 'slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss'],
})
export class SliderComponent implements OnInit {
  constructor(private http: HttpClient) {}

  @Input() images: Array<SliderItems> = [];
  @Input() selectedIndex: number = 0;
  @Input() dots: boolean = true;
  @Input() arrows: boolean = true;
  @Input() autoSlide: boolean = true;
  @Input() slideInterval: number = 25000;
  @Input() slideIntervalId: any;

  private url = environment.url;
  private touchStartX: number = 0;
  private touchEndX: number = 0;
  private swipeThreshold: number = 50;

  ngOnInit(): void {
    this.http.get(`${this.url}/api/slider-item?populate=*`).subscribe((sliderItem: any) => {
      if (sliderItem && sliderItem.data && sliderItem.data.Gallery && sliderItem.data.Gallery.length > 0) {
        sliderItem.data.Gallery.forEach((item: any) => {
          let newImage: SliderItems = {
            imgSrc: item.url.startsWith('http') ? item.url : this.url + item.url,
            imgAlt: item.alternativeText || 'No description available',
          };

          this.images.push(newImage);
        });
      } else {
        console.error("La galerie du slider est vide ou absente.");
      }
    });

    if (this.autoSlide) {
      this.autoSlideImages();
    }
  }

  ngOnDestroy(): void {
    this.pauseSlider();
  }

  selectImage(index: number): void {
    this.selectedIndex = index;
  }

  onPrevClick(): void {
    if (this.selectedIndex === 0) {
      this.selectedIndex = this.images.length - 1;
    } else {
      this.selectedIndex--;
    }
    this.pauseSlider();
  }

  onNextClick(fromAutoSlide: boolean = false): void {
    if (this.selectedIndex === this.images.length - 1) {
      this.selectedIndex = 0;
    } else {
      this.selectedIndex++;
    }
    if (!fromAutoSlide) {
      this.pauseSlider();
    }
  } 

  autoSlideImages(): void {
    this.slideIntervalId = setInterval(() => {
      this.onNextClick(true);
    }, this.slideInterval);
  }

  pauseSlider(): void {
    clearInterval(this.slideIntervalId);
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
    if (swipeDistance > this.swipeThreshold) {
      this.onNextClick();
    } else if (swipeDistance < -this.swipeThreshold) {
      this.onPrevClick();
    }
  }
}
