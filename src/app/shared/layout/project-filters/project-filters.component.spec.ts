import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectFiltersComponent } from './project-filters.component';

describe('ProjectFiltersComponent', () => {
  let component: ProjectFiltersComponent;
  let fixture: ComponentFixture<ProjectFiltersComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProjectFiltersComponent]
    });
    fixture = TestBed.createComponent(ProjectFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
