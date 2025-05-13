import { TestBed } from '@angular/core/testing';

import { YandexMetrikaService } from './yandex-metrika.service';

describe('YandexMetrikaService', () => {
  let service: YandexMetrikaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(YandexMetrikaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
