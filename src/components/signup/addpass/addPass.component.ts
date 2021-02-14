import {Component} from '@angular/core';
import {User} from '../../../dtos/user/user';
import {AppService} from '../../../app/app.service';
import {Router} from '@angular/router';
import {NgxUiLoaderService} from 'ngx-ui-loader';

@Component({
  selector: 'app-addpassword',
  templateUrl: './addPass.component.html',
  styleUrls: ['./addPass.component.css']
})
export class AddPassComponent {
  user: User;
  passwordBorderStyle: string | undefined;
  passwordErrorMessage: string | undefined;
  regexp: RegExp = /^(?=.*[A-Za-z])(?=.*\d)[-A-Za-z\d]{8,}$/g;

  constructor(private service: AppService, private router: Router, private ngxService: NgxUiLoaderService) {
    ngxService.stop();
    if (history.state.user === undefined) {
      this.router.navigate(['/signup']).then(r => r);
    }
    this.user = history.state.user;
  }

  nextStep(): void {
    const nextButton = $('btn-addpass');
    nextButton.html('<div class="spinner-border text-dark" role="status">\n' +
      '  <span class="visually-hidden">Loading...</span>\n' +
      '</div>');
    if (!this.regexp.test(this.user.password)) {
      this.passwordBorderStyle = '1px solid red';
      this.passwordErrorMessage = 'رمز عبور باید حداقل ۸ کاراکتر و شامل یک حرف و یک عدد باشد';
      nextButton.html('مرحله بعد');
      return;
    } else {
      this.passwordBorderStyle = '';
      this.passwordErrorMessage = '';
    }
    this.router.navigate(['/confirmpass'], {state: {user: this.user}}).then(() => nextButton.html('مرحله بعد'));
  }

  previousStep(): void {
    const previousButton = $('#previousStep');
    previousButton.html('<div class="spinner-border text-dark" role="status">\n' +
      '  <span class="visually-hidden">Loading...</span>\n' +
      '</div>');
    this.router.navigate(['/regname'], {state: {user: this.user}}).then(() => previousButton.html('مرحله قبل'));
  }
}
