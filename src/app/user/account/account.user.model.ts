import * as moment from "moment";

export class UserExtraAccount {

    constructor(public uid: string,
        public enabled: boolean,
        public name: string,
        public subscriptionId: string, 
        public createdByUserName: string,
        public createdByCallingUser: boolean,
        public paidForGroups: any,
        public otherAdmins: any,
        public primary: boolean,
        public otherAccounts: any,
        public lastBillingDateMillis: number,
        public geoDataSets: string[],
        public notificationsSinceLastBill?: number,
        public chargedUssdSinceLastBill?: number) { }

    getLastBillingDate(): string {
        return moment(this.lastBillingDateMillis).format('Do MMMM YYYY');
    }
    
}

export const getEntity = (account: UserExtraAccount): UserExtraAccount => {
    let acc = new UserExtraAccount(account.uid,
        account.enabled,
        account.name,
        account.subscriptionId,
        account.createdByUserName,
        account.createdByCallingUser,
        account.paidForGroups,
        account.otherAdmins,
        account.primary,
        account.otherAccounts,
        account.lastBillingDateMillis,
        account.geoDataSets);

    if (account.notificationsSinceLastBill)
        acc.notificationsSinceLastBill = account.notificationsSinceLastBill;

    if (account.chargedUssdSinceLastBill)
        acc.chargedUssdSinceLastBill = account.chargedUssdSinceLastBill;

    return acc;
} 