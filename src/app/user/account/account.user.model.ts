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
        public notificationsSinceLastBill?: number) { }
    
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
        account.lastBillingDateMillis);

    if (account.notificationsSinceLastBill)
        acc.notificationsSinceLastBill = account.notificationsSinceLastBill;

    return acc;
} 