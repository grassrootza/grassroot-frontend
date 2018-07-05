import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BroadcastListingComponent } from './broadcast-listing.component';

describe('BroadcastListingComponent', () => {
  let component: BroadcastListingComponent;
  let fixture: ComponentFixture<BroadcastListingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BroadcastListingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BroadcastListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
