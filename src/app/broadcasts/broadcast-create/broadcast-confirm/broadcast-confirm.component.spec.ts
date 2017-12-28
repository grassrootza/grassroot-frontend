import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BroadcastConfirmComponent } from './broadcast-confirm.component';

describe('BroadcastConfirmComponent', () => {
  let component: BroadcastConfirmComponent;
  let fixture: ComponentFixture<BroadcastConfirmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BroadcastConfirmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BroadcastConfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
