import {AfterViewInit, ChangeDetectorRef, Component} from '@angular/core';
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
  templateUrl: './registerClient.component.html',
  styleUrls: ['./registerClient.component.scss']
})
export class RegisterClientComponent implements AfterViewInit {
  user = new User();
  client = new Client();
  isLoaded = false;
  serverError = false;
  provinces: Observable<Array<Select2OptionData>> = new Observable<Array<Select2OptionData>>();
  cities: Observable<Array<Select2OptionData>> = new Observable<Array<Select2OptionData>>();
  selectedValue: Observable<Select2OptionData> = new Observable<Select2OptionData>();
  nameStyle = ''; phoneStyle = '';
  streetStyle = ''; numberStyle = '';

  constructor(private service: AppService, private refChange: ChangeDetectorRef, private router: Router) {
    this.service.checkCredentials();
    this.cities = new Observable<Array<Select2OptionData>>();
    this.provinces = this.service.getResourceAsync('/api/v1/provinces/all', false)
      .pipe(map((values: any) => values.body.map((value: any) => {
        return new SelectOption(value.id, value.name);
      })));
    this.service.getCurrentLoggedInUser().subscribe(response => {
      this.user = response.body;
      this.isLoaded = true;
    }, () => {
      this.serverError = true;
      this.isLoaded = true;
    });
  }

  ngAfterViewInit(): void {
    this.refChange.detectChanges();
  }

  loadCities(newValue: string | string[]): void {
    if (newValue !== undefined) {
      this.cities = this.service.getResourceAsync('/api/v1/cities/all/' + newValue, false)
        .pipe(map((values: any) => values.body.map((value: any) => {
          return new SelectOption(value.id, value.name);
        })));
    }
  }

  updateSelectedCity(newValue: string | string[]): void {
    if (newValue !== undefined && typeof newValue === 'string') {
      this.client.address.city.id = Number(newValue);
    }
  }

  saveClient(): void {
    const submitButton = $('#createClient');
    submitButton.html('<div class="spinner-border text-dark" role="status">\n' +
      '  <span class="visually-hidden">Loading...</span>\n' +
      '</div>');
    if (!this.validateClient()) {
      submitButton.html('ثبت اطلاعات');
      return;
    }
    this.client.userInfo = this.user;
    this.service.postResource('/api/v1/clients', this.client, true)
      .subscribe(response => this.handleCreateClientResponse(response), error => this.handleCreateClientResponse(error));
  }

  validateClient(): boolean {
    if (this.client.name === '' || this.client.name === undefined) {
      this.nameStyle = 'border-color: red';
      return false;
    } else {
      this.nameStyle = '';
    }
    if (this.client.address.phoneNumber === '' || this.client.address.phoneNumber === undefined) {
      this.phoneStyle = 'border-color: red';
      return false;
    } else {
      this.phoneStyle = '';
    }
    if (this.client.address.city.id === undefined || this.client.address.city.id === 0 || this.client.address.city.id === null) {
      $('.select2-selection--single').css('border-color', 'red');
      return false;
    } else {
      $('.select2-selection--single').css('border-color', '');
    }
    if (this.client.address.street === '' || this.client.address.street === undefined) {
      this.streetStyle = 'border-color: red';
      return false;
    } else {
      this.streetStyle = '';
    }
    if (this.client.address.houseNumber === '' || this.client.address.houseNumber === undefined) {
      this.numberStyle = 'border-color: red';
      return false;
    } else {
      this.numberStyle = '';
    }
    return true;
  }

  handleCreateClientResponse(response: any): void {
    if (response.status === 201) {
      const resourceLocation = response.headers.get('Location') as string;
      const pathSegments = resourceLocation.split('/');
      const clientId = pathSegments[pathSegments.length - 1];
      this.router.navigate(['/client/' + clientId]).then(() => $('#createClient').html('ثبت اطلاعات'));
    } else {
      this.serverError = true;
      $('#createClient').html('ثبت اطلاعات');
    }
  }
}
