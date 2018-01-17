import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupMembersProfileComponent } from './group-members-profile.component';

describe('GroupMembersProfileComponent', () => {
  let component: GroupMembersProfileComponent;
  let fixture: ComponentFixture<GroupMembersProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupMembersProfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupMembersProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
