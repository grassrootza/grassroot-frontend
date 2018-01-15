import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PwdResetValidateComponent } from './pwd-reset-validate.component';

describe('PwdResetValidateComponent', () => {
  let component: PwdResetValidateComponent;
  let fixture: ComponentFixture<PwdResetValidateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PwdResetValidateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PwdResetValidateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
