import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { CookieBannerComponent } from './cookie-banner.component';

describe('CookieBannerComponent', () => {
  let component: CookieBannerComponent;
  let fixture: ComponentFixture<CookieBannerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CookieBannerComponent],
      imports: [HttpClientTestingModule]
    });
    fixture = TestBed.createComponent(CookieBannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
