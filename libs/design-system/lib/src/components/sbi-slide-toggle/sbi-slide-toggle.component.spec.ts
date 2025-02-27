import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SbiSlideToggleComponent } from './sbi-slide-toggle.component';

describe('SbiSlideToggleComponent', () => {
  let component: SbiSlideToggleComponent;
  let fixture: ComponentFixture<SbiSlideToggleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SbiSlideToggleComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SbiSlideToggleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
