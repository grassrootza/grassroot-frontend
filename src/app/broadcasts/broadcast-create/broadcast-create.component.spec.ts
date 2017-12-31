import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BroadcastCreateComponent } from './broadcast-create.component';

describe('BroadcastCreateComponent', () => {
  let component: BroadcastCreateComponent;
  let fixture: ComponentFixture<BroadcastCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BroadcastCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BroadcastCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
