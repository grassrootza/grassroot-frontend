import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GoogleImportComponent } from './google-import.component';

describe('GoogleImportComponent', () => {
  let component: GoogleImportComponent;
  let fixture: ComponentFixture<GoogleImportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GoogleImportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GoogleImportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
