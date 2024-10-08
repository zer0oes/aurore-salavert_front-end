import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
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
  @Input() slideInterval: number = 30000;
  @Input() slideIntervalId: any;

  private url = environment.url;

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

  onNextClick(): void {
    if (this.selectedIndex === this.images.length - 1) {
      this.selectedIndex = 0;
    } else {
      this.selectedIndex++;
    }
    this.pauseSlider();
  }

  autoSlideImages(): void {
    this.slideIntervalId = setInterval(() => {
      this.onNextClick();
    }, this.slideInterval);
  }

  pauseSlider(): void {
    clearInterval(this.slideIntervalId);
  }
}
