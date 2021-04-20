import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {User} from '../../dtos/user/user';
import {AppService} from '../../app/app.service';
import {Client} from '../../dtos/user/client';
import {Select2OptionData} from 'ng-select2';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {SelectOption} from '../../dtos/util/SelectOption';
import $ from 'jquery';
import {Router} from '@angular/router';

@Component({
  selector: 'app-register-client',
  templateUrl: './editClient.component.html',
  styleUrls: ['./editClient.component.scss']
})
export class EditClientComponent implements OnInit {
  client: Client;
  user = new User();
  newClient = new Client();
  serverError = false;
  isLoaded = false;
  provinces: Observable<Array<Select2OptionData>> = new Observable<Array<Select2OptionData>>();
  cities: Observable<Array<Select2OptionData>> = new Observable<Array<Select2OptionData>>();
  selectedCity: Observable<Select2OptionData> = new Observable<Select2OptionData>();
  selectedProvince: Observable<Select2OptionData> = new Observable<Select2OptionData>();
  nameStyle = ''; phoneStyle = '';
  streetStyle = ''; numberStyle = '';

  constructor(private service: AppService, private refChange: ChangeDetectorRef, private router: Router) {
    this.service.checkCredentials();
    if (history.state.client === undefined) {
      this.router.navigate(['/']).then();
    }
    this.client = history.state.client;
    this.service.getCurrentLoggedInUser().subscribe(response => {
      this.user = response.body;
      this.isLoaded = true;
    }, () => {
      this.serverError = true;
      this.isLoaded = true;
    });
  }

  ngOnInit(): void {
    this.provinces = this.service.getResourceAsync('/api/v1/provinces/all', false)
      .pipe(map((values: any) => values.body.map((value: any) => {
        return new SelectOption(value.id, value.name);
      })));
  }

  loadCities(newValue: string | string[]): void {
    if (newValue !== undefined && newValue !== null) {
      this.cities = this.service.getResourceAsync('/api/v1/cities/all/' + newValue, false)
        .pipe(map((values: any) => values.body.map((value: any) => {
          return new SelectOption(value.id, value.name);
        })));
    }
  }

  updateSelectedCity(newValue: string | string[]): void {
    if (newValue !== undefined && typeof newValue === 'string') {
      this.newClient.address.city.id = Number(newValue);
    }
  }

  updateClient(): void {
    const submitButton = $('#updateClient');
    submitButton.html('<div class="spinner-border text-dark" role="status">\n' +
      '  <span class="visually-hidden">Loading...</span>\n' +
      '</div>');
    if (!this.validateInfo()) {
      submitButton.html('ثبت اطلاعات');
      return;
    }
    this.adjustNewData();
    this.service.putResource('/api/v1/clients', this.newClient)
      .subscribe(response => this.handleClientUpdateResponse(response), error => this.handleClientUpdateResponse(error));
  }

  validateInfo(): boolean {
    return !((this.newClient.name === '' || this.newClient.name === undefined) &&
      (this.newClient.address.city.id === 0) &&
      (this.newClient.address.street === '' || this.newClient.address.street === undefined) &&
      (this.newClient.address.houseNumber === '' || this.newClient.address.houseNumber === undefined) &&
      (this.newClient.address.phoneNumber === '' || this.newClient.address.phoneNumber === undefined));
  }

  adjustNewData(): void {
    this.newClient.id = this.client.id;
    this.newClient.userInfo = this.user;
    this.newClient.name = this.newClient.name === '' || this.newClient.name === undefined
      ? this.client.name
      : this.newClient.name;
    this.newClient.address.city.id = this.newClient.address.city.id === 0
      ? this.client.address.city.id
      : this.newClient.address.city.id;
    this.newClient.address.street = this.newClient.address.street === '' || this.newClient.address.street === undefined
      ? this.client.address.street
      : this.newClient.address.street;
    this.newClient.address.houseNumber = this.newClient.address.houseNumber === '' || this.newClient.address.houseNumber === undefined
      ? this.client.address.houseNumber
      : this.newClient.address.houseNumber;
    this.newClient.address.phoneNumber = this.newClient.address.phoneNumber === '' || this.newClient.address.phoneNumber === undefined
      ? this.client.address.phoneNumber
      : this.newClient.address.phoneNumber;
  }

  handleClientUpdateResponse(response: any): void {
    $('#name, #phoneNumber, #province, #city, #street, #houseNumber').val('');
    if (response.status === 204) {
      this.router.navigate(['/client/' + this.client.id]).then(() => $('#updateClient').html('ثبت اطلاعات'));
    } else {
      this.serverError = true;
      $('#updateClient').html('ثبت اطلاعات');
    }
  }
}
