import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateTaskTeamComponent } from './create-task-team.component';

describe('CreateTaskTeamComponent', () => {
  let component: CreateTaskTeamComponent;
  let fixture: ComponentFixture<CreateTaskTeamComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateTaskTeamComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateTaskTeamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
