import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberFilterComponent } from './member-filter.component';

describe('MemberFilterComponent', () => {
  let component: MemberFilterComponent;
  let fixture: ComponentFixture<MemberFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MemberFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MemberFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
