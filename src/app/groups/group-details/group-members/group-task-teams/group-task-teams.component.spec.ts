import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {GroupTaskTeamsComponent} from './group-task-teams.component';

describe('GroupTaskTeamsComponent', () => {
  let component: GroupTaskTeamsComponent;
  let fixture: ComponentFixture<GroupTaskTeamsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GroupTaskTeamsComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupTaskTeamsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
