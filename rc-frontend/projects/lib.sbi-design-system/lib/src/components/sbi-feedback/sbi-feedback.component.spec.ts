import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SbiFeedbackComponent } from './sbi-feedback.component';

describe('SbiFeedbackComponent', () => {
  let component: SbiFeedbackComponent;
  let fixture: ComponentFixture<SbiFeedbackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SbiFeedbackComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SbiFeedbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
