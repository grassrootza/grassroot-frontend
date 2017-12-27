import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BroadcastScheduleComponent } from './broadcast-schedule.component';

describe('BroadcastScheduleComponent', () => {
  let component: BroadcastScheduleComponent;
  let fixture: ComponentFixture<BroadcastScheduleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BroadcastScheduleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BroadcastScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
