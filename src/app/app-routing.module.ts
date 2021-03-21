import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {LoginComponent} from '../components/login/login.component';
import {RegNameComponent} from '../components/signup/regname/regName.component';
import {AddPassComponent} from '../components/signup/addpass/addPass.component';
import {HomeComponent} from '../components/home/home.component';
import {SignupComponent} from '../components/signup/signup/signup.component';
import {UserProfileComponent} from '../components/userProfile/userProfile.component';
import {EditUserProfileComponent} from '../components/editUserProfile/editUserProfile.component';
import {InfoComponent} from '../components/info/info.component';
import {ClientComponent} from '../components/client/client.component';
import {ScheduleComponent} from '../components/schdule/schedule.component';
import {BookPreviewComponent} from '../components/bookpreview/bookPreview.component';
import {RegisterClientComponent} from '../components/registerClient/registerClient.component';
import {SMSVerificationComponent} from '../components/SMSVerification/SMSVerification.component';

const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'regname', component: RegNameComponent },
  { path: 'addpass', component: AddPassComponent },
  { path: 'user-profile', component: UserProfileComponent},
  { path: 'edit-user-profile', component: EditUserProfileComponent },
  { path: 'info', component: InfoComponent },
  { path: 'client/:id', component: ClientComponent },
  { path: 'schedule/:clientId/:id', component: ScheduleComponent },
  { path: 'booking-preview', component: BookPreviewComponent },
  { path: 'register-client', component: RegisterClientComponent },
  { path: 'verify-user', component: SMSVerificationComponent }
  ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
