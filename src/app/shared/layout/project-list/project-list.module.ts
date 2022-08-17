import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectListComponent } from './project-list.component';
import { ProjectModule } from '../project/project.module';



@NgModule({
  declarations: [
    ProjectListComponent
  ],
  imports: [
    CommonModule,
    ProjectModule
  ],
  exports: [
    ProjectListComponent,
    ProjectModule
  ]
})
export class ProjectListModule { }
