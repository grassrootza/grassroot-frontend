import {isValidNumber, parsePhoneNumberFromString} from "libphonenumber-js";
import {AbstractControl, FormGroup, Validators} from "@angular/forms";

export const optionalPhoneValidator = (control: AbstractControl) => {
  let inputStr = control.value;

  if (!inputStr) {
    return null;
  }
  
  if (inputStr.length < 10) {
    return { validZaPhone: true };
  }

  if (inputStr.startsWith('27')) { // latest version of libphonenumber has become dumber, so it needs this to validate properly
    inputStr = "+" + inputStr;
  }

  const parsedNumber = parsePhoneNumberFromString(inputStr, 'ZA');
  // console.log('Parsed number: ', parsedNumber);
  // console.log('Is parsed number valid? : ', parsedNumber.isValid());
  if (inputStr.length < 10 || !parsedNumber || !parsedNumber.isValid()) {
    // console.log('Invalid number!');
    return { validZaPhone: true };    
  }

  return null;
};

export const optionalEmailValidator = (control: AbstractControl) => {
  if (!control.value) {
    return null;
  }
  return Validators.email(control);
};

export const urlPattern = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/;

export const optionalUrlValidator = (control: AbstractControl) => {
  if (!control.value) {
    return null;
  }
  return urlValidator(control);
};

export const urlValidator = (control: AbstractControl) => {
  if (urlPattern.test(control.value)) {
    return null;
  }
  return { validUrl: true };
};

export const eitherEmailOrPhoneValid = (control: AbstractControl) => {
  let inputStr = control.value;
  if (!inputStr || inputStr.length < 3) {
    return null;
  }

  // console.log('Checking phone or email, NaN test: ', isNaN(inputStr));
  if (!isNaN(inputStr)) {
    return optionalPhoneValidator(control);
  } else {
    return optionalEmailValidator(control);
  }

};

export const emailOrPhoneEntered = (emailFieldName: string = "email", phoneFieldName: string = "phone") => {
  return (form: FormGroup) => {
    let email = form.get(emailFieldName);
    let phone = form.get(phoneFieldName);

    if ((email) && (!email.value) && (phone) && (!phone.value)) {
      // console.log("fire error!");
      return {emailAndPhoneBlank: true}
    }

    return null;
  }
};
