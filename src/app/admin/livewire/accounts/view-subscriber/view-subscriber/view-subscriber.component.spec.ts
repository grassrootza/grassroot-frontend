import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewSubscriberComponent } from './view-subscriber.component';

describe('ViewSubscriberComponent', () => {
  let component: ViewSubscriberComponent;
  let fixture: ComponentFixture<ViewSubscriberComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewSubscriberComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewSubscriberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
