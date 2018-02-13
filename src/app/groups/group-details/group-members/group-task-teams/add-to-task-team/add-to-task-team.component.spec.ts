import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddToTaskTeamComponent } from './add-to-task-team.component';

describe('AddToTaskTeamComponent', () => {
  let component: AddToTaskTeamComponent;
  let fixture: ComponentFixture<AddToTaskTeamComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddToTaskTeamComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddToTaskTeamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
