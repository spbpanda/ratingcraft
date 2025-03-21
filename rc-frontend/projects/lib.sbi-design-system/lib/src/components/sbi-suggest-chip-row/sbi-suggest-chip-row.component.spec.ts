import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SbiSuggestChipRowComponent } from './sbi-suggest-chip-row.component';

describe('SbiSuggestChipRowComponent', () => {
  let component: SbiSuggestChipRowComponent;
  let fixture: ComponentFixture<SbiSuggestChipRowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SbiSuggestChipRowComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SbiSuggestChipRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
