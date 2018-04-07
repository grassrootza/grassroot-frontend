import {PublicActivityType} from "./public-activity-type.enum";

export class PublicActivity {

  constructor(public type: PublicActivityType,
              public actorName: string,
              public actionTimeMillis: Date) {
  }

  public static createInstanceFromData(publicActivityData: PublicActivity) {
    return new PublicActivity(
      publicActivityData.type,
      publicActivityData.actorName,
      new Date(publicActivityData.actionTimeMillis)
    )
  }
}

