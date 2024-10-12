import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { PolicyPrivacyComponent } from './policy-privacy.component';
import { PolicyPrivacyRoutingModule } from './policy-privacy-routing.module';

@NgModule({
  declarations: [PolicyPrivacyComponent],
  imports: [
    CommonModule,
    PolicyPrivacyRoutingModule,
    HttpClientModule
  ]
})
export class PolicyPrivacyModule { }
