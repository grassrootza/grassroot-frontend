import * as moment from 'moment-mini-ts';

export class SubscriptionAccount {

    constructor(public id: string,
        public customerId: string,
        public account_name: string,
        public plan: string,
        public status: string,
        public due_invoices: number,
        public next_billing: number) {}

    public nextBillingDate() {
        return moment.unix(this.next_billing).format('Do MMMM YYYY');
    }
}

export const getAccountEntity = (acc: SubscriptionAccount): SubscriptionAccount => {
    return new SubscriptionAccount(
        acc.id, acc.customerId, acc.account_name, acc.plan, acc.status, acc.due_invoices, acc.next_billing
    );
}