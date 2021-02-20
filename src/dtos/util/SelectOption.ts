import {Select2OptionData} from 'ng-select2';

export class SelectOption implements Select2OptionData {
  id: string;
  text: string;

  constructor(id?: string, text?: string) {
    this.id = id != null ? id : '';
    this.text = text != null ? text : '';
  }
}
