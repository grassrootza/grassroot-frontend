import { Component, OnInit } from '@angular/core';
import {GroupService} from "../groups/group.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private groupService:GroupService) {

    groupService.loadGroups().subscribe(
      data => {
        console.log("Login response: " , data.json());
      },
      err => {
        console.log(err);
      },
      () => console.log('Request Complete')
    );
  }

  ngOnInit() {
  }

}
