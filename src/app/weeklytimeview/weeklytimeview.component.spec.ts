import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeeklytimeviewComponent } from './weeklytimeview.component';

describe('WeeklytimeviewComponent', () => {
  let component: WeeklytimeviewComponent;
  let fixture: ComponentFixture<WeeklytimeviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WeeklytimeviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WeeklytimeviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
