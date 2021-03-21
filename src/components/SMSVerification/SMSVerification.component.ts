import {Component} from '@angular/core';
import {AppService} from '../../app/app.service';
import {Router} from '@angular/router';
import {OtpVerifyRequest} from '../../dtos/auth/otpVerifyRequest';

@Component({
  selector: 'app-sms-verification',
  templateUrl: './SMSVerification.component.html',
  styleUrls: ['./SMSVerification.component.css']
})
export class SMSVerificationComponent {
  verifyRequest: OtpVerifyRequest = new OtpVerifyRequest();
  isLoaded = false;
  serverError = false;
  errorMessage = 'کد نامعتبر';
  invalidCode = false;
  showSuccess = false;
  successMessage = 'ثبت نام با موفقیت انجام شد. در حال انتقال به صفحه ورود...';
  constructor(private service: AppService, private router: Router) {
    if (history.state.username === undefined) {
      this.router.navigate(['/login']).then(r => r);
    }
    this.verifyRequest.userInfo.username = history.state.username;
    this.isLoaded = true;
    this.serverError = false;
  }

  verifyUserSMSCode(): void {
    const verifyButton = $('#verifySMSCode');
    verifyButton.html('<div class="spinner-border text-dark" role="status">\n' +
      '  <span class="visually-hidden">Loading...</span>\n' +
      '</div>');
    if (this.verifyRequest.code === '' || this.verifyRequest.code === undefined) {
      verifyButton.html('تایید و فعالسازی');
      return;
    }
    this.service.postResource('/api/v1/otp/verify-sms', this.verifyRequest, false)
      .subscribe(response => {
        if (response.body === true) {
          this.serverError = false;
          this.invalidCode = false;
          this.showSuccess = true;
          this.router.navigate(['/login'], {state: {signupSuccess: true}}).then(() => verifyButton.html('تایید و فعالسازی'));
        } else {
          this.invalidCode = true;
          this.serverError = false;
          this.showSuccess = false;
          verifyButton.html('تایید و فعالسازی');
        }
      }, () => {

        verifyButton.html('تایید و فعالسازی');
      });
  }
}
