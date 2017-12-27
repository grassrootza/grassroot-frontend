import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BroadcastContentComponent } from './broadcast-content.component';

describe('BroadcastContentComponent', () => {
  let component: BroadcastContentComponent;
  let fixture: ComponentFixture<BroadcastContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BroadcastContentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BroadcastContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
