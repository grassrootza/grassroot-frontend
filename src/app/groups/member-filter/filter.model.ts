import {Moment} from "moment";
import {JoinDateCondition} from "./joindatecondition.enum";
import {CampaignInfo} from "../../campaigns/model/campaign-info";

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
  language: string[] = null;
  role: string = 'ANY';

  hasContent(): boolean {
    return !!this.provinces || !!this.taskTeams || !!this.topics || !!this.affiliations || !!this.joinSources || !!this.campaigns
      || !!this.joinDate || !!this.joinDaysAgo || !!this.joinDateCondition || !!this.namePhoneOrEmail || !this.language
      || this.role !== 'ANY';
  }

  hasNonRoleChanged(other: MembersFilter): boolean {
    return this.provinces !== other.provinces || this.taskTeams !== other.taskTeams || this.topics !== other.topics ||
      this.affiliations !== other.affiliations || this.joinSources !== other.joinSources || this.campaigns !== other.campaigns ||
      this.joinDate !== other.joinDate || this.joinDaysAgo !== other.joinDaysAgo || this.joinDateCondition !== other.joinDateCondition
    || this.namePhoneOrEmail !== other.namePhoneOrEmail || this.language !== other.language;
  }

}

export const copyFilter = (filter: MembersFilter): MembersFilter => {
  let newFilter = new MembersFilter();
  newFilter.provinces = filter.provinces;
  newFilter.taskTeams = filter.taskTeams;
  newFilter.topics = filter.topics;
  newFilter.affiliations = filter.affiliations;
  newFilter.joinSources = filter.joinSources;
  newFilter.campaigns = filter.campaigns;
  newFilter.joinDate = filter.joinDate;
  newFilter.joinDaysAgo = filter.joinDaysAgo;
  newFilter.joinDateCondition = filter.joinDateCondition;
  newFilter.namePhoneOrEmail = filter.namePhoneOrEmail;
  newFilter.language = filter.language;
  newFilter.role = filter.role;
  return newFilter;
};
