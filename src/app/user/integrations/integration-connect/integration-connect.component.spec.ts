import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IntegrationConnectComponent } from './integration-connect.component';

describe('IntegrationConnectComponent', () => {
  let component: IntegrationConnectComponent;
  let fixture: ComponentFixture<IntegrationConnectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IntegrationConnectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IntegrationConnectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
