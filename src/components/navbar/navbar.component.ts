import {Component} from '@angular/core';
import {AppService} from '../../app/app.service';
import {Cookie} from 'ng2-cookies';

@Component({
  selector: 'app-nav',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {

  firstName: string | undefined;
  isLoggedIn = false;

  constructor(private service: AppService) {
    this.service.isLoggedIn().subscribe(value => {
      this.isLoggedIn = value;
      this.firstName = Cookie.get('firstName');
    });
  }

  logout(): void {
    this.service.logout();
  }
}

