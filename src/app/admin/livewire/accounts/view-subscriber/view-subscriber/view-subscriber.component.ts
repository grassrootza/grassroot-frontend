import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { LiveWireAdminService } from 'app/admin/livewire/livewire-admin-service';
import { DataSubscriber } from '../../../model/data-subscriber.model';
import { AdminUser } from '../../../../../user/model/admin-user.model';
import { DataSubscriberType } from '../../../model/data-subscriber-type.enum';
import { AlertService } from '../../../../../utils/alert-service/alert.service';

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
  public userToRemoveUid:string;
  public canTag:boolean;
  public canRelease:boolean;
  public subscriberType:any;
  public changeActiveStatusErrorMessage:string;
  public userToRemoveIndex:any;
  public emailToRemoveIndex:any;

  dataSubscriberType = DataSubscriberType;
  dataSubscriberTypeKeys:string[];


  constructor(private route: ActivatedRoute,
              private livewireAdminService:LiveWireAdminService,
              private alertService:AlertService) {
      this.canTag = false;
      this.canRelease = false;
      this.dataSubscriberTypeKeys = Object.keys(this.dataSubscriberType);
     }

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
      this.subscriberType = this.subscriber.subscriberType;
    },error =>{
      console.log("Error loading subscriber....",error);
    });
  }

  triggerAddEmailsModal(){
    $('#add-emails-modal').modal("show");
  }

  triggerConfirmRemoveEmailModal(email:string,index:any){
    this.emailToRemove = email;
    this.emailToRemoveIndex = index;
    $('#confirm-remove-email-modal').modal("show");
  }

  addEmails(emails:string){
    console.log("Emails to add......",emails);
    this.livewireAdminService.addPushEmailsToSubscriber(this.subscriberUid,emails).subscribe(resp => {
      $('#add-emails-modal').modal("hide");
      
      console.log("Response ....",resp);
      this.alertService.alert("Done,email added to subscriber push emails.")
    },error =>{
      console.log("Error adding emails to subscriber.....",error);
    });
  }

  removeEmail(){
    this.livewireAdminService.removePushEmailsFromSubscriber(this.subscriberUid,this.emailToRemove).subscribe(resp => {
      $('#confirm-remove-email-modal').modal("hide");
      this.subscriber.pushEmails.splice(this.emailToRemoveIndex,1);
      this.alertService.alert("Done,email removed from subscriber push emails.");
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

  triggerAddUserModal(){
    $('#add-user-modal').modal("show");
  }

  addUser(phoneNumber:string){
    console.log("Adding user with number.....",phoneNumber);
    this.livewireAdminService.addUserToSubscriber(this.subscriberUid,phoneNumber).subscribe(resp =>{
      console.log("Response adding user...",resp);
      $('#add-user-modal').modal("hide");
      this.loadUsersWithAccess();
      this.alertService.alert("Done,user added to subscriber.")
    },error => {
      console.log("Error adding user.....",error);
    });
  }

  triggerRemoveUserModal(userUid,index:any){
    console.log("User uid for user to remove.....",userUid);
    this.userToRemoveUid = userUid;
    this.userToRemoveIndex = index;
    $('#confirm-remove-user-modal').modal("show");
  }

  removeUser(){
    this.livewireAdminService.removeUserFromSubscriber(this.subscriberUid,this.userToRemoveUid).subscribe(resp => {
      console.log("Response removing user....",resp);
      $('#confirm-remove-user-modal').modal("hide");
      this.usersWithAccess.splice(this.userToRemoveIndex,1);
      this.alertService.alert("Done,user removed.")
    },error =>{
      console.log("Error removing user from subscriber....",error);
    });
  }

  updatePermissions(){
    console.log("Can tag?...",this.canTag);
    console.log("Can release?....",this.canRelease);
    this.livewireAdminService.updateSubscriberPermissions(this.subscriberUid,this.canTag,this.canRelease).subscribe(resp =>{
      this.alertService.alert("Done,subscriber permissions updated.");
    },error =>{
      console.log("Error updating permissions.....",error);
    });
  }

  onchangeSelectedType(type:string){
    this.subscriberType = type;
  }

  updateSubscriberType(){
    this.livewireAdminService.updateSubscriberType(this.subscriberUid,this.subscriberType).subscribe(resp => {
      this.alertService.alert("Done,the subscriber type has been changed.");
    },error =>{
      console.log("Error changing type....",error);
    });
  }

  activateOrDeactivateSubscriber(){
    console.log("Activating subscriber....");
    this.livewireAdminService.getOtp().subscribe(resp => {
      if(resp == 'VERIFICATION_TOKEN_SENT'){
        $('#change-active-status-modal').modal("show");
      }
    },error => {
      console.log("Error getting otp...",error);
    });
  }

  changeActiveStatus(otpSend:string){
    console.log("Otp send....",otpSend);
    this.livewireAdminService.changeSubscriberActiveStatus(this.subscriberUid,otpSend).subscribe(resp =>{
      if(resp == 'INVALID_OTP'){
        this.changeActiveStatusErrorMessage = "Error! Admin user did not validate with OTP";
        setTimeout(()=>{
          this.changeActiveStatusErrorMessage = "";
        },2000);
      }else if(resp == 'UPDATED'){
        $('#change-active-status-modal').modal("hide");
        this.alertService.alert("Done,subscriber active status changed.");
      }
    },error => {
      console.log("Error changing active status...",error);
    });
  }
}
