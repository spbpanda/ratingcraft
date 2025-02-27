import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SbiRadioButtonComponent } from './sbi-radio-button.component';

describe('SbiRadioButtonComponent', () => {
  let component: SbiRadioButtonComponent;
  let fixture: ComponentFixture<SbiRadioButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SbiRadioButtonComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SbiRadioButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
