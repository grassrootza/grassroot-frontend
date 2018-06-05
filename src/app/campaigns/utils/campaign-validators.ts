import {CampaignService} from "../campaign.service";
import {AbstractControl, FormControl, Validators} from "@angular/forms";
import {Observable} from "rxjs/Observable";
import "rxjs/add/observable/timer";
import "rxjs/add/operator/switchMap";
import "rxjs/add/operator/map";
import {urlValidator} from "../../validators/CustomValidators";
import {isNumeric} from "rxjs/util/isNumeric";

export class ValidateCodeNotTaken {
  static createValidator(cs: CampaignService, campaignUid?: string) {
    return (control: AbstractControl) => {
      return Observable.timer(500).switchMap(() => {
        // console.log("checking a code");
        return cs.checkCodeAvailability(control.value, campaignUid).map(res => {
          // console.log("result: ", res);
          return res ? null : { codeTaken: true }
        })
      })
    }
  }
}

export class ValidateWordNotTaken {
  static createValidator(cs: CampaignService, campaignUid?: string) {
    return (control: AbstractControl) => {
      return Observable.timer(500).switchMap(() => {
        return cs.checkJoinWordAvailability(control.value, campaignUid).map(res => {
          return res ? null : { wordTaken: true }
        })
      })
    }
  }
}

export const hasGroupNameIfNeeded = (input: FormControl) => {
  if (!input.root) {
    return null;
  }

  if (input.root.get('groupType') && input.root.get('groupType').value == 'NEW') {
    return Validators.required(input);
  }

  return null;
};

export const hasChosenGroupIfNeeded = (input: FormControl) => {
  if (!input.root) {
    return null;
  }

  if (input.root.get('groupType') && input.root.get('groupType').value == 'EXISTING') {
    return Validators.required(input);
  }

  return null;
};

export const hasValidLandingUrlIfNeeded = (input: FormControl) => {
  if (!input.root || !(input.root.get('landingPage'))) {
    return null;
  }

  if (input.root.get('landingPage') && input.root.get('landingPage').value == 'OTHER') {
    return urlValidator(input);
  }

  return null;
};

export const checkCodeIsNumber = (control: FormControl) => {
  let code = control.value;
  if ((code) && !isNumeric(code)) {
    return { codeNumber: true }
  }
  return null;
};

export const smsLimitAboveZero = (input: FormControl) => {
  if (!input.root)
    return null;

  if (input.root.get('smsShare') && input.root.get('smsShare').value == 'true') {
    if (+input.value < 10) {
      return { minShare: true };
    }
  }
  return null;
};
