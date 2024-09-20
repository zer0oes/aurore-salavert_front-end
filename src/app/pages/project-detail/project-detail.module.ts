import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectDetailRoutingModule } from './project-detail-routing.module';
import { ProjectDetailComponent } from './project-detail.component';
import { HttpClientModule } from '@angular/common/http'; // Assure-toi que ceci est importé

@NgModule({
  declarations: [ProjectDetailComponent],
  imports: [
    CommonModule,
    ProjectDetailRoutingModule,
    HttpClientModule // Ajoute HttpClientModule ici
  ]
})
export class ProjectDetailModule { }
