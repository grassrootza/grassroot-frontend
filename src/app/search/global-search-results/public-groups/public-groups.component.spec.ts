import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicGroupsComponent } from './public-groups.component';

describe('PublicGroupsComponent', () => {
  let component: PublicGroupsComponent;
  let fixture: ComponentFixture<PublicGroupsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PublicGroupsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PublicGroupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
