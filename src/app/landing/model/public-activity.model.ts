import {PublicActivityType} from "./public-activity-type.enum";

export class PublicActivity {

  constructor(public type: PublicActivityType,
              public actorName: string,
              public actionTimeMillis: Date) {
  }

  public equals(activity: PublicActivity) {
    let sameTime = this.actionTimeMillis.getTime() == activity.actionTimeMillis.getTime();
    let sameActor = this.actorName == activity.actorName;
    let sameType = this.type == activity.type;
    return sameTime && sameActor && sameType;
  }

  public static createInstanceFromData(publicActivityData: PublicActivity) {
    return new PublicActivity(
      publicActivityData.type,
      publicActivityData.actorName,
      new Date(publicActivityData.actionTimeMillis)
    )
  }
}

