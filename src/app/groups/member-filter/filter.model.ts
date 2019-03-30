import {Moment} from 'moment-mini-ts';
import {JoinDateCondition} from "./joindatecondition.enum";
import { Municipality } from '../model/municipality.model';

export class MembersFilter {

  provinces: string[] = null;
  noProvince: string = null; // instead of boolean, as not confident enough of JS handling of checks below 
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
  municipalityId: number = null;

  hasContent(): boolean {
    return !!this.provinces || !!this.noProvince || !!this.taskTeams || !!this.topics || !!this.affiliations || !!this.joinSources || !!this.campaigns
      || !!this.joinDate || !!this.joinDaysAgo || !!this.joinDateCondition || !!this.namePhoneOrEmail || !this.language
      || this.role !== 'ANY' || !!this.municipalityId;
  }

  hasNonRoleChanged(other: MembersFilter): boolean {
    return this.provinces !== other.provinces || this.noProvince !== other.noProvince || this.taskTeams !== other.taskTeams || this.topics !== other.topics ||
      this.affiliations !== other.affiliations || this.joinSources !== other.joinSources || this.campaigns !== other.campaigns ||
      this.joinDate !== other.joinDate || this.joinDaysAgo !== other.joinDaysAgo || this.joinDateCondition !== other.joinDateCondition
    || this.namePhoneOrEmail !== other.namePhoneOrEmail || this.language !== other.language || this.municipalityId !== other.municipalityId;
  }

  hasAnythingChanged(other: MembersFilter): boolean {
    // console.log(`Prior join date condition:  ${this.joinDateCondition} and new: ${other.joinDateCondition}`);
    return this.role !== other.role || this.hasNonRoleChanged(other);
  }

}

export const copyFilter = (filter: MembersFilter): MembersFilter => {
  let newFilter = new MembersFilter();
  newFilter.provinces = filter.provinces;
  newFilter.noProvince = filter.noProvince;
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
  newFilter.municipalityId = filter.municipalityId;
  return newFilter;
};
