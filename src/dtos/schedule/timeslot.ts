import {Client} from '../user/client';
import {User} from '../user/user';
import {Schedule} from './schedule';

export class Timeslot {
  public id: number;
  public client: Client;
  public date: string;
  public time: string;
  public userInfo: User;
  public reserved: boolean;
  public schedule: Schedule;

  constructor(id?: number, client?: Client, date?: string, time?: string, userInfo?: User, reserved?: boolean, schedule?: Schedule) {
    this.id = id != null ? id : 0;
    this.date = date != null ? date : '';
    this.time = time != null ? time : '';
    this.client = client ? client : new Client();
    this.userInfo = userInfo ? userInfo : new User();
    this.reserved = reserved != null ? reserved : false;
    this.schedule = schedule != null ? schedule : new Schedule();
  }
}
