import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SbiPromoCodeModalFormComponent } from './sbi-promo-code-modal-form.component';

describe('PromocodeModalFormComponent', () => {
  let component: SbiPromoCodeModalFormComponent;
  let fixture: ComponentFixture<SbiPromoCodeModalFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SbiPromoCodeModalFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SbiPromoCodeModalFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
