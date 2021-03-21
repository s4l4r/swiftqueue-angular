import {Component} from '@angular/core';
import {User} from '../../../dtos/user/user';
import {AppService} from '../../../app/app.service';
import {Router} from '@angular/router';
import {NgxUiLoaderService} from 'ngx-ui-loader';
import {HttpParams} from '@angular/common/http';

@Component({
  selector: 'app-addpassword',
  templateUrl: './addPass.component.html',
  styleUrls: ['./addPass.component.css']
})
export class AddPassComponent {
  user: User;
  passwordBorderStyle: string | undefined;
  passwordErrorMessage: string | undefined;
  confirmPassBorderStyle: string | undefined;
  confirmPassErrorMessage: string | undefined;
  confirmPassword = '';
  regexp: RegExp = /^(?=.*[A-Za-z])(?=.*\d)[-A-Za-z\d]{8,}$/g;
  showError = false;

  constructor(private service: AppService, private router: Router, private ngxService: NgxUiLoaderService) {
    ngxService.stop();
    if (history.state.user === undefined) {
      this.router.navigate(['/signup']).then(r => r);
    }
    this.user = history.state.user;
  }

  createUser(): void {
    const confirmButton = $('#createUser');
    confirmButton.html('<div class="spinner-border text-dark" role="status">\n' +
      '  <span class="visually-hidden">Loading...</span>\n' +
      '</div>');

    // Validarions should be in an order here

    if (!this.regexp.test(this.user.password)) {
      this.passwordBorderStyle = 'border-color: red';
      this.passwordErrorMessage = 'رمز عبور باید حداقل ۸ کاراکتر و شامل یک حرف و یک عدد باشد';
      confirmButton.html('ثبت اطلاعات');
      return;
    } else {
      this.passwordBorderStyle = '';
      this.passwordErrorMessage = '';
    }


    if (this.user?.password !== this.confirmPassword) {
      this.confirmPassBorderStyle = 'border-color: red';
      this.confirmPassErrorMessage = 'رمز عبور یکسان نمی باشد';
      confirmButton.html('ثبت اطلاعات');
      return;
    } else {
      this.confirmPassErrorMessage = '';
      this.confirmPassBorderStyle = '';
    }
    this.service.postResource('/api/v1/users', this.user, false)
      .subscribe(response => this.handleUserCreated(response), () => {
        this.showError = true;
        confirmButton.html('ثبت اطلاعات');
      });
  }

  handleUserCreated(response: any): void {
    this.showError = false;
    if (response.status === 201) {
      setTimeout(() => {
        let params = new HttpParams();
        params = params.append('username', this.user.username);
        this.service.postResourceWithParams('/api/v1/otp/send-sms', null, params, false)
          .subscribe(() => {
            this.router.navigate(['/verify-user'], {state: {username: this.user.username}})
              .then(() => $('#').html('ثبت اطلاعات'));
          });
      }, 2000);
    } else {
      $('#btn-confirmpass').html('ثبت اطلاعات');
      this.showError = true;
    }
  }

  previousStep(): void {
    const previousButton = $('#previousStep');
    previousButton.html('<div class="spinner-border text-dark" role="status">\n' +
      '  <span class="visually-hidden">Loading...</span>\n' +
      '</div>');
    this.router.navigate(['/regname'], {state: {user: this.user}}).then(() => previousButton.html('مرحله قبل'));
  }
}
