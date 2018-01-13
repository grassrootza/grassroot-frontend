import {AbstractControl} from '@angular/forms';
import {parse, format, asYouType, isValidNumber} from "libphonenumber-js";

export class NumberValidator{
	static numberValidator(control:AbstractControl){
		let phoneNumber = control.value;
		let parsed_number = parse(phoneNumber,'SA');

		format(parsed_number,"International");
	    if(!isValidNumber(parsed_number)){
	        return {invalidNumber:true}
	    }
	    return null;
	}
}
