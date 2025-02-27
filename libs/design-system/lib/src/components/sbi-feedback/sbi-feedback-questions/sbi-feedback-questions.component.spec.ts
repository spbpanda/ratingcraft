import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SbiFeedbackQuestionsComponent } from './sbi-feedback-questions.component';

describe('SbiFeedbackQuestionsComponent', () => {
  let component: SbiFeedbackQuestionsComponent;
  let fixture: ComponentFixture<SbiFeedbackQuestionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SbiFeedbackQuestionsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SbiFeedbackQuestionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
