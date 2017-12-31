import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BroadcastMembersComponent } from './broadcast-members.component';

describe('BroadcastMembersComponent', () => {
  let component: BroadcastMembersComponent;
  let fixture: ComponentFixture<BroadcastMembersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BroadcastMembersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BroadcastMembersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
