import { TestBed } from '@angular/core/testing';

import { FinancialyeardataService } from './financialyeardata.service';

describe('FinancialyeardataService', () => {
  let service: FinancialyeardataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FinancialyeardataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
