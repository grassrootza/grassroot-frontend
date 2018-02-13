import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberTopicsManageComponent } from './member-topics-manage.component';

describe('MemberTopicsManageComponent', () => {
  let component: MemberTopicsManageComponent;
  let fixture: ComponentFixture<MemberTopicsManageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MemberTopicsManageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MemberTopicsManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
