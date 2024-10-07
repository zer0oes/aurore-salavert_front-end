import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { SliderItems } from '@app/models/frontend/project';
import { environment } from '../../../../environments/environment';


@Component({
  selector: 'slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss'],

})
export class SliderComponent implements OnInit {
  constructor(private http: HttpClient) { }

  @Input() images: Array<SliderItems> = [];
  @Input() selectedIndex: number = 0;
  @Input() dots: boolean = true;
  @Input() arrows: boolean = true;
  @Input() autoSlide: boolean = true;
  @Input() slideInterval: number = 30000;
  @Input() slideIntervalId: any;

  private url = environment.url;

  ngOnInit(): void {
    this.http.get(`${this.url}api/slider-item?populate=*`).subscribe((sliderItem: any) => {
      sliderItem.data.attributes.Gallery.data.forEach((item: any) => {
        let newImages: SliderItems = {
          imgSrc: this.url + item.attributes.url,
          imgAlt: item.attributes.alternativeText
        };

        this.images.push(newImages);
      });
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
    setInterval(() => {
      this.onNextClick();
    }, this.slideInterval);
  }

  pauseSlider(): void {
    clearInterval(this.slideInterval);
  }
}
