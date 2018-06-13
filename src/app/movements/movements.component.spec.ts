import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MovementsComponent } from './movements.component';

describe('MovementsComponent', () => {
  let component: MovementsComponent;
  let fixture: ComponentFixture<MovementsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MovementsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MovementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
