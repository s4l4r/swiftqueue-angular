import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {FormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {OAuthModule} from 'angular-oauth2-oidc';
import {HomeComponent} from '../components/home/home.component';
import {AppService} from './app.service';
import {LoginComponent} from '../components/login/login.component';
import {NavbarComponent} from '../components/navbar/navbar.component';
import {RegNameComponent} from '../components/signup/regname/regName.component';
import {AddPassComponent} from '../components/signup/addpass/addPass.component';
import {SignupComponent} from '../components/signup/signup/signup.component';
import {ConfirmPassComponent} from '../components/signup/confirmpass/confirmPass.component';
import {NgxUiLoaderModule} from 'ngx-ui-loader';
import {NumberConverter} from '../util/NumberConverter';
import {EncryptionService} from '../util/EncryptionService';
import {UserProfileComponent} from '../components/userProfile/userProfile.component';
import {EditUserProfileComponent} from '../components/editUserProfile/editUserProfile.component';
import {FooterComponent} from '../components/footer/footer.component';
import {CommonModule} from '@angular/common';
import {InfoComponent} from '../components/info/info.component';
import {NgSelectModule} from '@ng-select/ng-select';
import {AutoSuggestComponent} from '../components/autosuggest/autoSuggest.component';
import {ClientComponent} from '../components/client/client.component';
import {ScheduleComponent} from '../components/schdule/schedule.component';
import {DpDatePickerModule} from 'ng2-jalali-date-picker';
import {PersianDatePickerComponent} from '../components/datepicker/persianDatePicker.component';
import {BookPreviewComponent} from '../components/bookpreview/bookPreview.component';
import {RegisterClientComponent} from '../components/registerClient/registerClient.component';
import {EditClientComponent} from '../components/editClient/editClient.component';
import {NgSelect2Module} from 'ng-select2';

@NgModule({
  declarations: [
    AppComponent, HomeComponent, LoginComponent, NavbarComponent, RegNameComponent, AddPassComponent,
    SignupComponent, ConfirmPassComponent, UserProfileComponent, EditUserProfileComponent, FooterComponent,
    InfoComponent, AutoSuggestComponent, ClientComponent, ScheduleComponent, PersianDatePickerComponent, BookPreviewComponent,
    RegisterClientComponent, EditClientComponent
  ],
  imports: [
    BrowserModule, AppRoutingModule, FormsModule, HttpClientModule, OAuthModule.forRoot(), NgxUiLoaderModule,
    CommonModule, NgSelectModule, DpDatePickerModule, NgSelect2Module
  ],
  providers: [AppService, NumberConverter, EncryptionService],
  bootstrap: [AppComponent]
})
export class AppModule { }
