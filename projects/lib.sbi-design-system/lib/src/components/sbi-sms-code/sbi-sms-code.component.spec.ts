import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SbiSmsCodeComponent } from './sbi-sms-code.component';

describe('SbiSmsCodeComponent', () => {
  let component: SbiSmsCodeComponent;
  let fixture: ComponentFixture<SbiSmsCodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SbiSmsCodeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SbiSmsCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
