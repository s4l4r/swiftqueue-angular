import {Component, OnInit} from '@angular/core';
import {AppService} from '../../../app/app.service';
import {Router} from '@angular/router';
import {take} from 'rxjs/operators';
import {User} from '../../../dtos/user/user';
import {NgxUiLoaderService} from 'ngx-ui-loader';
import $ from 'jquery';

@Component({
  selector: 'app-regphone',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit{
  user: User = new User();
  signUpUsernameFieldBorderStyle: string | undefined;
  usernameErrorMessage: string | undefined;
  valid = true;
  signupError = false;
  signupErrorMessage = 'مشکل در ارتباط با سرور';
  phoneNumberPattern = /^(09\d{9}$)/;

  constructor(private service: AppService, private router: Router, private ngxService: NgxUiLoaderService) {
    ngxService.stop();
    if (history.state.user !== undefined) {
      this.user = history.state.user;
    }
  }

  ngOnInit(): void {
    this.service.isLoggedIn().pipe(take(1)).subscribe(value => {
      if (value) {
        this.router.navigate(['/']).then(r => r);
      }
    });
  }

  signup(): void {
    const signupButton = $('#btn-signup');
    signupButton.html('<div class="spinner-border text-dark" role="status">\n' +
      '  <span class="visually-hidden">Loading...</span>\n' +
      '</div>');
    if (!this.validateSignUp()) {
      signupButton.html('مرحله بعد');
      return;
    }
    this.validateUserExistence();
  }

  validateSignUp(): boolean {
    if (this.user?.username === '' || this.user?.username === undefined) {
      this.signUpUsernameFieldBorderStyle = 'border-color: red';
      return false;
    } else {
      this.signUpUsernameFieldBorderStyle = '';
    }
    if (!this.phoneNumberPattern.test(this.user.username)) {
      this.signUpUsernameFieldBorderStyle = 'border-color: red';
      this.usernameErrorMessage = 'فرمت شماره تلفن 09123456789';
      return false;
    } else {
      this.signUpUsernameFieldBorderStyle = '';
      this.usernameErrorMessage = '';
    }
    return true;
  }

  validateUserExistence(): void {
    this.service.getResourceAsync('/api/v1/users/test/' + this.user?.username, false)
      .subscribe(response => this.handleUserInQuery(response), error => this.handleInQueryError(error));
  }

  handleUserInQuery(response: any): void {
    this.signupError = false;
    if (response.body === true) {
      this.usernameErrorMessage = 'شماره تلفن تکراری است';
      this.signUpUsernameFieldBorderStyle = 'border-color: red';
      $('#btn-signup').html('مرحله بعد');
    } else {
      this.usernameErrorMessage = '';
      this.signUpUsernameFieldBorderStyle = '';
      this.router.navigate(['/regname'], {state: {user: this.user}}).then(() => $('#btn-signup').html('مرحله بعد'));
    }
  }

  handleInQueryError(error: any): void {
    if (error.status === 401) {
      this.signupError = true;
      $('#btn-signup').html('مرحله بعد');
    }
  }

  login(): void {
    this.router.navigate(['/login']).then(r => r);
  }
}
