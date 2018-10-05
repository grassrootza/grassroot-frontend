import {Component, HostListener, OnInit} from '@angular/core';
import {UserProvince} from "../model/user-province.enum";
import {UserService} from "../user.service";
import {UserProfile} from "../user.model";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {AlertService} from "../../utils/alert-service/alert.service";
import {Ng2ImgMaxService} from "ng2-img-max";
import {MediaService} from "../../media/media.service";
import {emailOrPhoneEntered, optionalEmailValidator, optionalPhoneValidator} from "../../validators/CustomValidators";

declare var $: any;

@Component({
  selector: 'app-profile-form',
  templateUrl: './profile-form.component.html',
  styleUrls: ['./profile-form.component.css', '../profile-container/user-profile.component.css']
})
export class ProfileFormComponent implements OnInit {

  provinces = UserProvince;
  provinceKeys: string[];

  userProfile: UserProfile;
  profileForm: FormGroup;
  otpForm: FormGroup;

  public dragAreaClass: string = "dragarea";
  public imageErrors: string[] = [];
  public currentImageUrl: string;

  public accessToken: string = "";

  constructor(private userService: UserService,
              private formBuilder: FormBuilder,
              private alertService: AlertService,
              private mediaService: MediaService,
              private ng2ImgMax: Ng2ImgMaxService) {
    this.provinceKeys = Object.keys(this.provinces);

    console.log("empty profile looks like: ", new UserProfile());
    this.profileForm = this.formBuilder.group(new UserProfile());
    this.otpForm = this.formBuilder.group({
      'otp': ['', Validators.compose([Validators.required, Validators.minLength(3)])]
    });

    this.profileForm = new FormGroup({
        email:new FormControl('',[optionalEmailValidator]),
        name:new FormControl('',Validators.required),
        phone:new FormControl('',[optionalPhoneValidator]),
        province:new FormControl('',Validators.required),
        language:new FormControl('',Validators.required)
    }, emailOrPhoneEntered("email", "phone"));

  }

  ngOnInit() {
    this.userProfile = new UserProfile(this.userService.getLoggedInUser());
    this.profileForm.setValue(this.userProfile);
    this.currentImageUrl = this.userService.getProfileImageUrl(false);
    this.dragAreaClass = this.dragClass();
  }

  saveChanges() {
    console.log("saving changes! form looks like: ", this.profileForm.value);
    console.log("User email......" + this.userProfile.email);
    this.userProfile = this.profileForm.value;
    this.userService.updateDetails(this.userProfile)
      .subscribe(message => {
        if (message == 'OTP_REQUIRED') {
          $('#enter-otp-modal').modal("show");
        } else if (message == 'UPDATED') {
          this.alertService.alert("user.profile.completed");
        }
    }, error => {
        console.log("that didn't work, error: ", error);
    })
  }

  submitOtp() {
    this.userService.updateDetails(this.userProfile, this.otpForm.value['otp'])
      .subscribe(message => {
        // really need that snackbar (or similar) design
        $("#enter-otp-modal").modal('hide');
        console.log("may have worked? ", message);
        this.alertService.alert("user.profile.completed");
      }, error => {
        // display an error message ...
        console.log("ah, an error: ", error);
      });
  }

  onImageSelected(image) {
    // let image = event.target.files[0];
    console.log("image valid? : ", image);
    this.imageErrors = this.mediaService.isValidImage(image, true);
    if (this.imageErrors && this.imageErrors.length > 0) {
      console.log("image errors: ", this.imageErrors);
      return;
    }

    this.alertService.showLoading();
    this.ng2ImgMax.resizeImage(image, 200, 200, true).subscribe(result => {
      let resizedImage = new File([result], image.name);
      this.userService.updateImage(resizedImage).subscribe(result => {
        console.log("done! result: ", result);
        this.alertService.hideLoading();
        this.currentImageUrl = this.userService.getProfileImageUrl(true);
      }, error => {
        console.log("Error! Could not change user image", error);
        this.alertService.hideLoading();
      })
    });
  }

  dragClass(): string {
    return this.currentImageUrl ? 'dragarea-with-image' : 'dragarea';
  }

  @HostListener('dragover', ['$event']) onDragOver(event) {
    this.dragAreaClass = "droparea";
    event.preventDefault();
  }

  @HostListener('dragenter', ['$event']) onDragEnter(event) {
    this.dragAreaClass = "droparea";
    event.preventDefault();
  }import

  @HostListener('dragend', ['$event']) onDragEnd(event) {
    this.dragAreaClass = this.dragClass();
    event.preventDefault();
  }

  @HostListener('dragleave', ['$event']) onDragLeave(event) {
    this.dragAreaClass = this.dragClass();
    event.preventDefault();
  }

  @HostListener('drop', ['$event']) onDrop(event) {
    this.dragAreaClass = this.dragClass();
    event.preventDefault();
    event.stopPropagation();
    let files = event.dataTransfer.files;
    this.onImageSelected(files[0]);
  }

}
