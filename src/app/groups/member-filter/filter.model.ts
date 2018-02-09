import {Moment} from "moment";
import {JoinDateCondition} from "./joindatecondition.enum";

export class MembersFilter {

  provinces: string[] = null;
  taskTeams: string[] = null;
  topics: string[] = null;
  affiliations: string[] = null;
  joinSources: string[] = null;
  campaigns: string[] = null;
  joinDate: Moment = null;
  joinDaysAgo: number = null;
  joinDateCondition: JoinDateCondition = null;
  namePhoneOrEmail: string = null;

  hasContent(): boolean {
    return !!this.provinces || !!this.taskTeams || !!this.topics || !!this.affiliations || !!this.joinSources ||
      !!this.campaigns || !!this.joinDate || !!this.joinDaysAgo || !!this.joinDateCondition || !!this.namePhoneOrEmail;
  }

}
