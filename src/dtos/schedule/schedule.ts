import {Client} from '../user/client';
import {Timeslot} from './timeslot';

export class Schedule {
  public id: number;
  public name: string;
  public fromDate: string;
  public toDate: string;
  public fromTime: string;
  public toTime: string;
  public intervalTime: number;
  public client: Client;
  public timeSlots: (Timeslot)[];

  constructor(id?: number, name?: string, fromDate?: string, toDate?: string, fromTime?: string, toTime?: string,
              intervalTime?: number, client?: Client, timeSlots?: Timeslot[]) {
    this.id = id != null ? id : 0;
    this.name = name != null ? name : '';
    this.fromDate = fromDate != null ? fromDate : '';
    this.toDate = toDate != null ? toDate : '';
    this.fromTime = fromTime != null ? fromTime : '';
    this.toTime = toTime != null ? toTime : '';
    this.intervalTime = intervalTime != null ? intervalTime : 0;
    this.client = client ? client : new Client();
    this.timeSlots = timeSlots ? timeSlots : [];
  }
}
