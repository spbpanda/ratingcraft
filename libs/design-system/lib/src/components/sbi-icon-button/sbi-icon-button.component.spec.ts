import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SbiIconButtonComponent } from './sbi-icon-button.component';

describe('SbiIconButtonComponent', () => {
  let component: SbiIconButtonComponent;
  let fixture: ComponentFixture<SbiIconButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SbiIconButtonComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SbiIconButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
