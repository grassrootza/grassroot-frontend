import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicMeetingsComponent } from './public-meetings.component';

describe('PublicMeetingsComponent', () => {
  let component: PublicMeetingsComponent;
  let fixture: ComponentFixture<PublicMeetingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PublicMeetingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PublicMeetingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
