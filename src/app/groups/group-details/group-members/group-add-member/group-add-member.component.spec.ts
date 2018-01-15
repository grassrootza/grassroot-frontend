import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupAddMemberComponent } from './group-add-member.component';

describe('GroupAddMemberComponent', () => {
  let component: GroupAddMemberComponent;
  let fixture: ComponentFixture<GroupAddMemberComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupAddMemberComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupAddMemberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
