import {isValidNumber} from "libphonenumber-js";
import {AbstractControl, FormGroup, Validators} from "@angular/forms";

export const optionalPhoneValidator = (control: AbstractControl) => {
  let inputStr = control.value;

  if (!inputStr) {
    return null;
  }

  if (inputStr.length < 10 || !isValidNumber({ phone: inputStr, country: 'ZA' })) {
    return { validZaPhone: true }
  }

  return null;
};

export const optionalEmailValidator = (control: AbstractControl) => {
  // console.log("calling email validator");
  if (!control.value) {
    return null;
  }
  // console.log("value present, validate");

  return Validators.email(control);
};

export const eitherEmailOrPhoneEntered = (form: FormGroup) => {
  let email = form.get("email");
  let phone = form.get("phone");

  if ((!email.value) && (!phone.value)) {
    // console.log("fire error!");
    return { emailAndPhoneBlank: true}
  }

  return null;

};
