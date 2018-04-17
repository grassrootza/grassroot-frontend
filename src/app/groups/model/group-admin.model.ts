export class GroupAdmin {
  constructor(public groupUid: string,
          public name: string,
          public memberCount: number,
          public creatingUserName:string,
          public active:boolean) {
  }

  public static createInstance(groupAdmin:GroupAdmin):GroupAdmin{
  	return new GroupAdmin(groupAdmin.groupUid,
  		groupAdmin.name,
  		groupAdmin.memberCount,
  		groupAdmin.creatingUserName,
  		groupAdmin.active);
  }
}
