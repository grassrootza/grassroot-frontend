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

}
