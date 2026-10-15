import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SliderComponent } from './slider.component';


@NgModule({
  declarations: [
    SliderComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
  ],
  exports: [
    SliderComponent
  ]
})
export class SliderModule { }
