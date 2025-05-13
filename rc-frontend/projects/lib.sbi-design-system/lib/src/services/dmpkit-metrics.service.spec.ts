import { TestBed } from '@angular/core/testing';

import { DmpkitMetricsService } from './dmpkit-metrics.service';

describe('DmpkitMetricsService', () => {
  let service: DmpkitMetricsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DmpkitMetricsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
