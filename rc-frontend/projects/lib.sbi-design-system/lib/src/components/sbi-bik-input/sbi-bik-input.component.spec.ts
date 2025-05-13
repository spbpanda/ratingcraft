import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SbiBikInputComponent } from './sbi-bik-input.component';

describe('SbiPhoneInputComponent', () => {
  let component: SbiBikInputComponent;
  let fixture: ComponentFixture<SbiBikInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SbiBikInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SbiBikInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});