import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SbiSnackbarComponent } from './sbi-snackbar.component';

describe('SbiSnackbarComponent', () => {
  let component: SbiSnackbarComponent;
  let fixture: ComponentFixture<SbiSnackbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SbiSnackbarComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SbiSnackbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
