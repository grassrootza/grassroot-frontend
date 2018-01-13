import {AbstractControl} from "@angular/forms";
import {parse, format, asYouType, isValidNumber} from "libphonenumber-js";

export function validatePhoneNumber(control:AbstractControl){
    let phoneNumber = control.value;
    let parsed_number = parse(phoneNumber,'SA');

    format(parsed_number,"International_plaintext");
    if(!isValidNumber(parsed_number)){
        control.get('phone').setErrors({invalidNumber:true})
        //return {invalidNumber:true}
    }
    return null;
}
