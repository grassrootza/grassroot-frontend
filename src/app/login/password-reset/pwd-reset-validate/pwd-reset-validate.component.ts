import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-pwd-reset-validate',
  templateUrl: './pwd-reset-validate.component.html',
  styleUrls: ['./pwd-reset-validate.component.css', '../password-reset.component.css']
})
export class PwdResetValidateComponent implements OnInit {

  constructor() {
    console.log("initiating validate component");
  }

  ngOnInit() {
  }

}
