import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        loadChildren: () => import('./pages/home/home.module').then(m => m.HomeModule)
      },
      {
        path: 'project/:slug',
        loadChildren: () => import('./pages/project-detail/project-detail.module').then(m => m.ProjectDetailModule)
      },
      {
        path: 'privacy-policy',
        loadChildren: () => import('./pages/policy-privacy/policy-privacy.module').then(m => m.PolicyPrivacyModule)
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
