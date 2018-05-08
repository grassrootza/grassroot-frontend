export class AdminUser {
    constructor(public userUid:string,
        public displayName:string){}
    
        public static createInstance(adminUser:AdminUser):AdminUser{
            return new AdminUser(adminUser.userUid,adminUser.displayName)
        }
}
