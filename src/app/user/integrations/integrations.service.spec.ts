import { TestBed, inject } from '@angular/core/testing';

import { IntegrationsService } from './integrations.service';

describe('IntegrationsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [IntegrationsService]
    });
  });

  it('should be created', inject([IntegrationsService], (service: IntegrationsService) => {
    expect(service).toBeTruthy();
  }));
});
