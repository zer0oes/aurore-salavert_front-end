import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectFiltersComponent } from './project-filters.component';



@NgModule({
  declarations: [
    ProjectFiltersComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    ProjectFiltersComponent,
  ]
})
export class ProjectFiltersModule { }
