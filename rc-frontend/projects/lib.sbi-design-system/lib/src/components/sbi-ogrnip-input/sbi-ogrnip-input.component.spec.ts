import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SbiOgrnipInputComponent } from './sbi-ogrnip-input.component';

describe('SbiOgrnipInputComponent', () => {
  let component: SbiOgrnipInputComponent;
  let fixture: ComponentFixture<SbiOgrnipInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SbiOgrnipInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SbiOgrnipInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});