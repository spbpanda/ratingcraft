import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SbiTooltipComponent } from './sbi-tooltip.component';

describe('SbiTooltipComponent', () => {
  let component: SbiTooltipComponent;
  let fixture: ComponentFixture<SbiTooltipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SbiTooltipComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SbiTooltipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
