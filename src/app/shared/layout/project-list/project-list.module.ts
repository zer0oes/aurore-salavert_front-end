import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectListComponent } from './project-list.component';
import { ProjectModule } from '../project/project.module';
import { ProjectFiltersModule } from '../project-filters/project-filters.module';



@NgModule({
  declarations: [
    ProjectListComponent,
  ],
  imports: [
    CommonModule,
    ProjectModule,
    ProjectFiltersModule,
  ],
  exports: [
    ProjectListComponent,
    ProjectModule,
  ]
})
export class ProjectListModule { }
