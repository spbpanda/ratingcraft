import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SbiOptionalCardComponent } from './sbi-optional-card.component';

describe('SbiCardComponent', () => {
  let component: SbiOptionalCardComponent;
  let fixture: ComponentFixture<SbiOptionalCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
        imports: [SbiOptionalCardComponent]
      })
      .compileComponents();

    fixture = TestBed.createComponent(SbiOptionalCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
