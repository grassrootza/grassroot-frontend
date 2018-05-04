import { Component, OnInit } from '@angular/core';
import { LiveWireAdminService } from '../livewire-admin-service';
import { DataSubscriber } from '../model/data-subscriber.model';

declare var $: any;

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.css']
})
export class AccountsComponent implements OnInit {

  public subscribers:DataSubscriber[] = [];

  public addPrimaryEmail:boolean;
  public makeAccountActive:boolean;

  constructor(private livewireAdminService:LiveWireAdminService) {
    this.addPrimaryEmail = false;
    this.makeAccountActive = false;
  }

  ngOnInit() {
    this.livewireAdminService.allSubscribers().subscribe(resp => {
      console.log("Subscribers........",resp);
      this.subscribers = resp;
    },error => {
      console.log("Error loading subscribers...",error);
    });
  }

  triggerCreateSubscriberModal(){
    $('#create-subscriber-modal').modal("show");
  }

  createSubscriber(subscriberName:string,primaryEmail:string,otherEmails:string){
    this.livewireAdminService.createSubscriber(subscriberName,primaryEmail,this.addPrimaryEmail,otherEmails,this.makeAccountActive).subscribe(resp => {
      console.log("Response.....",resp);
    },error => {
      console.log("Error creating subscriber......",error);
    });
  }
}
