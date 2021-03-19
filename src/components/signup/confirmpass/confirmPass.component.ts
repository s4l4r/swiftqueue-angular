import {Component} from '@angular/core';
import {User} from '../../../dtos/user/user';
import {AppService} from '../../../app/app.service';
import {Router} from '@angular/router';
import {NgxUiLoaderService} from 'ngx-ui-loader';
import {HttpParams} from '@angular/common/http';

@Component({
  selector: 'app-confirmpassword',
  templateUrl: './confirmPass.component.html',
  styleUrls: ['./confirmPass.component.css']
})
export class ConfirmPassComponent {
  user: User | undefined;
  showError = false;
  showSuccess = false;
  confirmPassword = '';
  passwordBorderStyle: string | undefined;
  passwordErrorMessage: string | undefined;
  errorMessage = 'خطا در ثبت نام. لطفا دوباره سعی کنید';
  successMessage = 'ثبت نام با موفقیت انجام شد. در حال انتقال به صفحه ورود...';

  constructor(private service: AppService, private router: Router, private ngxService: NgxUiLoaderService) {
    ngxService.stop();
    if (history.state.user === undefined) {
      this.router.navigate(['/signup']).then(r => r);
    }
    this.user = history.state.user;
  }

  previousStep(): void {
    const previousButton = $('#previousStep');
    previousButton.html('<div class="spinner-border text-dark" role="status">\n' +
      '  <span class="visually-hidden">Loading...</span>\n' +
      '</div>');
    this.router.navigate(['/addpass'], {state: {user: this.user}}).then(() => previousButton.html('مرحبه قبل'));
  }

  createUser(): void {
    const confirmButton = $('#btn-confirmpass');
    confirmButton.html('<div class="spinner-border text-dark" role="status">\n' +
      '  <span class="visually-hidden">Loading...</span>\n' +
      '</div>');
    if (this.user?.password !== this.confirmPassword) {
      this.passwordBorderStyle = 'border-color: red';
      this.passwordErrorMessage = 'رمز عبور یکسان نمی باشد';
      confirmButton.html('ثبت اطلاعات');
      return;
    } else {
      this.passwordErrorMessage = '';
      this.passwordBorderStyle = '';
    }
    this.service.postResource('/api/v1/users', this.user, false)
      .subscribe(response => this.handleUserCreated(response), () => {
        this.showError = true;
        confirmButton.html('ثبت اطلاعات');
      });
  }

  handleUserCreated(response: any): void {
    this.showSuccess = false;
    this.showError = false;
    if (response.status === 201) {
      this.showSuccess = true;
      this.ngxService.start();
      setTimeout(() => {
        this.ngxService.stop();
        const resourceLocation = response.headers.get('Location') as string;
        const pathSegments = resourceLocation.split('/');
        const userId = pathSegments[pathSegments.length - 1];
        const params = new HttpParams();
        params.append('userId', userId);
        this.service.postResourceWithParams('/api/v1/users/start-verify', null, params, true)
          .subscribe(verificationResponse => {
            this.router.navigate(['/verify-user'], {state: {verificationCode: verificationResponse.body}})
              .then(() => $('#btn-confirmpass').html('ثبت اطلاعات'));
          });
      }, 2000);
    } else {
      $('#btn-confirmpass').html('ثبت اطلاعات');
      this.showError = true;
    }
  }
}
