import {AfterViewInit, ChangeDetectorRef, Component} from '@angular/core';
import {Client} from '../../dtos/user/client';
import {AppService} from '../../app/app.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Schedule} from '../../dtos/schedule/schedule';
import {NgxUiLoaderService} from 'ngx-ui-loader';
import {take} from 'rxjs/operators';
import $ from 'jquery';
import {User} from '../../dtos/user/user';

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.css']
})
export class ClientComponent {
  client = new Client();
  user = new User();
  serverError = false;
  isLoggedIn = false;
  isLoaded = false;

  constructor(private service: AppService, private router: Router, private route: ActivatedRoute,
              private ngxService: NgxUiLoaderService) {
    if (this.ngxService.getLoader() !== null) {
      this.ngxService.stop();
    }
    this.service.isLoggedIn().pipe(take(1)).subscribe(value => this.updateLoginStatus(value));
    this.route.params.subscribe(params => {
      this.service.getResourceAsync('/api/v1/clients/' + params.id, false)
        .subscribe(response => {
          this.client = response.body;
          this.client.schedules.forEach(schedule => {
            schedule.fromDate = schedule.fromDate.split('-').join('/');
            schedule.toDate = schedule.toDate.split('-').join('/');
          });
          this.isLoaded = true;
        }, () => {
          this.serverError = true;
          this.isLoaded = true;
        });
    });
  }

  updateLoginStatus(isLoggedIn: boolean): void {
    this.isLoggedIn = isLoggedIn;
    if (this.isLoggedIn) {
      this.service.getCurrentLoggedInUser().subscribe(response => this.user = response.body);
    }
  }

  getNextTimeSlot(schedule: Schedule): void {
    const bookButton = $('#btn-book');
    bookButton.html('<div class="spinner-border text-dark" role="status">\n' +
      '  <span class="visually-hidden">Loading...</span>\n' +
      '</div>');
    if (!this.isLoggedIn) {
      this.router.navigate(['/login']).then(() => bookButton.html('رزرو نوبت'));
      return;
    }
    this.service.postResource('/api/v1/timeslots/next/' + schedule.id, undefined, true)
      .subscribe(response => {
        const nextTimeSlot = response.body;
        schedule.client = this.client;
        nextTimeSlot.schedule = schedule;
        this.router.navigate(['/booking-preview'], {state: {schedule, timeSlot: nextTimeSlot}})
          .then(() => bookButton.html('رزرو نوبت'));
      });
  }

  getAvailableTimeSlotsCount(schedule: Schedule): number {
    return schedule.timeSlots.filter(i => !i.reserved).length;
  }

  updateClientInformations(): void {
    this.router.navigate(['/edit-client'], {state: {client: this.client}}).then(r => r);
  }
}
