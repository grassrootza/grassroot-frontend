import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { LiveWireAdminService } from 'app/admin/livewire/livewire-admin-service';
import { DataSubscriber } from '../../../model/data-subscriber.model';

@Component({
  selector: 'app-view-subscriber',
  templateUrl: './view-subscriber.component.html',
  styleUrls: ['./view-subscriber.component.css']
})
export class ViewSubscriberComponent implements OnInit {

  public subscriberUid:string;
  public subscriber:DataSubscriber;


  constructor(private route: ActivatedRoute,
    private livewireAdminService:LiveWireAdminService) { }

  ngOnInit() {
    this.route.params.subscribe((params:Params) => {
      this.subscriberUid = params['id'];
      console.log('Subscriber uid.......',params);
      this.loadSubscriber(this.subscriberUid);
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

}
