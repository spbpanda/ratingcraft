import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SbiCardElementComponent } from './sbi-card-element.component';

describe('SbiCardElementComponent', () => {
  let component: SbiCardElementComponent;
  let fixture: ComponentFixture<SbiCardElementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SbiCardElementComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SbiCardElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
