import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SbiEmailInputComponent } from './sbi-email-input.component';

describe('SbiPhoneInputComponent', () => {
  let component: SbiEmailInputComponent;
  let fixture: ComponentFixture<SbiEmailInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SbiEmailInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SbiEmailInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});