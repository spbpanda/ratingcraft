import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SbiStepperComponent } from './sbi-stepper.component';

describe('SbiStepperComponent', () => {
  let component: SbiStepperComponent;
  let fixture: ComponentFixture<SbiStepperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SbiStepperComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SbiStepperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
