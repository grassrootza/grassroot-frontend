import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CampaignStatsComponent } from './campaign-stats.component';

describe('CampaignStatsComponent', () => {
  let component: CampaignStatsComponent;
  let fixture: ComponentFixture<CampaignStatsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CampaignStatsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CampaignStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
