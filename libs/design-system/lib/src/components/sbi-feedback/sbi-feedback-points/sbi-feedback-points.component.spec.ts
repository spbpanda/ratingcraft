import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SbiFeedbackPointsComponent } from './sbi-feedback-points.component';

describe('SbiFeedbackPointsComponent', () => {
  let component: SbiFeedbackPointsComponent;
  let fixture: ComponentFixture<SbiFeedbackPointsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SbiFeedbackPointsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SbiFeedbackPointsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
