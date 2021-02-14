import {City} from './city';

export class Address {
  public id: number;
  public city: City;
  public street: string;
  public phoneNumber: string;
  public houseNumber: string;


  constructor(id?: number, city?: City, street?: string, phoneNumber?: string, houseNumber?: string) {
    this.id = id != null ? id : 0;
    this.city = city ? city : new City();
    this.street = street != null ? street : '';
    this.phoneNumber = phoneNumber != null ? phoneNumber : '';
    this.houseNumber = houseNumber != null ? houseNumber : '';
  }
}
