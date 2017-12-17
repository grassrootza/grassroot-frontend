import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {GroupCustomFilterComponent} from './group-custom-filter.component';

describe('GroupCustomFilterComponent', () => {
  let component: GroupCustomFilterComponent;
  let fixture: ComponentFixture<GroupCustomFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GroupCustomFilterComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupCustomFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
