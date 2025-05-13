import { TestBed } from '@angular/core/testing';

import { SbiMetricsService } from './sbi-metrics.service';

describe('SbiMetricsService', () => {
  let service: SbiMetricsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SbiMetricsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
