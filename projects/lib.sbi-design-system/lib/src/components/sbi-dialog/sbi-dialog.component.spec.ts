import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SbiDialogComponent } from './sbi-dialog.component';

describe('SbiDialogComponent', () => {
  let component: SbiDialogComponent;
  let fixture: ComponentFixture<SbiDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SbiDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SbiDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
