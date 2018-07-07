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
        public otherAccounts: any) { }
    
}

export const getEntity = (account: UserExtraAccount): UserExtraAccount => {
    return new UserExtraAccount(account.uid,
        account.enabled,
        account.name,
        account.subscriptionId,
        account.createdByUserName,
        account.createdByCallingUser,
        account.paidForGroups,
        account.otherAdmins,
        account.primary,
        account.otherAccounts);
} 