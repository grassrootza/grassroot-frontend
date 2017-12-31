export class CampaignInfo {

  constructor(public name: string,
              public campaignUid: string,
              public masterGroupName: string,
              public masterGroupUid: string,
              public description: string,
              public campaignStartDate: Date,
              public campaignEndDate: Date,
              public totalEngaged: number,
              public totalJoined: number,
              public creatingUserName: string,
              public creatingUserUid: string,
              public campaignCode: number,
              public campaignTags: string[]) {

  }

  public isActive(): boolean {
    return this.campaignEndDate > new Date;
  }

}
