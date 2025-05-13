import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SbiRadioButtonGroupComponent } from './sbi-radio-button-group.component';

describe('SbiRadioButtonComponent', () => {
  let component: SbiRadioButtonGroupComponent;
  let fixture: ComponentFixture<SbiRadioButtonGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
        imports: [SbiRadioButtonGroupComponent]
      })
      .compileComponents();

    fixture = TestBed.createComponent(SbiRadioButtonGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
