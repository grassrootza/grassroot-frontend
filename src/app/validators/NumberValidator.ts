import {AbstractControl} from '@angular/forms';
import {parse, format, isValidNumber} from "libphonenumber-js";

export class NumberValidator{
	static numberValidator(control:AbstractControl){
		let phoneNumber = control.value;

		var testNum = /^\d+$/.test(phoneNumber.replace(/ /g, ''));

		if(!testNum){
		    return {numbersOnly:true}
    }

		let parsed_number = parse(phoneNumber,'ZA');

		format(parsed_number,"International");
	    if(!isValidNumber(parsed_number)){
	        return {invalidNumber:true}
	    }
	    return null;
	}
}
