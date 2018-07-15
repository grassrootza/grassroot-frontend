import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BroadcastViewComponent } from './broadcast-view.component';

describe('BroadcastViewComponent', () => {
  let component: BroadcastViewComponent;
  let fixture: ComponentFixture<BroadcastViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BroadcastViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BroadcastViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
