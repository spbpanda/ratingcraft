import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServerBannerComponent } from './server-banner.component';

describe('ServerBannerComponent', () => {
  let component: ServerBannerComponent;
  let fixture: ComponentFixture<ServerBannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServerBannerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ServerBannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
