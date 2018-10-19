import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CampaignMediaComponent } from './campaign-media.component';

describe('CampaignMediaComponent', () => {
  let component: CampaignMediaComponent;
  let fixture: ComponentFixture<CampaignMediaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CampaignMediaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CampaignMediaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
