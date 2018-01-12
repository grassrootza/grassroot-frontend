
import {AbstractControl} from "@angular/forms";

export function validateEmail(control:AbstractControl){
    let email = control.value;
    if(email && email.valueOf("@") != -1){
        let [_,domain] = email.split("@");
        var domains: string[] = ["grassroot.org.za","gmail.com","yahoo.com"];

        if(domains.indexOf(domain) > -1){
          return {
            emailDomain:{
              parsedDomain:domain
            }
          }
        }
    }
    return null;
}
