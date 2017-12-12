import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {GroupBroadcastComponent} from './group-broadcast.component';

describe('GroupBroadcastComponent', () => {
  let component: GroupBroadcastComponent;
  let fixture: ComponentFixture<GroupBroadcastComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GroupBroadcastComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupBroadcastComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
