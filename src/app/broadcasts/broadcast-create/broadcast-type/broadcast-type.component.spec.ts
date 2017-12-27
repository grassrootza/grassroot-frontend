import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BroadcastTypeComponent } from './broadcast-type.component';

describe('BroadcastTypeComponent', () => {
  let component: BroadcastTypeComponent;
  let fixture: ComponentFixture<BroadcastTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BroadcastTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BroadcastTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
