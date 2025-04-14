import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoostServerComponent } from './boost-server.component';

describe('BoostServerComponent', () => {
  let component: BoostServerComponent;
  let fixture: ComponentFixture<BoostServerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BoostServerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BoostServerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
