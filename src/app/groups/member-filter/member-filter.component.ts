import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {UserProvince} from '../../user/model/user-province.enum';

import {MembersFilter} from "./filter.model";
import {GroupRef} from "../model/group-ref.model";
import {GroupJoinMethod} from "../model/join-method";
import {CampaignInfo} from "../../campaigns/model/campaign-info";
import {FormBuilder, FormGroup} from "@angular/forms";
import {DateTimeUtils} from "../../utils/DateTimeUtils";
import * as moment from "moment";
import {BehaviorSubject} from "rxjs/BehaviorSubject";

declare var $: any;

@Component({
  selector: 'app-member-filter',
  templateUrl: './member-filter.component.html',
  styleUrls: ['./member-filter.component.css']
})
export class MemberFilterComponent implements OnInit {

  provinceKeys: string[];
  joinMethods: string[];

  @Input()
  taskTeams: GroupRef[] = [];

  @Input()
  campaigns: CampaignInfo[] = [];

  @Input()
  topics: string[] = [];

  @Input()
  affiliations: string[] = [];

  joinDateConditions: string[] = ["DAYS_AGO-EXACT", "DAYS_AGO-BEFORE", "DAYS_AGO-AFTER", "DATE-EXACT", "DATE-BEFORE", "DATE-AFTER"];

  joinDateConditionType = null;

  public filterForm: FormGroup;

  private filter: MembersFilter = new MembersFilter();

  @Output()
  public filterChanged: EventEmitter<MembersFilter> = new EventEmitter();


  constructor(private formBuilder: FormBuilder) {
    this.provinceKeys = Object.keys(UserProvince);
    this.joinMethods = Object.keys(GroupJoinMethod);
  }

  ngOnInit() {

    this.setupSelect2();

    this.filterForm = this.formBuilder.group({
      'date': [DateTimeUtils.dateFromDate(new Date())],
      'daysAgo': 1
    });

    this.nameInputSubject.asObservable().debounceTime(300)
      .subscribe(
        value => {
          this.filter.namePhoneOrEmail = value;
          this.fireFilterChange()
        }
      )
  }

  setupSelect2() {
    $(".provinces-multi-select").select2({placeholder: "Select a province"});
    $(".task-teams-multi-select").select2({placeholder: "Select task teams"});
    $(".topics-multi-select").select2({placeholder: "Select topics"});
    $(".affiliations-multi-select").select2({placeholder: "Select affiliations (organizations)"});
    $(".join-methods-multi-select").select2({placeholder: "Select sources"});
    $(".campaigns-multi-select").select2({placeholder: "Select campaigns"});


    $(".provinces-multi-select").on('change.select2', function () {
      const data = $('.provinces-multi-select').select2('data');
      this.filter.provinces = data.length > 0 ? data.map(p => p.id) : null;
      this.fireFilterChange();
    }.bind(this));

    $(".task-teams-multi-select").on('change.select2', function () {
      const data = $('.task-teams-multi-select').select2('data');
      console.log("data entity: ", data);
      this.filter.taskTeams = data.length > 0 ? data.map(tt => tt.id) : null;
      this.fireFilterChange();
    }.bind(this));

    $(".topics-multi-select").on('change.select2', function () {
      const data = $('.topics-multi-select').select2('data');
      this.filter.topics = data.length > 0 ? data.map(tt => tt.id) : null;
      this.fireFilterChange();
    }.bind(this));

    $(".affiliations-multi-select").on('change.select2', function() {
      const data = $('.affiliations-multi-select').select2('data');
      this.filter.affiliations = data.length > 0 ? data.map(tt => tt.id) : null;
      this.fireFilterChange()
    }.bind(this));

    $(".join-methods-multi-select").on('change.select2', function () {
      const data = $('.join-methods-multi-select').select2('data');
      this.filter.joinSources = data.length > 0 ? data.map(tt => tt.id) : null;
      this.fireFilterChange();
    }.bind(this));

    $(".campaigns-multi-select").on('change.select2', function () {
      const data = $('.campaigns-multi-select').select2('data');
      this.filter.campaigns = data.length > 0 ? data.map(tt => tt.id) : null;
      this.fireFilterChange();
    }.bind(this));


  }

  dateConditionTypeChanged(value) {
    console.log("Join data select data: ", value);

    if (value == "ANY") {
      this.joinDateConditionType = null;
      this.filter.joinDateCondition = null;
      this.filter.joinDate = null;
      this.filter.joinDaysAgo = null;
    }
    else {
      this.joinDateConditionType = value.split("-")[0];
      this.filter.joinDateCondition = value.split("-")[1];
      if (this.joinDateConditionType == "DAYS_AGO") {
        this.filter.joinDaysAgo = this.filterForm.get('daysAgo').value;
        this.filter.joinDate = null;
      }
      else {
        this.filter.joinDate = DateTimeUtils.momentFromNgbStruct(this.filterForm.get('date').value, null);
        this.filter.joinDaysAgo = null;
      }
    }
    this.fireFilterChange();
  }

  dateChanged(date) {
    console.log("Date changed: ", date);
    this.filter.joinDate = moment([date.year, date.month - 1, date.day, 0, 0, 0, 0]);
    this.fireFilterChange();
  }


  private nameInputSubject: BehaviorSubject<string> = new BehaviorSubject<string>(null);
  nameOrPhoneChanged(value) {
    this.nameInputSubject.next(value);
  }

  daysAgoChanged(value) {
    console.log("Days ago changed: ", value);
    this.filter.joinDaysAgo = value;
    this.fireFilterChange();
  }

  private fireFilterChange() {
    console.log("Filter changed: ", this.filter);
    this.filterChanged.emit(this.filter);
  }
}
