import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SbiQuestionInfoComponent } from './sbi-question-info.component';

describe('SbiQuestionInfoComponent', () => {
  let component: SbiQuestionInfoComponent;
  let fixture: ComponentFixture<SbiQuestionInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SbiQuestionInfoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SbiQuestionInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
