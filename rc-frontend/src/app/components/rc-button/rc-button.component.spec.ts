import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RcButtonComponent } from './rc-button.component';

describe('RcButtonComponent', () => {
  let component: RcButtonComponent;
  let fixture: ComponentFixture<RcButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RcButtonComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RcButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
