import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SbiDocumentModalFormComponent } from './sbi-document-modal-form.component';

describe('DocumentModalFormComponent', () => {
  let component: SbiDocumentModalFormComponent;
  let fixture: ComponentFixture<SbiDocumentModalFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
        imports: [SbiDocumentModalFormComponent]
      })
      .compileComponents();

    fixture = TestBed.createComponent(SbiDocumentModalFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
