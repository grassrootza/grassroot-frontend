import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {GroupActivityComponent} from './group-activity.component';

describe('GroupActivityComponent', () => {
  let component: GroupActivityComponent;
  let fixture: ComponentFixture<GroupActivityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GroupActivityComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupActivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
