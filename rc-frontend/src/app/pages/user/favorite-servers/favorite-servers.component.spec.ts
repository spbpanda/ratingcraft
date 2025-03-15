import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FavoriteServersComponent } from './favorite-servers.component';

describe('FavoriteServersComponent', () => {
  let component: FavoriteServersComponent;
  let fixture: ComponentFixture<FavoriteServersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FavoriteServersComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FavoriteServersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
