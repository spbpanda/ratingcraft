import { TestBed } from '@angular/core/testing';

import { SbiDadataAddressService } from './sbi-dadata-address.service';

describe('SbiDadataAddressService', () => {
  let service: SbiDadataAddressService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SbiDadataAddressService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
