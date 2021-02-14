import {Province} from './province';

export class City {
  public id: number;
  public name: string;
  public province: Province;

  constructor(id?: number, name?: string, province?: Province) {
    this.id = id != null ? id : 0;
    this.name = name != null ? name : '';
    this.province = province ? province : new Province();
  }
}
