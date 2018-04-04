import * as moment from 'moment';

export class PublicLivewire {

  constructor(public serverUid:string,
              public headline: string,
              public creationTimeMillis: any,
              public description: string,
              public imageKeys: string[],
              public contactName?: string,
              public alertType?: string,
              public entityName?: string,
              public entitySize?: number,
              public activityCount?: number) {}

  public static createInstance(alert:PublicLivewire): PublicLivewire {
    return new PublicLivewire(alert.serverUid,
      alert.headline,
      moment(alert.creationTimeMillis),
      alert.description,
      alert.imageKeys,
      alert.contactName,
      alert.alertType,
      alert.entityName,
      alert.entitySize,
      alert.activityCount);
  }
}

export class PublicLivewirePage {

  constructor(public number: number,
              public totalPages: number,
              public totalElements: number,
              public size: number,
              public first: boolean,
              public last: boolean,
              public content: PublicLivewire[]) {
  }

}
