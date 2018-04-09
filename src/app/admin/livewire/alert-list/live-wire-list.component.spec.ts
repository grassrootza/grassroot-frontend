import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LiveWireListComponent } from './live-wire-list.component';

describe('LiveWireListComponent', () => {
  let component: LiveWireListComponent;
  let fixture: ComponentFixture<LiveWireListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LiveWireListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LiveWireListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
