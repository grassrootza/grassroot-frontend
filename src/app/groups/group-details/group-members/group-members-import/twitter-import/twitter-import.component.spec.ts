import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TwitterImportComponent } from './twitter-import.component';

describe('TwitterImportComponent', () => {
  let component: TwitterImportComponent;
  let fixture: ComponentFixture<TwitterImportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TwitterImportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TwitterImportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
