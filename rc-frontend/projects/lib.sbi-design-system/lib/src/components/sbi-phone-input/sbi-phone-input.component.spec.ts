import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { SbiPhoneInputComponent } from './sbi-phone-input.component';

describe('SbiPhoneInputComponent', () => {
  let component: SbiPhoneInputComponent;
  let fixture: ComponentFixture<SbiPhoneInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SbiPhoneInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SbiPhoneInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});