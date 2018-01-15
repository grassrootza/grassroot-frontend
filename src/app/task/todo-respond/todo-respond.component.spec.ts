import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ToDoRespondComponent} from './todo-respond.component';

describe('ToDoRespondComponent', () => {
  let component: ToDoRespondComponent;
  let fixture: ComponentFixture<ToDoRespondComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ToDoRespondComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ToDoRespondComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
