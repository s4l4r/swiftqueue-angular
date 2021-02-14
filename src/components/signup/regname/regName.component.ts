import {Component} from '@angular/core';
import {User} from '../../../dtos/user/user';
import {AppService} from '../../../app/app.service';
import {Router} from '@angular/router';
import {NgxUiLoaderService} from 'ngx-ui-loader';

@Component({
  selector: 'app-regname',
  templateUrl: './regName.component.html',
  styleUrls: ['./regName.component.css']
})
export class RegNameComponent {
  user: User;
  firstNameBorderStyle: string | undefined;
  lastNameBorderStyle: string | undefined;

  constructor(private service: AppService, private router: Router, private ngxService: NgxUiLoaderService) {
    ngxService.stop();
    if (history.state.user === undefined) {
      this.router.navigate(['/signup']).then(r => r);
    }
    this.user = history.state.user;
  }

  nextStep(): void {
    const nextButton = $('#btn-regname');
    nextButton.html('<div class="spinner-border text-dark" role="status">\n' +
      '  <span class="visually-hidden">Loading...</span>\n' +
      '</div>');
    if (!this.validateName()) {
      nextButton.html('مرحله بعد');
      return;
    }
    this.router.navigate(['/addpass'], {state: {user: this.user}}).then(() => nextButton.html('مرحله بعد'));
  }

  previousStep(): void {
    const previousButton = $('#previousStep');
    previousButton.html('<div class="spinner-border text-dark" role="status">\n' +
      '  <span class="visually-hidden">Loading...</span>\n' +
      '</div>');
    this.router.navigate(['/signup'], {state: {user: this.user}}).then(() => previousButton.html('مرحله قبل'));
  }

  validateName(): boolean {
    if (this.user?.firstName === '' || this.user?.firstName === undefined) {
      this.firstNameBorderStyle = '3px solid red';
      return false;
    } else {
      this.firstNameBorderStyle = '';
    }
    if (this.user.lastName === '' || this.user.lastName === undefined) {
      this.lastNameBorderStyle = '3px solid red';
      return false;
    } else {
      this.lastNameBorderStyle = '';
    }
    return true;
  }
}
