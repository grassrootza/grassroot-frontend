import {Language} from "../utils/language";
import {User} from "../user/user.model";

export class JoinInfo {

  userLoggedIn: boolean;
  userAlreadyMember: boolean;

  groupUid: string;
  groupName: string;
  groupDescription: string;
  groupImageUrl: string;

  groupJoinTopics: string[];

}

export class JoinRequest {

  name: string = "";
  email: string = "";
  phone: string = "";
  province: string = "";
  language: string = "";
  topics: string[] = [];

}

export class JoinResult {

  validationCode: string;
  user: User;

}
