import {Timeslot} from '../schedule/timeslot';

export class User {
  public firstName: string;
  public lastName: string;
  public username: string;
  public password: string;
  public id: number;
  public timeslots: Timeslot[];

  constructor(id?: number, firstname?: string, lastname?: string, username?: string, password?: string, timeslots?: Timeslot[]) {
    this.id = id != null ? id : 0;
    this.firstName = firstname != null ? firstname : '';
    this.lastName = lastname != null ? lastname : '';
    this.password = password != null ? password : '';
    this.username = username != null ? username : '';
    this.timeslots = timeslots != null ? timeslots : [];
  }
}
