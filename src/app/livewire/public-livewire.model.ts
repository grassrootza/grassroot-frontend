import { DateTimeUtils } from "../utils/DateTimeUtils";
import * as moment from 'moment';
export class PublicLivewire {
  
  constructor(public headline:string,
              public creationTimeMillis:any,
              public description:string,
              public imageKeys:string[]){}
  
  public static createInstance(publicLivewire:PublicLivewire):PublicLivewire{
    return new PublicLivewire(publicLivewire.headline,
                              moment(publicLivewire.creationTimeMillis),
                              publicLivewire.description,
                              publicLivewire.imageKeys);
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
