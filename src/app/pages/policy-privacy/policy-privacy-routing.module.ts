import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PolicyPrivacyComponent } from './policy-privacy.component';

const routes: Routes = [
  { path: '', component: PolicyPrivacyComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PolicyPrivacyRoutingModule { }
