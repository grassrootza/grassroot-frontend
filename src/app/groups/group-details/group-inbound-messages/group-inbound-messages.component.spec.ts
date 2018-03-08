import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupInboundMessagesComponent } from './group-inbound-messages.component';

describe('GroupInboundMessagesComponent', () => {
  let component: GroupInboundMessagesComponent;
  let fixture: ComponentFixture<GroupInboundMessagesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupInboundMessagesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupInboundMessagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
