import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SbiSuggestChipComponent } from './sbi-suggest-chip.component';

describe('SbiSuggestChipComponent', () => {
  let component: SbiSuggestChipComponent;
  let fixture: ComponentFixture<SbiSuggestChipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SbiSuggestChipComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SbiSuggestChipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
