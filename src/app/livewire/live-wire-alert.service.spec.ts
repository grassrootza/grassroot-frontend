import { TestBed, inject } from '@angular/core/testing';

import { LiveWireAlertService } from './live-wire-alert.service';

describe('LiveWireAlertService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LiveWireAlertService]
    });
  });

  it('should be created', inject([LiveWireAlertService], (service: LiveWireAlertService) => {
    expect(service).toBeTruthy();
  }));
});
