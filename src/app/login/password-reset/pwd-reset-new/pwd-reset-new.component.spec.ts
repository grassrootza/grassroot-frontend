import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PwdResetNewComponent } from './pwd-reset-new.component';

describe('PwdResetNewComponent', () => {
  let component: PwdResetNewComponent;
  let fixture: ComponentFixture<PwdResetNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PwdResetNewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PwdResetNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
