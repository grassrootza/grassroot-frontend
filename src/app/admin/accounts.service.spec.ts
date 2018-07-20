import { TestBed, inject } from '@angular/core/testing';

import { AccountsAdminService } from './admin-accounts.service';

describe('AccountsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AccountsAdminService]
    });
  });

  it('should be created', inject([AccountsAdminService], (service: AccountsAdminService) => {
    expect(service).toBeTruthy();
  }));
});
