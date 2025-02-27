import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SbiDarkSliderComponent } from './sbi-dark-slider.component';

describe('SbiDarkSliderComponent', () => {
  let component: SbiDarkSliderComponent;
  let fixture: ComponentFixture<SbiDarkSliderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SbiDarkSliderComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SbiDarkSliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
