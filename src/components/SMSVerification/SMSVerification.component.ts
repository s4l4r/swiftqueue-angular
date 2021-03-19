import {Component} from '@angular/core';
import {User} from '../../dtos/user/user';
import {VerificationCode} from '../../dtos/auth/verificationCode';
import {AppService} from '../../app/app.service';
import {Router} from '@angular/router';
import {HttpParams} from '@angular/common/http';

@Component({
  selector: 'app-sms-verification',
  templateUrl: './SMSVerification.component.html',
  styleUrls: ['./SMSVerification.component.css']
})
export class SMSVerificationComponent {
  user: User = new User();
  verificationCode: VerificationCode = new VerificationCode();
  isLoaded = false;
  serverError = false;
  errorMessage = 'کد نامعتبر';
  invalidCode = false;
  constructor(private service: AppService, private router: Router) {
    if (history.state.user === undefined) {
      this.router.navigate(['/login']).then(r => r);
    }
    this.verificationCode = history.state.verificationCode;
    this.service.getCurrentLoggedInUser().subscribe(response => {
      this.user = response.body;
      this.isLoaded = true;
      this.verifyUserSMSCode(this.verificationCode.code, this.user.id);
    }, () => {
      this.serverError = true;
      this.isLoaded = true;
    });
  }

  verifyUserSMSCode(code: string, userId: number): void {
    const params = new HttpParams();
    params.append('userId', userId.toString());
    this.service.postResourceWithParams('/api/v1/users/verify', null, params, true)
      .subscribe(response => {
        if (response.body === true) {
          this.serverError = false;
          this.invalidCode = false;
          // UI Green checks that user sign up has activated
        } else {
          this.invalidCode = true;
          this.serverError = false;
        }
      });
  }
}
