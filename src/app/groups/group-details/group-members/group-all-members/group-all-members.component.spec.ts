import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {GroupAllMembersComponent} from './group-all-members.component';

describe('GroupAllMembersComponent', () => {
  let component: GroupAllMembersComponent;
  let fixture: ComponentFixture<GroupAllMembersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GroupAllMembersComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupAllMembersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
