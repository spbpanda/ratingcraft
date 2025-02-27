import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SbiBadgeComponent } from './sbi-badge.component';

describe('SbiBadgeComponent', () => {
  let component: SbiBadgeComponent;
  let fixture: ComponentFixture<SbiBadgeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SbiBadgeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SbiBadgeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
