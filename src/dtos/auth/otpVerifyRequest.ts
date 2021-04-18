import {User} from '../user/user';

export class OtpVerifyRequest {
  public code: string;
  public userInfo: User;

  constructor(code?: string, userInfo?: User) {
    this.code = code != null ? code : '';
    this.userInfo = userInfo != null ? userInfo : new User();
  }
}
