import {Component} from '@angular/core';
import {User} from '../../dtos/user/user';
import {AppService} from '../../app/app.service';
import {Cookie} from 'ng2-cookies';
import {Timeslot} from '../../dtos/schedule/timeslot';
import {NgxUiLoaderService} from 'ngx-ui-loader';


@Component({
  selector: 'app-user-profile',
  templateUrl: './userProfile.component.html',
  styleUrls: ['./userProfile.component.css']
})
export class UserProfileComponent {
  user = new User();
  timeslots: (Timeslot)[] = [];
  serverError = false;
  isLoaded = false;

  constructor(private service: AppService, private ngxService: NgxUiLoaderService) {
    if (this.ngxService.getLoader() !== null) {
      ngxService.stop();
    }
    service.checkCredentials();
    const username = Cookie.get('username');
    service.getResourceAsync('/api/v1/users/' + username,
      true).subscribe(response => {
        this.user = response.body;
        this.loadTimeSlots();
    });
  }

  loadTimeSlots(): void {
    this.service.getResourceAsString('/api/v1/timeslots/all-user/' + this.user.id,
      true).then(response => {
      this.timeslots = JSON.parse(response);
      this.isLoaded = true;
    });
  }
}
