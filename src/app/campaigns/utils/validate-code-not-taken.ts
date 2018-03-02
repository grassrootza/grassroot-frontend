import {CampaignService} from "../campaign.service";
import {AbstractControl} from "@angular/forms";
import {Observable} from "rxjs/Observable";
import "rxjs/add/observable/timer";
import "rxjs/add/operator/switchMap";
import "rxjs/add/operator/map";

export class ValidateCodeNotTaken {
  static createValidator(cs: CampaignService) {
    return (control: AbstractControl) => {
      return Observable.timer(500).switchMap(() => {
        console.log("checking a code");
        return cs.checkCodeAvailability(control.value).map(res => {
          console.log("result: ", res);
          return res ? null : { codeTaken: true }
        })
      })
    }
  }

}
