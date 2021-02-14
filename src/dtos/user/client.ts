import {Address} from '../location/address';
import {User} from './user';
import {Schedule} from '../schedule/schedule';


export class Client {
  public id: number;
  public name: string;
  public address: Address;
  public userInfo: User;
  public schedules: (Schedule)[];
  public avatarUrl: string;


  constructor(id?: number, name?: string, address?: Address, userInfo?: User, schedules?: Schedule[], avatarUrl?: string) {
    this.id = id != null ? id : 0;
    this.name = name != null ? name : '';
    this.address = address ? address : new Address();
    this.userInfo = userInfo ? userInfo : new User();
    this.schedules = schedules ? schedules : [];
    this.avatarUrl = avatarUrl != null ? avatarUrl : '';
  }
}
