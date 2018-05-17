import { LiveWireAlert } from "../../../livewire/live-wire-alert.model";
import { Component, OnInit } from '@angular/core';
import {LiveWireAdminService} from "../livewire-admin-service";

@Component({
  selector: 'app-live-wire-list',
  templateUrl: './live-wire-list.component.html',
  styleUrls: ['./live-wire-list.component.css']
})
export class LiveWireListComponent implements OnInit {

  public alertList:LiveWireAlert[]=[];
  public pageNumber:number = 0;
  public totalPages:number;
  public sort:string = "desc";

  constructor(private liveWireAlertService:LiveWireAdminService) { }

  ngOnInit() {
    this.loadAlerts(this.pageNumber,this.sort);
  }

  loadAlerts(pageNumber:number,sort:string){
    this.liveWireAlertService.loadLivewireAlerts(pageNumber,sort).subscribe(resp => {
      this.alertList = resp.content;
      this.totalPages = resp.totalPages;
    },error =>{
      console.log("Erro loading alerts.......",error);
    });
  }

  nextPage(){
    this.pageNumber += 1;
    if(this.pageNumber < this.totalPages -1){
      this.loadAlerts(this.pageNumber,this.sort);
    }else{
      this.pageNumber = this.totalPages -1;
      this.loadAlerts(this.pageNumber,this.sort);
    }
  }

  previousPage(){
    this.pageNumber -= 1;
    if(this.pageNumber > 0){
      this.loadAlerts(this.pageNumber,this.sort);
    }else{
      this.pageNumber = 0;
      this.loadAlerts(this.pageNumber,this.sort);
    }
  }
  onchangeSort(value:string){
    this.sort = value;
    this.loadAlerts(this.pageNumber,this.sort);
  }
}
