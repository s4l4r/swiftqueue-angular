import {Component} from '@angular/core';
import {NgxUiLoaderService} from 'ngx-ui-loader';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {

  constructor(private ngxService: NgxUiLoaderService) {
    ngxService.stop();
  }
}
