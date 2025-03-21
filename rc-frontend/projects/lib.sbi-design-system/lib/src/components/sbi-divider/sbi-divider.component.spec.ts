import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SbiDividerComponent } from './sbi-divider.component';

describe('SbiDividerComponent', () => {
  let component: SbiDividerComponent;
  let fixture: ComponentFixture<SbiDividerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SbiDividerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SbiDividerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
