import { TestBed } from '@angular/core/testing';

import { GoalserviceService } from './goalservice.service';

describe('GoalserviceService', () => {
  let service: GoalserviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GoalserviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
