import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CampaignSettingsComponent } from './campaign-settings.component';

describe('CampaignSettingsComponent', () => {
  let component: CampaignSettingsComponent;
  let fixture: ComponentFixture<CampaignSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CampaignSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CampaignSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
