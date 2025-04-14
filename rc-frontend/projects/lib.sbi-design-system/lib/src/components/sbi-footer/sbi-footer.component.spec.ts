import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SbiFooterComponent } from './sbi-footer.component';

describe('SbiFooterComponent', () => {
  let component: SbiFooterComponent;
  let fixture: ComponentFixture<SbiFooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SbiFooterComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SbiFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
