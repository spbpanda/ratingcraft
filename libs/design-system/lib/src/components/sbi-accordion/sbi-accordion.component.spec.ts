import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SbiAccordionComponent } from './sbi-accordion.component';

describe('SbiAccordionComponent', () => {
  let component: SbiAccordionComponent;
  let fixture: ComponentFixture<SbiAccordionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SbiAccordionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SbiAccordionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
