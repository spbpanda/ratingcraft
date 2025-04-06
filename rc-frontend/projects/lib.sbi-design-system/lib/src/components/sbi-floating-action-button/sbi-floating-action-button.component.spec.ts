import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SbiFloatingActionButtonComponent } from './sbi-floating-action-button.component';

describe('SbiFloatingActionButtonComponent', () => {
  let component: SbiFloatingActionButtonComponent;
  let fixture: ComponentFixture<SbiFloatingActionButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SbiFloatingActionButtonComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SbiFloatingActionButtonComponent);
    component = fixture.componentInstance;
    
    component.icon = '<svg></svg>';
    
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
}); 