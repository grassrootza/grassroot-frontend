import * as moment from "moment";
import {Moment} from "moment";
import {AccountType} from "./account-type.enum";
import {AccountBillingCycle} from "./account-billing-cycle.enum";

export class AccountBillingRecords {


  constructor(public createdDateTime: Moment,
              public paymentId: string,
             ) {
  }

  public static transformDates(accountBillingRecords: AccountBillingRecords) {
    accountBillingRecords.createdDateTime = moment(accountBillingRecords.createdDateTime);
    return accountBillingRecords;
  }
}
