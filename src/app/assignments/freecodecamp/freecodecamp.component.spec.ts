import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FreecodecampComponent } from './freecodecamp.component';

describe('FreecodecampComponent', () => {
  let component: FreecodecampComponent;
  let fixture: ComponentFixture<FreecodecampComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FreecodecampComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FreecodecampComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
