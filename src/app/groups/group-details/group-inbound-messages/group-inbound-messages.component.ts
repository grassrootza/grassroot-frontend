import {Component, OnInit} from '@angular/core';
import {Group} from "../../model/group.model";
import {ActivatedRoute, Params} from "@angular/router";
import {FormBuilder, FormGroup} from "@angular/forms";
import {GroupService} from "../../group.service";
import {GroupLogPage} from "../../model/group-log.model";
import * as moment from 'moment';
import {DateTimeUtils} from "../../../utils/DateTimeUtils";
import { saveAs } from 'file-saver';


@Component({
  selector: 'app-group-inbound-messages',
  templateUrl: './group-inbound-messages.component.html',
  styleUrls: ['./group-inbound-messages.component.css']
})
export class GroupInboundMessagesComponent implements OnInit {

  public group: Group = null;
  public groupUid: string = ""; // as need for input (and group is null on init)
  public currentPage: GroupLogPage = new GroupLogPage(0, 0, 0, 0, true, false, []);

  public showFromFilter: number = 0;
  public showDateReceivedFilter: number = 0;
  public showDatePicker = false;

  public filterInboundMessagesForm: FormGroup;

  private dateFrom = null;
  private dateTo = null;
  private keyword = null;
  private direction = "";
  private fieldToFilter = "";

  constructor(private route: ActivatedRoute,
              private groupService: GroupService,
              private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.route.parent.params.subscribe((params: Params) => {
      this.groupUid = params['id'];
      this.groupService.loadGroupDetailsCached(this.groupUid, false).subscribe(group => {
        this.group = group;
      });

      this.filterInboundMessagesForm = this.formBuilder.group({
        'dateFrom': null,
        'dateTo': null,
        'keyword': null
      });

      this.goToPage(0);
    });
  }

  goToPage(pageNo: number) {
    this.groupService.fetchInboundMessagesForGroup(this.groupUid, pageNo, this.dateFrom, this.dateTo, this.keyword, [this.fieldToFilter, this.direction]).subscribe(resp => {
      console.log(resp);
      this.currentPage = resp;
    })
  }

  dateConditionTypeChanged(timeRange) {
    this.filterInboundMessagesForm.get('dateFrom').setValue(null);
    this.filterInboundMessagesForm.get('dateTo').setValue(null);
    this.showDatePicker = false;
    if(timeRange === 'thisWeek') {
      this.filterInboundMessagesForm.get('dateFrom').setValue(moment().day(1));
      this.filterInboundMessagesForm.get('dateTo').setValue(moment().day(7));
    } else if(timeRange === 'lastWeek') {
      this.filterInboundMessagesForm.get('dateFrom').setValue(moment().subtract(1, 'weeks').startOf('isoWeek'));
      this.filterInboundMessagesForm.get('dateTo').setValue(moment().subtract(1, 'weeks').endOf('isoWeek'));
    } else if(timeRange === 'thisMonth') {
      this.filterInboundMessagesForm.get('dateFrom').setValue(moment().startOf('month'));
      this.filterInboundMessagesForm.get('dateTo').setValue(moment().endOf('month'));
    } else if(timeRange === 'lastMonth') {
      this.filterInboundMessagesForm.get('dateFrom').setValue(moment().subtract(1, 'months').startOf('month'));
      this.filterInboundMessagesForm.get('dateTo').setValue(moment().subtract(1, 'months').endOf('month'));
    } else if(timeRange === 'custom'){
      this.showDatePicker = true;
    }
  }

  orderData(fieldToFilter: string){
    this.direction = "";
    this.fieldToFilter = fieldToFilter;
    if(fieldToFilter === "targetUser"){
      this.showDateReceivedFilter = 0;
      switch (this.showFromFilter){
        case 0: this.showFromFilter = 1; this.direction = "desc"; break;
        case 1: this.showFromFilter = 2; this.direction = "asc"; break;
        case 2: this.showFromFilter = 0; this.direction = ""; break;
      }
    }else if(fieldToFilter === "createdDateTime"){
      this.showFromFilter = 0;
      switch (this.showDateReceivedFilter){
        case 0: this.showDateReceivedFilter = 1; this.direction = "desc"; break;
        case 1: this.showDateReceivedFilter = 2; this.direction = "asc"; break;
        case 2: this.showDateReceivedFilter = 0; this.direction = ""; break;
      }
    }

    this.goToPage(0);
  }

  clearFilter() {
    this.dateTo = null;
    this.dateFrom = null;
    this.keyword = null;
    this.direction = "";
    this.fieldToFilter = "";
    this.showFromFilter = 0;
    this.showDateReceivedFilter = 0;
    this.filterInboundMessagesForm.get('dateFrom').setValue(this.dateFrom);
    this.filterInboundMessagesForm.get('dateTo').setValue(this.dateTo);
    this.filterInboundMessagesForm.get('keyword').setValue(this.keyword);

    this.goToPage(0);

  }

  exportMessages() {
    this.groupService.exportInboundMessages(this.groupUid, this.dateFrom, this.dateTo, this.keyword).subscribe(data => {
      let blob = new Blob([data], { type: 'application/vnd.ms-excel' });
      saveAs(blob, "inbound-messages.xls");
    }, error => {
      console.log("error getting the file: ", error);
    });

  }

  onSubmit() {
    if (this.showDatePicker) {
      this.dateFrom = DateTimeUtils.momentFromNgbStruct(this.filterInboundMessagesForm.get('dateFrom').value, null);
      this.dateTo = DateTimeUtils.momentFromNgbStruct(this.filterInboundMessagesForm.get('dateTo').value, null);
    } else {
      this.dateFrom = this.filterInboundMessagesForm.get('dateFrom').value;
      this.dateTo = this.filterInboundMessagesForm.get('dateTo').value;
    }

    this.keyword = this.filterInboundMessagesForm.get('keyword').value;
    this.goToPage(0);
  }


}
