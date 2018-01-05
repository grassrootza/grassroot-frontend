import { TestBed, inject } from '@angular/core/testing';

import { JoinService } from './join.service';

describe('JoinService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [JoinService]
    });
  });

  it('should be created', inject([JoinService], (service: JoinService) => {
    expect(service).toBeTruthy();
  }));
});
