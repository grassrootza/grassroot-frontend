import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateVoteComponent } from './create-vote.component';

describe('CreateVoteComponent', () => {
  let component: CreateVoteComponent;
  let fixture: ComponentFixture<CreateVoteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateVoteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateVoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
