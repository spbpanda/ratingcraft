import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SbiProgressBarComponent } from './sbi-progress-bar.component';

describe('SbiProgressBarComponent', () => {
  let component: SbiProgressBarComponent;
  let fixture: ComponentFixture<SbiProgressBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SbiProgressBarComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SbiProgressBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
