import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SbiCheckboxComponent } from './sbi-checkbox.component';

describe('SbiCheckboxComponent', () => {
  let component: SbiCheckboxComponent;
  let fixture: ComponentFixture<SbiCheckboxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SbiCheckboxComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SbiCheckboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
