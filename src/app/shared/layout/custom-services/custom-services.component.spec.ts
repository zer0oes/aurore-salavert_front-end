import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomServicesComponent } from './custom-services.component';

describe('CustomServicesComponent', () => {
  let component: CustomServicesComponent;
  let fixture: ComponentFixture<CustomServicesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CustomServicesComponent]
    });
    fixture = TestBed.createComponent(CustomServicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
