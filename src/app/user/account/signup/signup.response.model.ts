import { AuthenticatedUser } from "../../user.model";

export class AccountSignupResponse {
    
    constructor(public accountId: string,
        public refreshedUser: AuthenticatedUser,
        public errorAdmins: string[]) {}

}