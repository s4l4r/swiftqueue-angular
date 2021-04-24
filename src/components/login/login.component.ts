import {Component, OnInit} from '@angular/core';
import {AppService} from '../../app/app.service';
import {User} from '../../dtos/user/user';
import {Router} from '@angular/router';
import {take} from 'rxjs/operators';
import {Cookie} from 'ng2-cookies';
import {NgxUiLoaderService} from 'ngx-ui-loader';
import {EncryptionService} from '../../util/EncryptionService';
import {HttpParams} from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{
  user: User = new User();
  userNameFieldBorderStyle = '';
  passwordFieldBorderStyle = '';
  loginError = false;
  showSignupMessage = false;
  loginErrorMessage = '';
  hint = false;
  hintMessage = '';

  constructor(private service: AppService, private router: Router, private ngxService: NgxUiLoaderService,
              private encryptionService: EncryptionService) {
    if (this.ngxService.getLoader() !== null) {
      ngxService.stop();
    }
    if (history.state.signupSuccess) {
      this.showSignupMessage = true;
    }
  }

  ngOnInit(): void {
    this.service.isLoggedIn().pipe(take(1)).subscribe(value => {
      if (value) {
        this.router.navigate(['/']).then(r => r);
      }
    });
  }

  login(): void {
    const loginButton = $('#btn-login');
    loginButton.html('<div class="spinner-border text-dark" role="status">\n' +
      '  <span class="visually-hidden">Loading...</span>\n' +
      '</div>');
    if (!this.validateLogin()) {
      loginButton.html('ورود');
      return;
    }
    this.getAccessToken();
  }

  getAccessToken(): void {
    this.service.obtainAccessToken({username: this.user.username, password: this.user.password})
      .subscribe(data => {
        this.service.getResourceAsync('/api/v1/users/enabled/' + this.user.username, false)
          .subscribe(response => {
            if (response.body === false) {
              this.loginError = false;
              this.hintAccountDisabled();
              $('#btn-login').html('ورود');
            } else {
              this.saveToken(data, this.user.username);
            }
          });
      }, error => {
        $('#btn-login').html('ورود');
        this.handleLoginError(error);
      });
  }

  validateLogin(): boolean {
    if (this.user.username === '' || this.user.username === undefined) {
      this.userNameFieldBorderStyle = '1px solid red';
      return false;
    } else {
      this.userNameFieldBorderStyle = '';
    }
    if (this.user.password === '' || this.user.password === undefined) {
      this.passwordFieldBorderStyle = '1px solid red';
      return false;
    } else {
      this.passwordFieldBorderStyle = '';
    }
    return true;
  }

  signup(): void {
    this.router.navigate(['/signup']).then(r => r);
  }

  saveToken(token: any, username: string): void {
    this.loginError = false;
    // 30 Minute Session
    const expireDate = new Date();
    expireDate.setMinutes(expireDate.getMinutes() + + 30);
    Cookie.set('access_token', this.encryptionService.encrypt(token.access_token), expireDate);
    this.service.getResourceAsync('/api/v1/users/' + username, true)
      .subscribe(response => {
        Cookie.set('firstName', response.body.firstName, expireDate);
        Cookie.set('username', response.body.username, expireDate);
        Cookie.set('user_id', response.body.id, expireDate);
        Cookie.set('session_active', 'J58ED6JRY79087G4H7', );
        $('#btn-login').html('ورود');
      });
    this.router.navigate(['/']).then(() => $('#btn-login').html('ورود'));
  }

  handleLoginError(error: any): void {
    this.loginError = true;
    switch (error.status) {
      case 400:
      case 401:
        this.loginErrorMessage = 'نام کاربری و یا رمز عبور اشتباه است';
        break;
      case 500:
        this.loginErrorMessage = 'سرور قادر به پاسخگویی نیست. لطفا دوباره امتحان کنید';
        break;
    }
    $('#btn-login').html('ورود');
  }

  hintAccountDisabled(): void {
    this.hint = true;
    this.hintMessage = 'فعالسازی کاربری غیرفعال است.';
  }

  verifyUser(): void {
    const verifyButton = $('#verifySMSCode');
    verifyButton.html('<div class="spinner-border text-dark" role="status">\n' +
      '  <span class="visually-hidden">Loading...</span>\n' +
      '</div>');
    const params = new HttpParams()
      .set('username', this.user.username);
    this.service.postResourceWithParams('/api/v1/otp/send-sms', null, params, false)
      .subscribe(() => {
        this.router.navigate(['/verify-user'], {state: {username: this.user.username}})
          .then(() => verifyButton.html('فعالسازی حساب کاربری'));
      }, () => {
        location.reload();
      });
  }
}
