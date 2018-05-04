import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { LiveWireAdminService } from 'app/admin/livewire/livewire-admin-service';
import { DataSubscriber } from '../../../model/data-subscriber.model';
import { AdminUser } from '../../../../../user/model/admin-user.model';

declare var $: any;


@Component({
  selector: 'app-view-subscriber',
  templateUrl: './view-subscriber.component.html',
  styleUrls: ['./view-subscriber.component.css']
})
export class ViewSubscriberComponent implements OnInit {

  public subscriberUid:string;
  public subscriber:DataSubscriber;
  public usersWithAccess:AdminUser[];
  public emailToRemove:string;


  constructor(private route: ActivatedRoute,
    private livewireAdminService:LiveWireAdminService) { }

  ngOnInit() {
    this.route.params.subscribe((params:Params) => {
      this.subscriberUid = params['id'];
      console.log('Subscriber uid.......',params);
      this.loadSubscriber(this.subscriberUid);
      this.loadUsersWithAccess();
    },error => {
      console.log("Error loading params....",error);
    });
  }

  loadSubscriber(uid:string){
    this.livewireAdminService.loadSubscriber(uid).subscribe(resp => {
      console.log("Response.....",resp);
      this.subscriber = resp;
    },error =>{
      console.log("Error loading subscriber....",error);
    });
  }

  triggerAddEmailsModal(){
    $('#add-emails-modal').modal("show");
  }

  triggerConfirmRemoveEmailModal(email:string){
    this.emailToRemove = email;
    $('#confirm-remove-email-modal').modal("show");
  }

  addEmails(emails:string){
    console.log("Emails to add......",emails);
    this.livewireAdminService.addPushEmailsToSubscriber(this.subscriberUid,emails).subscribe(resp => {
      $('#add-emails-modal').modal("hide");
      console.log("Response ....",resp);
    },error =>{
      console.log("Error adding emails to subscriber.....",error);
    });
  }

  removeEmail(){
    this.livewireAdminService.removePushEmailsFromSubscriber(this.subscriberUid,this.emailToRemove).subscribe(resp => {
      $('#confirm-remove-email-modal').modal("hide");
    },error => {
      console.log("Error removing email ....",error);
    });
  }

  loadUsersWithAccess(){
    this.livewireAdminService.loadSubscriberUsersWithAccess(this.subscriberUid).subscribe(resp => {
      this.usersWithAccess = resp;
      console.log("Users with access.....",resp);
    },error => {
      console.log("Error loading users with acces....",error);
    });
  }

}
