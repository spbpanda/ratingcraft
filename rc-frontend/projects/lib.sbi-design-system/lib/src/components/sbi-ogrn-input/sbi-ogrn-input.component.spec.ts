import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SbiOgrnInputComponent } from './sbi-ogrn-input.component';

describe('SbiOgrnInputComponent', () => {
  let component: SbiOgrnInputComponent;
  let fixture: ComponentFixture<SbiOgrnInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SbiOgrnInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SbiOgrnInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});