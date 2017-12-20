import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FacebookImportComponent } from './facebook-import.component';

describe('FacebookImportComponent', () => {
  let component: FacebookImportComponent;
  let fixture: ComponentFixture<FacebookImportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FacebookImportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FacebookImportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
