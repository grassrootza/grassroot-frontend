export class GroupCreateRequest {

  constructor(public name: string,
              public description: string,
              public permissionTemplate: string,
              public reminderMinutes: number,) {
  }

}
