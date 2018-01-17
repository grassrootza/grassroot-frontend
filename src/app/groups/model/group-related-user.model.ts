import {UserProvince} from '../../user/model/user-province.enum';

export class GroupRelatedUserResponse {


  constructor(public uid: string,
              public name: string,
              public phone: string,
              public email: string,
              public province: UserProvince) {
  }


}
