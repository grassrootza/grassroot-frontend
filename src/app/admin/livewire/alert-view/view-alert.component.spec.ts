import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAlertComponent } from './view-alert.component';

describe('ViewAlertComponent', () => {
  let component: ViewAlertComponent;
  let fixture: ComponentFixture<ViewAlertComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewAlertComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
