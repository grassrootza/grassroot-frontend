import { TestBed, async, inject } from '@angular/core/testing';

import { BroadcastWorkflowGuard } from './create-workflow-guard.guard';

describe('BroadcastWorkflowGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BroadcastWorkflowGuard]
    });
  });

  it('should ...', inject([BroadcastWorkflowGuard], (guard: BroadcastWorkflowGuard) => {
    expect(guard).toBeTruthy();
  }));
});
