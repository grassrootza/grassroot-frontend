import {Component, OnInit} from '@angular/core';
import {UserService} from "../../user/user.service";
import {FormBuilder} from "@angular/forms";
import {Router} from "@angular/router";

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.css']
})
export class PasswordResetComponent implements OnInit {

  constructor(private userService: UserService,
              private formBuilder: FormBuilder,
              private router: Router) { }

  ngOnInit() {
    // create form with validator
  }

  next() {
    // this.userService;
    this.router.navigate(['./validate']);

  }

}
