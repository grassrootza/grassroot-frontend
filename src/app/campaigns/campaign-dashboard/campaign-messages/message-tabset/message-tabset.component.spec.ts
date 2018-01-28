import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageTabsetComponent } from './message-tabset.component';

describe('MessageTabsetComponent', () => {
  let component: MessageTabsetComponent;
  let fixture: ComponentFixture<MessageTabsetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MessageTabsetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MessageTabsetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
