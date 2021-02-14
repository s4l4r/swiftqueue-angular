import {Component} from '@angular/core';
import {NgxUiLoaderService} from 'ngx-ui-loader';
import {AppService} from '../../app/app.service';
import {Router} from '@angular/router';
import {take} from 'rxjs/operators';
import {Client} from '../../dtos/user/client';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  services: (Client)[] = [];

  constructor(private service: AppService, private ngxService: NgxUiLoaderService, private router: Router) {
    this.service.isLoggedIn().pipe(take(1)).subscribe(response => {
      if (response) {
        this.service.getResourceAsync('/api/v1/clients/all', true)
          .subscribe(r => this.services = r.body);
      } else {
        this.router.navigate(['/info']).then(r => r);
      }
    });
  }
}
