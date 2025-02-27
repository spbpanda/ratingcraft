import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SbiMultiAutocompleteComponent } from './sbi-multi-autocomplete.component';

describe('SbiMultiAutocompleteComponent', () => {
  let component: SbiMultiAutocompleteComponent;
  let fixture: ComponentFixture<SbiMultiAutocompleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SbiMultiAutocompleteComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SbiMultiAutocompleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
