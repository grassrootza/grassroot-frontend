import { Component, OnInit } from '@angular/core';
import { LiveWireAdminService } from '../livewire-admin-service';
import { DataSubscriber } from '../model/data-subscriber.model';

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.css']
})
export class AccountsComponent implements OnInit {

  public subscribers:DataSubscriber[] = [];

  constructor(private livewireAdminService:LiveWireAdminService) { }

  ngOnInit() {
    this.livewireAdminService.allSubscribers().subscribe(resp => {
      console.log("Subscribers........",resp);
      this.subscribers = resp;
    },error => {
      console.log("Error loading subscribers...",error);
    });
  }

}
