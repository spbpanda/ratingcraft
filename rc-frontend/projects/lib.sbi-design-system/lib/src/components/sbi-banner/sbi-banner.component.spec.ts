import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SbiBannerComponent } from './sbi-banner.component';

describe('SbiBannerComponent', () => {
  let component: SbiBannerComponent;
  let fixture: ComponentFixture<SbiBannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SbiBannerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SbiBannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
