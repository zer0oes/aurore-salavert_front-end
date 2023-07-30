import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeRoutingModule } from './home-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { ProjectListModule, SkillsModule, SliderModule } from '@app/shared';
import { HomeComponent } from './home.component';


@NgModule({
  declarations: [
    HomeComponent,
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
