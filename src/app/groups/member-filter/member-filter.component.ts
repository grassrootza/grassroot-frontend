import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {UserProvince} from '../../user/model/user-province.enum';

import {MembersFilter} from "./filter.model";
import {GroupRef} from "../model/group-ref.model";
import {GroupJoinMethod} from "../model/join-method";
import {CampaignInfo} from "../../campaigns/model/campaign-info";
import {FormBuilder, FormGroup} from "@angular/forms";
import {DateTimeUtils} from "../../utils/DateTimeUtils";
import * as moment from 'moment-mini-ts';
import {BehaviorSubject} from "rxjs";
import { debounceTime } from 'rxjs/operators';
import {AFRIKAANS, ENGLISH, Language, SOTHO, XHOSA, ZULU} from "../../utils/language";
import {GroupRole} from "../model/group-role";

declare var $: any;

@Component({
  selector: 'app-member-filter',
  templateUrl: './member-filter.component.html',
  styleUrls: ['./member-filter.component.css']
})
export class MemberFilterComponent implements OnInit, OnChanges {

  provinceKeys: string[];
  joinMethods: string[];
  userLanguages: Language[];
  roleKeys: string[];

  private nameInputSubject: BehaviorSubject<string> = new BehaviorSubject<string>(null);

  @Input() taskTeams: GroupRef[] = [];
  @Input() campaigns: CampaignInfo[] = [];
  @Input() topics: string[] = [];
  @Input() affiliations: string[] = [];
  @Input() includeNameFilter: boolean = true;

  joinDateConditions: string[] = ["DAYS_AGO-EXACT", "DAYS_AGO-BEFORE", "DAYS_AGO-AFTER", "DATE-EXACT", "DATE-BEFORE", "DATE-AFTER"];
  joinDateConditionType = null;

  public filterForm: FormGroup;
  public hasCampaigns: boolean = false;

  private filter: MembersFilter = new MembersFilter();

  @Output() public filterChanged: EventEmitter<MembersFilter> = new EventEmitter();

  constructor(private formBuilder: FormBuilder) {
    this.provinceKeys = Object.keys(UserProvince);
    this.joinMethods = Object.keys(GroupJoinMethod);
    this.userLanguages = [ENGLISH, ZULU, XHOSA, SOTHO, AFRIKAANS];
    this.roleKeys = Object.keys(GroupRole);
    console.log('on filter set up, campaigns: ', this.campaigns);
    // console.log(this.userLanguages);
  }

  ngOnChanges(changes: SimpleChanges): void {
    // console.log('changes: ', changes);
    if (changes && changes['campaigns']) {
      this.hasCampaigns = this.campaigns && this.campaigns.length > 0;
      console.log('campaigns changed, setting up? :', this.hasCampaigns);
      if (this.hasCampaigns)
        setTimeout(() => this.setUpCampaignsSelect(), 100);
    }
  }

  ngOnInit() {

    this.setupSelect2();

    this.filterForm = this.formBuilder.group({
      'role': 'ANY',
      'date': [DateTimeUtils.dateFromDate(new Date())],
      'daysAgo': 1
    });

    this.filterForm.controls['role'].valueChanges.subscribe(value => {
      this.filter.role = value;
      this.fireFilterChange();
    });

    if (this.includeNameFilter) {
      this.nameInputSubject.asObservable().pipe(debounceTime(500))
        .subscribe(
          value => {
            this.filter.namePhoneOrEmail = value;
            this.fireFilterChange()
          }
        )
    }

  }

  setupSelect2() {
    // console.log("in member filter, topics: ", this.topics);

    $(".provinces-multi-select").select2({placeholder: "Select a province"});
    $(".task-teams-multi-select").select2({placeholder: "Select task teams"});
    $(".topics-multi-select-filter").select2({placeholder: "Select topics"});
    $(".affiliations-multi-select").select2({placeholder: "Select affiliations (organizations)"});
    $(".join-methods-multi-select").select2({placeholder: "Select sources"});

    $(".language-multi-select").select2({placeholder: "Select languages"});


    $(".provinces-multi-select").on('change.select2', function () {
      const data = $('.provinces-multi-select').select2('data');
      this.filter.provinces = data.length > 0 ? data.map(p => p.id).filter(p => p != 'UNKNOWN') : null;
      this.filter.noProvince = data.length > 0 ? data.map(p => p.id).filter(p => p == 'UNKNOWN') : null; // because is actually null on back end (and have decided not to introduce as existing entity)
      this.fireFilterChange();
    }.bind(this));

    $(".task-teams-multi-select").on('change.select2', function () {
      const data = $('.task-teams-multi-select').select2('data');
      this.filter.taskTeams = data.length > 0 ? data.map(tt => tt.id) : null;
      this.fireFilterChange();
    }.bind(this));

    $(".topics-multi-select-filter").on('change.select2', function () {
      const data = $('.topics-multi-select-filter').select2('data');
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

    $(".language-multi-select").on('change.select2', function () {
      const data = $('.language-multi-select').select2('data');
      this.filter.language = data.length > 0 ? data.map(tt => tt.id) : null;
      this.fireFilterChange();
    }.bind(this));

    if (this.hasCampaigns) {
      this.setUpCampaignsSelect();
    }
  }

  setUpCampaignsSelect() {
    console.log("setting up campaign select ...");
    $(".campaigns-multi-select").select2({placeholder: "Select campaigns"});
    $(".campaigns-multi-select").on('change.select2', function () {
      const data = $('.campaigns-multi-select').select2('data');
      this.filter.campaigns = data.length > 0 ? data.map(tt => tt.id) : null;
      this.fireFilterChange();
    }.bind(this));
  }

  dateConditionTypeChanged(value) {
    // console.log("Join data select data: ", value);

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
    // console.log("Date changed: ", date);
    this.filter.joinDate = moment([date.year, date.month - 1, date.day, 0, 0, 0, 0]);
    this.fireFilterChange();
  }

  nameOrPhoneChanged(value) {
    this.nameInputSubject.next(value);
  }

  daysAgoChanged(value) {
    // console.log("Days ago changed: ", value);
    this.filter.joinDaysAgo = value;
    this.fireFilterChange();
  }

  private fireFilterChange() {
    // console.log("Filter changed: ", this.filter);
    console.log(`firing observable inside inner component`);
    this.filterChanged.emit(this.filter);
  }
}
