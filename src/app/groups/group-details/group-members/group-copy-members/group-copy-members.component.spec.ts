import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import {GroupCopyMembersComponent} from "./group-copy-members.component";

describe('GroupCopyMembersComponent', () => {
  let component: GroupCopyMembersComponent;
  let fixture: ComponentFixture<GroupCopyMembersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupCopyMembersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupCopyMembersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
