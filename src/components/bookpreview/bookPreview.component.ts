import {Component} from '@angular/core';
import {Timeslot} from '../../dtos/schedule/timeslot';
import {Schedule} from '../../dtos/schedule/schedule';
import {Router} from '@angular/router';
import {AppService} from '../../app/app.service';
import {NgxUiLoaderService} from 'ngx-ui-loader';
import {Client} from '../../dtos/user/client';

@Component({
  selector: 'app-book-preview',
  templateUrl: './bookPreview.component.html',
  styleUrls: ['./bookPreview.component.scss']
})
export class BookPreviewComponent {
  timeSlot = new Timeslot();
  schedule = new Schedule();
  client = new Client();
  isBooked = false;
  serverError = false;
  isLoaded = false;

  constructor(private router: Router, private service: AppService, private ngxService: NgxUiLoaderService) {
    if (this.ngxService.getLoader() !== null) {
      this.ngxService.stop();
    }
    if (history.state.timeSlot === undefined || history.state.schedule === undefined) {
      this.router.navigate(['/home']).then(r => r);
    } else {
      this.timeSlot = history.state.timeSlot;
      this.schedule = history.state.schedule;
      this.client = this.schedule.client;
      // To prevent JSON circular mapping
      this.schedule.client = new Client();
      this.isLoaded = true;
    }
  }

  bookTimeSlot(timeslot: Timeslot): void {
    const bookButton = $('#btn-book');
    bookButton.html('<div class="spinner-border text-dark" role="status">\n' +
      '  <span class="visually-hidden">Loading...</span>\n' +
      '</div>');
    this.service.getCurrentLoggedInUser().subscribe(response => {
      timeslot.userInfo = response.body;
      timeslot.schedule.client = new Client();
      this.service.postResource('/api/v1/timeslots', timeslot, true)
        .subscribe(bookingResponse => this.handleBookingResponse(bookingResponse));
    });
  }

  handleBookingResponse(response: any): void {
    if (response.status === 201) {
      this.service.getResourceAsync(response.headers.get('Location'), true).subscribe(getResponse => {
        $('#btn-book').html('رزرو نوبت');
        this.timeSlot = getResponse.body;
        this.timeSlot.schedule = this.schedule;
        this.serverError = false;
        this.isBooked = true;
      });
    } else {
      this.isBooked = false;
      this.serverError = true;
      $('#btn-book').html('رزرو نوبت');
    }
  }

  handleCancelResponse(response: any): void {
    $('#btn-book').html('رزرو نوبت');
    if (response.status === 200) {
      this.isBooked = false;
      this.serverError = false;
    } else {
      this.isBooked = true;
      this.serverError = true;
    }
  }

  myBookings(): void {
    this.ngxService.start();
    this.router.navigate(['/user-profile']).then(() => this.ngxService.stop());
  }
}
