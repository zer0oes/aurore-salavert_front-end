import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { SliderItems } from '@app/models/frontend/project';

@Component({
  selector: 'slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss'],

})
export class SliderComponent implements OnInit {
  constructor(private http: HttpClient) { }

  @Input() images: Array<SliderItems> = [];
  @Input() indicators: boolean = true;
  @Input() arrows: boolean = true;

  selectedIndex: number = 0;

  ngOnInit(): void {
    this.http.get('http://localhost:1337/api/slider-item?populate=*').subscribe((sliderItem: any) => {

      /**TODO: DEFINE TYPE OF element */
      sliderItem.data.attributes.Gallery.data.forEach((item: any) => {
        let newImages: SliderItems = {
          imgSrc: 'http://localhost:1337' + item.attributes.url,
          imgAlt: 'http://localhost:1337' + item.attributes.alternativeText
        }

        this.images.push(newImages);
      });
    });
  }

  // set index of image on click on a dot/indocator
  selectImage(index: number): void {
    this.selectedIndex = index
  }

  // go to previous image
  onPrevClick(): void {
    if (this.selectedIndex === 0) {
      this.selectedIndex = this.images.length - 1;
    } else {
      this.selectedIndex--;
    }
  }

  // go to next image
  onNextClick(): void {
    if (this.selectedIndex === this.images.length - 1) {
      this.selectedIndex = 0;
    } else {
      this.selectedIndex++;
    }
  }
}
