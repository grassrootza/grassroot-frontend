import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupJoinMethodsComponent } from './group-join-methods.component';

describe('GroupJoinMethodsComponent', () => {
  let component: GroupJoinMethodsComponent;
  let fixture: ComponentFixture<GroupJoinMethodsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupJoinMethodsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupJoinMethodsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
