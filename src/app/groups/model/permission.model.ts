export class Permission {


  constructor(public groupUid: string,
              public forRole: string,
              public permission: string,
              public permissionName: string,
              public permissionLabel: string,
              public permissionDesc: string,
              public permissionEnabled: boolean,
              public position: number) {
  }

}

export class GroupPermissionsByRole{
  values: Map<string,  Permission[]>;

  constructor(resp) {
    this.values = new Map<string,  Permission[]>();
    Object.keys(resp).forEach(key => {
      this.addParameter(key, resp[key]);
    });
  }

  addParameter(key: string, value: Permission[]) {
    this.values.set(key, value);
  }

  getParameters(key: string) {
    return this.values.get(key)
  }
}

