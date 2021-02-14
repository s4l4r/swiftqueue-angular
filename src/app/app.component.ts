import {AfterViewInit, Component, OnInit} from '@angular/core';
import {NgxUiLoaderService} from 'ngx-ui-loader';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit{
  title = 'swiftqueue-angular';

  constructor(private ngxService: NgxUiLoaderService) {
  }

  ngOnInit(): void {
    this.ngxService.start();
  }

  ngAfterViewInit(): void {
    this.ngxService.stop();
  }
}
