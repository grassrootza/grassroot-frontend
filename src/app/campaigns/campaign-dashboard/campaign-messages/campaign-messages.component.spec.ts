import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CampaignMessagesComponent } from './campaign-messages.component';

describe('CampaignMessagesComponent', () => {
  let component: CampaignMessagesComponent;
  let fixture: ComponentFixture<CampaignMessagesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CampaignMessagesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CampaignMessagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
