import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CampaignBroadcastsComponent } from './campaign-broadcasts.component';

describe('CampaignBroadcastsComponent', () => {
  let component: CampaignBroadcastsComponent;
  let fixture: ComponentFixture<CampaignBroadcastsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CampaignBroadcastsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CampaignBroadcastsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
