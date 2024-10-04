import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeRoutingModule } from './home-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { ContactModule, CustomServicesModule, ProjectListModule, SkillsModule, SliderModule } from '@app/shared';
import { HomeComponent } from './home.component';
<<<<<<< HEAD
import { ContactComponent } from '@app/components/contact/contact.component';
import { ServicesComponent } from '@app/components/services/services.component';
=======
>>>>>>> master


@NgModule({
  declarations: [
    HomeComponent,
<<<<<<< HEAD
    ContactComponent,
    ServicesComponent
=======
>>>>>>> master
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    HttpClientModule,
    ProjectListModule,
    SliderModule,
    SkillsModule,
    ContactModule,
    CustomServicesModule
  ]
})
export class HomeModule { }
