import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomServicesComponent } from './custom-services.component';



@NgModule({
  declarations: [
    CustomServicesComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    CustomServicesComponent
  ]
})
export class CustomServicesModule { }
