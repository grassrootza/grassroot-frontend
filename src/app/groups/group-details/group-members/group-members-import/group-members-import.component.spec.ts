import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupMembersImportComponent } from './group-members-import.component';

describe('GroupMembersImportComponent', () => {
  let component: GroupMembersImportComponent;
  let fixture: ComponentFixture<GroupMembersImportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupMembersImportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupMembersImportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
