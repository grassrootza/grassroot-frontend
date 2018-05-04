export class AdminUser {
    constructor(public uid:string,
        public displayName:string){}
    
        public static createInstance(adminUser:AdminUser):AdminUser{
            return new AdminUser(adminUser.uid,adminUser.displayName)
        }
}
