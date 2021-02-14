import {City} from './city';

export class Province {
  public id: number;
  public name: string;
  public cities: (City)[];

  constructor(id?: number, name?: string, cities?: (City)[]) {
    this.id = id != null ? id : 0;
    this.name = name != null ? name : '';
    this.cities = cities ? cities : [];
  }
}
