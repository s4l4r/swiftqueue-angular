import {Component} from '@angular/core';
import {User} from '../../dtos/user/user';
import {AppService} from '../../app/app.service';
import {Cookie} from 'ng2-cookies';
import {NgxUiLoaderService} from 'ngx-ui-loader';
import {Router} from '@angular/router';

@Component({
  selector: 'app-edit-user-profile',
  templateUrl: './editUserProfile.component.html',
  styleUrls: ['./editUserProfile.component.css']
})
export class EditUserProfileComponent {
  user = new User();
  newUser = new User();
  serverError = false;
  isLoaded = false;

  constructor(private service: AppService, private ngxService: NgxUiLoaderService, private router: Router) {
    if (this.ngxService.getLoader() !== null) {
      ngxService.stop();
    }
    service.checkCredentials();
    const username = Cookie.get('username');
    service.getResourceAsync('/api/v1/users/' + username,
      true).subscribe(response => {
        this.user = response.body;
        this.isLoaded = true;
    });
  }

  updateUserInfo(): void {
    $('#updateInfo').html('<div class="spinner-border text-dark" role="status">\n' +
      '  <span class="visually-hidden">Loading...</span>\n' +
      '</div>');
    this.newUser.id = this.user.id;
    this.service.putResource('/api/v1/users', this.newUser)
      .subscribe(response => this.handleResponse(response));
  }

  handleResponse(updateResponse: any): void {
    $('#firstName, #lastName').val('');
    if (updateResponse.status === 204) {
      this.serverError = false;
      this.service.getResourceAsync('/api/v1/users/' + this.user.username, true)
        .subscribe(response => {
          this.user = response.body;
          $('#updateInfo').html('ذخیره تغییرات');
        });
    } else {
      this.serverError = true;
      $('#updateInfo').html('ذخیره تغییرات');
    }
  }
}
