import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GlobalSearchResultsComponent } from './global-search-results.component';

describe('GlobalSearchResultsComponent', () => {
  let component: GlobalSearchResultsComponent;
  let fixture: ComponentFixture<GlobalSearchResultsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GlobalSearchResultsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GlobalSearchResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
