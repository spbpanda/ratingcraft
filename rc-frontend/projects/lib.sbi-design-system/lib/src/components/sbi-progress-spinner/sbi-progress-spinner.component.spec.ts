import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SbiProgressSpinnerComponent } from './sbi-progress-spinner.component';

describe('SbiProgressSpinnerComponent', () => {
  let component: SbiProgressSpinnerComponent;
  let fixture: ComponentFixture<SbiProgressSpinnerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SbiProgressSpinnerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SbiProgressSpinnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
