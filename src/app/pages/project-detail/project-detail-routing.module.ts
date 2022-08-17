import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProjectDetailComponent } from './project-detail.component';

const routes: Routes = [
  {
    path: '',
    // data: ,
    component: ProjectDetailComponent,
    children: []
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProjectDetailRoutingModule { }
