import { TestBed } from '@angular/core/testing';

import { SbiStepperService } from './sbi-stepper.service';

describe('SbiStepperService', () => {
  let service: SbiStepperService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SbiStepperService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
