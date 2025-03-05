import { TestBed } from '@angular/core/testing';

import { RcBackendService } from './rc-backend.service';

describe('RcBackendService', () => {
  let service: RcBackendService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RcBackendService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
