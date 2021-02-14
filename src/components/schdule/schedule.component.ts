import {AfterViewInit, Component, EventEmitter} from '@angular/core';
import {Schedule} from '../../dtos/schedule/schedule';
import {AppService} from '../../app/app.service';
import {Client} from '../../dtos/user/client';
import {User} from '../../dtos/user/user';
import {Timeslot} from '../../dtos/schedule/timeslot';
import {take} from 'rxjs/operators';
import {ActivatedRoute, Router} from '@angular/router';
import {Cookie} from 'ng2-cookies';
import {NgxUiLoaderService} from 'ngx-ui-loader';
import * as moment from 'jalali-moment';
// @ts-ignore
import $ from 'jquery';

@Component({
  selector: 'app-schedule',
  templateUrl: 'schedule.component.html',
  styleUrls: ['./schedule.component.css']
})
export class ScheduleComponent implements AfterViewInit {
  schedule = new Schedule();
  client = new Client();
  user = new User();
  serverError = false;
  dateObject = moment('1399-04-01', 'jYYYY,jMM,jDD');
  datePickerConfig = {closeOnSelect: false, hideOnOutsideClick: false};

  constructor(private service: AppService, private router: Router, private ngxService: NgxUiLoaderService,
              private route: ActivatedRoute) {
    this.route.params.subscribe(params => {
      this.service.getResourceAsync('/api/v1/schedules/' + params.id, true)
        .subscribe(response => {
          this.schedule = response.body;
          this.schedule.fromDate = this.schedule.fromDate.split('-').join('/');
          this.schedule.toDate = this.schedule.toDate.split('-').join('/');
        }, () => this.serverError = true);
      this.service.getResourceAsync('/api/v1/clients/' + params.clientId, true)
        .subscribe(response => {
          this.client = response.body;
        });
    });
    const username = Cookie.get('username');
    this.service.getResourceAsync('/api/v1/users/' + username, true)
      .subscribe(response => this.user = response.body);
  }

  ngAfterViewInit(): void {
    $(document).ready(() => {
      $(document).find('.dp-popup').removeAttr('hidden');
      $(document).find('.dp-popup').attr('data-hidden', 'false');
      $(document).find('.dp-day-calendar-container').parent().css('display', 'block');
      $(document).find('.dp-picker-input').css('display', 'none');
      $(document).find('.dp-popup').parent().css('position', 'relative');
    });
  }

  bookTimeSlot(timeSlot: Timeslot): void {
    this.ngxService.start();
    this.service.isLoggedIn().pipe(take(1))
      .subscribe(value => {
        if (value) {
          const loggedInUserId = Cookie.get('user_id');
          timeSlot.userInfo = new User(Number(loggedInUserId));
          timeSlot.schedule = new Schedule(this.schedule.id);
          this.service.putResource('/api/v1/timeslots/mark-reserved', timeSlot)
            .subscribe(() => this.refreshTimeSlots(), () => this.serverError = true);
        } else {
          this.router.navigate(['/login']).then(() => this.ngxService.stop());
        }
      });
  }

  refreshTimeSlots(): void {
    this.serverError = false;
    this.service.getResourceAsync('/api/v1/schedules/' + this.schedule.id, true)
      .subscribe(response => {
        this.schedule = response.body;
        this.schedule.fromDate = this.schedule.fromDate.split('-').join('/');
        this.schedule.toDate = this.schedule.toDate.split('-').join('/');
        this.ngxService.stop();
      }, () => {
        this.serverError = true;
      });
    const username = Cookie.get('username');
    this.service.getResourceAsync('/api/v1/users/' + username, true)
      .subscribe(response => this.user = response.body);
    this.ngxService.stop();
  }

  cancelBooking(timeSlot: Timeslot): void {
    this.ngxService.start();
    this.service.isLoggedIn().pipe(take(1))
      .subscribe(value => {
        if (value) {
          const loggedInUserId = Cookie.get('user_id');
          timeSlot.userInfo = new User(Number(loggedInUserId));
          timeSlot.schedule = new Schedule(this.schedule.id);
          this.service.putResource('/api/v1/timeslots/mark-unreserved', timeSlot)
            .subscribe(() => this.refreshTimeSlots(), () => this.serverError = true);
        } else {
          this.router.navigate(['/login']).then(() => this.ngxService.stop());
        }
      });
  }
}
