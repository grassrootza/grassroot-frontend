import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {UserProvince} from '../../user/model/user-province.enum';

import {MembersFilter} from "./filter.model";
import {GroupRef} from "../model/group-ref.model";
import {GroupJoinMethod} from "../model/join-method";
import {CampaignInfo} from "../../campaigns/model/campaign-info";

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

  private filter: MembersFilter = new MembersFilter();

  @Output()
  public filterChanged: EventEmitter<MembersFilter> = new EventEmitter();


  constructor() {
    this.provinceKeys = Object.keys(UserProvince);
    this.joinMethods = Object.keys(GroupJoinMethod);
  }

  ngOnInit() {

    this.setupSelect2();
  }

  setupSelect2() {
    $(".provinces-multi-select").select2({placeholder: "Select a state"});
    $(".task-teams-multi-select").select2({placeholder: "Select task teams"});
    $(".topics-multi-select").select2({placeholder: "Select topics"});
    $(".join-methods-multi-select").select2({placeholder: "Select sources"});
    $(".campaigns-multi-select").select2({placeholder: "Select campaigns"});

    $(".provinces-multi-select").on('change.select2', function () {
      var data = $('.provinces-multi-select').select2('data');
      this.filter.provinces = data.length > 0 ? data.map(p => p.id) : null;
      this.fireFilterChange();
    }.bind(this));

    $(".task-teams-multi-select").on('change.select2', function () {
      var data = $('.task-teams-multi-select').select2('data');
      this.filter.taskTeams = data.length > 0 ? data.map(tt => tt.id) : null;
      this.fireFilterChange();
    }.bind(this));

    $(".topics-multi-select").on('change.select2', function () {
      var data = $('.topics-multi-select').select2('data');
      this.filter.topics = data.length > 0 ? data.map(tt => tt.id) : null;
      this.fireFilterChange();
    }.bind(this));

    $(".join-methods-multi-select").on('change.select2', function () {
      var data = $('.join-methods-multi-select').select2('data');
      this.filter.joinSources = data.length > 0 ? data.map(tt => tt.id) : null;
      this.fireFilterChange();
    }.bind(this));

    $(".campaigns-multi-select").on('change.select2', function () {
      var data = $('.campaigns-multi-select').select2('data');
      this.filter.campaigns = data.length > 0 ? data.map(tt => tt.id) : null;
      this.fireFilterChange();
    }.bind(this));



  }

  private fireFilterChange() {
    console.log("Filter changed: ", this.filter);
    this.filterChanged.emit(this.filter);
  }
}
