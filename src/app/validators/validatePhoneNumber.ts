import {AbstractControl} from "@angular/forms";
import {isValidNumber, parseNumber, formatNumber, ParsedNumber} from "libphonenumber-js";

export function validatePhoneNumber(control:AbstractControl){
    let phoneNumber = control.value;
    const parsed_number: ParsedNumber = parseNumber(phoneNumber,'SA');

    formatNumber(parsed_number.phone,'International');
    if(!isValidNumber(parsed_number)){
        control.get('phone').setErrors({invalidNumber:true})
        //return {invalidNumber:true}
    }
    return null;
}
