import {CampaignService} from "../campaign.service";
import {AbstractControl, FormControl, Validators} from "@angular/forms";
import { timer } from "rxjs";
import { switchMap, map } from 'rxjs/operators';
import {urlValidator} from "../../validators/CustomValidators";

export class ValidateCodeNotTaken {
  static createValidator(cs: CampaignService, campaignUid?: string) {
    return (control: AbstractControl) => {
      return timer(500).pipe(
        switchMap(_ => cs.checkCodeAvailability(control.value, campaignUid)),
        map(res => res ? null : { codeTaken: true })
      )
    }
  }
}

export class ValidateWordNotTaken {
  static createValidator(cs: CampaignService, campaignUid?: string) {
    return (control: AbstractControl) => {
      return timer(500).pipe(
        switchMap(_ => cs.checkJoinWordAvailability(control.value, campaignUid)),
        map(res => res ? null : { wordTaken: true })
      )
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
  if ((code) && isNaN(code)) {
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
