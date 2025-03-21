import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SbiActionCardComponent } from './sbi-action-card.component';

describe('SbiActionCardComponent', () => {
  let component: SbiActionCardComponent;
  let fixture: ComponentFixture<SbiActionCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SbiActionCardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SbiActionCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
