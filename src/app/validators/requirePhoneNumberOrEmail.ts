import {AbstractControl} from "@angular/forms";

export function requirePhoneNumberOrEmail(control:AbstractControl){
    let inputStr = control.value;

    var mailFormat = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})|([0-9]{10})+$/;
    var phoneNumberFormat = /[0-9 -()+]+$/;
    var isEmail:boolean = false;
    var isPhoneNumber:boolean = false;

    isEmail = mailFormat.test(inputStr) ? true : false;

    isPhoneNumber = inputStr.length == 10 && phoneNumberFormat.test(inputStr) ? true : false;

    if(!isEmail && !isPhoneNumber){
        return{invalidInput:true}
    }
    return null;
}
