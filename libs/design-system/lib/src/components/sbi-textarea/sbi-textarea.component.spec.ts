import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SbiTextareaComponent } from './sbi-textarea.component';

describe('SbiTextareaComponent', () => {
  let component: SbiTextareaComponent;
  let fixture: ComponentFixture<SbiTextareaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SbiTextareaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SbiTextareaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
