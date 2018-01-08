export class JoinInfo {

  userLoggedIn: boolean;
  userAlreadyMember: boolean;

  groupUid: string;
  groupName: string;
  groupDescription: string;

  groupTopics: string[];

}

export class JoinRequest {

  name: string = "";
  email: string = "";
  phone: string = "";
  province: string = "";
  topics: string[] = [];

}
