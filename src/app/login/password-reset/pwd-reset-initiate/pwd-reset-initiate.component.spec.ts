import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PwdResetInitiateComponent } from './pwd-reset-initiate.component';

describe('PwdResetInitiateComponent', () => {
  let component: PwdResetInitiateComponent;
  let fixture: ComponentFixture<PwdResetInitiateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PwdResetInitiateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PwdResetInitiateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
