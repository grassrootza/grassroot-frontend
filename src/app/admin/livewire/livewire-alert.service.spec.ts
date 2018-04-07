import { TestBed, inject } from '@angular/core/testing';

import { LiveWireAdminService } from '../admin/livewire/live-wire-alert.service';

describe('LiveWireAdminService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LiveWireAdminService]
    });
  });

  it('should be created', inject([LiveWireAdminService], (service: LiveWireAdminService) => {
    expect(service).toBeTruthy();
  }));
});
