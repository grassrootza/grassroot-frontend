import * as moment from "moment";
import {Moment} from "moment";
import {AccountType} from "./account-type.enum";
import {AccountBillingCycle} from "./account-billing-cycle.enum";

export class Account {


  constructor(public uid: string,
              public createdByUserName: string,
              public createdByCallingUser: boolean,
              public billingUserName: string,
              public billingUserEmail: string,
              public billingUserUid: string,
              public billedToCallingUser: boolean,
              public enabled: string,
              public type: AccountType,
              public name: string,
              public maxNumberGroups: number,
              public maxSizePerGroup: number,
              public maxSubGroupDepth: number,
              public todosPerGroupPerMonth: number,
              public freeFormMessages: number,
              public lastPaymentDateMilli: Moment,
              public nextBillingDateMilli: Moment,
              public outstandingBalance: number,
              public subscriptionFee: number,
              public groupsLeft: number,
              public messagesLeft: number,
              public billingCycle: AccountBillingCycle) {
  }

  public static transformDates(account: Account) {
    account.lastPaymentDateMilli = moment(account.lastPaymentDateMilli);
    account.nextBillingDateMilli = moment(account.nextBillingDateMilli);
    return account;
  }
}
