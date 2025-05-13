import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { SbiInnInputComponent } from './sbi-inn-input.component';

describe('SbiPhoneInputComponent', () => {
  let component: SbiInnInputComponent;
  let fixture: ComponentFixture<SbiInnInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SbiInnInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SbiInnInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});