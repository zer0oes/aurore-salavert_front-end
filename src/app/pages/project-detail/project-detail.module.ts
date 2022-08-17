import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectDetailComponent } from './project-detail.component';
import { ProjectListModule } from '@app/shared/layout/project-list/project-list.module';
import { ProjectDetailRoutingModule } from './project-detail-routing.module';

@NgModule({
  declarations: [
    ProjectDetailComponent
  ],
  imports: [
    CommonModule,
    ProjectDetailRoutingModule,
    ProjectListModule
  ]
})
export class ProjectDetailModule { }
