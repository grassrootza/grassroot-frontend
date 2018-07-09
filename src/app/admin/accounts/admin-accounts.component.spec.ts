import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminAccountsComponent } from './admin-accounts.component';

describe('AccountsComponent', () => {
  let component: AdminAccountsComponent;
  let fixture: ComponentFixture<AdminAccountsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminAccountsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminAccountsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
