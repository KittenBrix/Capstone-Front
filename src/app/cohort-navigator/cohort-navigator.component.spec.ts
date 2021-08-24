import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CohortNavigatorComponent } from './cohort-navigator.component';

describe('CohortNavigatorComponent', () => {
  let component: CohortNavigatorComponent;
  let fixture: ComponentFixture<CohortNavigatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CohortNavigatorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CohortNavigatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
