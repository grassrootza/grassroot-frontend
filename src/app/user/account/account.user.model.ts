import * as moment from 'moment-mini-ts';

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
        public totalSpentThisMonth: number,
        public spendingLimit: number,
        public notificationsSinceLastBill?: number,
        public chargedUssdSinceLastBill?: number,
        public costPerMessage?: number,
        public costPerUssdSession?: number,
        public monthlyFlatFee?: number) { }

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
        account.geoDataSets,
        account.totalSpentThisMonth,
        account.spendingLimit);

    acc.notificationsSinceLastBill = account.notificationsSinceLastBill;
    acc.chargedUssdSinceLastBill = account.chargedUssdSinceLastBill;
    acc.costPerMessage = account.costPerMessage;
    acc.costPerUssdSession = account.costPerUssdSession;
    acc.monthlyFlatFee = account.monthlyFlatFee;

    console.log('constructed account wrapper, charged USSD: ', acc.chargedUssdSinceLastBill);

    return acc;
} 