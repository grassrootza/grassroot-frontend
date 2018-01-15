import { TestBed, inject } from '@angular/core/testing';

import { PasswordResetService } from './password-reset.service';

describe('PasswordResetService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PasswordResetService]
    });
  });

  it('should be created', inject([PasswordResetService], (service: PasswordResetService) => {
    expect(service).toBeTruthy();
  }));
});
