import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeRoutingModule } from './home-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { ProjectListModule, SkillsModule, SliderModule } from '@app/shared';
import { HomeComponent } from './home.component';
import { ContactComponent } from '@app/components/contact/contact.component';
import { ServicesComponent } from '@app/components/services/services.component';


@NgModule({
  declarations: [
    HomeComponent,
    ContactComponent,
    ServicesComponent
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    HttpClientModule,
    ProjectListModule,
    SliderModule,
    SkillsModule,
  ]
})
export class HomeModule { }
