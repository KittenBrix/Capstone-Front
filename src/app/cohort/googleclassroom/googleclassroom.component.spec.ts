import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GoogleclassroomComponent } from './googleclassroom.component';

describe('GoogleclassroomComponent', () => {
  let component: GoogleclassroomComponent;
  let fixture: ComponentFixture<GoogleclassroomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GoogleclassroomComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GoogleclassroomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
