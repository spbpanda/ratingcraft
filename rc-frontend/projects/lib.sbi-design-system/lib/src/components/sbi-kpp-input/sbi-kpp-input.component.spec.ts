import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SbiKppInputComponent } from './sbi-kpp-input.component';

describe('SbiKppInputComponent', () => {
  let component: SbiKppInputComponent;
  let fixture: ComponentFixture<SbiKppInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SbiKppInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SbiKppInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});