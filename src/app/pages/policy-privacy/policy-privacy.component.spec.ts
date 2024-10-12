import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PolicyPrivacyComponent } from './policy-privacy.component';

describe('PolicyPrivacyComponent', () => {
  let component: PolicyPrivacyComponent;
  let fixture: ComponentFixture<PolicyPrivacyComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PolicyPrivacyComponent]
    });
    fixture = TestBed.createComponent(PolicyPrivacyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
