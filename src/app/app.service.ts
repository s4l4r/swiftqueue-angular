import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Cookie} from 'ng2-cookies';
import {NgxUiLoaderService} from 'ngx-ui-loader';
import {EncryptionService} from '../util/EncryptionService';

@Injectable()
export class AppService {
  SERVER_BASE_URL = 'http://core.swiftqueue.net';
  USER_SIGNUP_TOKEN = 'TjWnZr4u7x!A%D*G-KaNdRgUkXp2s5v8y/B?E(H+MbQeShVmYq3t6w9z$C&F)J@N';
  SWIFT_QUEUE_AUTHORIZATION_HEADER_NAME = 'SWIFT_QUEUE_AUTHORIZATION';
  constructor(private router: Router, private http: HttpClient, private ngxService: NgxUiLoaderService,
              private encryptionService: EncryptionService) {
  }

  obtainAccessToken(loginData: any): Observable<any>{
    const params = new URLSearchParams();
    params.append('username', loginData.username);
    params.append('password', loginData.password);
    params.append('grant_type', 'password');

    let headers = new HttpHeaders({
      'Content-type': 'application/x-www-form-urlencoded; charset=utf-8',
      Authorization: 'Basic ' + btoa('swiftqueue-angular:=Q9=T5@C*(eCk"mL')
    });
    headers = headers.append(this.SWIFT_QUEUE_AUTHORIZATION_HEADER_NAME, this.encryptionService.encrypt(this.USER_SIGNUP_TOKEN));
    return this.http.post(this.SERVER_BASE_URL + '/oauth/token', params.toString(), {headers});
  }

  getResourceAsync(resourceUrl: string, authorized: boolean): Observable<any> {
    let headers = new HttpHeaders();
    if (authorized) {
      headers = headers.append('Authorization', 'Bearer ' + this.encryptionService.decrypt(Cookie.get('access_token')));
    }
    headers = headers.append(this.SWIFT_QUEUE_AUTHORIZATION_HEADER_NAME, this.encryptionService.encrypt(this.USER_SIGNUP_TOKEN));
    return this.http.get(this.SERVER_BASE_URL + resourceUrl, {headers, observe: 'response'});
  }

  getResourceAsString(resourceUrl: string, authorized: boolean): Promise<any> {
    let headers = new HttpHeaders();
    if (authorized) {
      headers = headers.append('Authorization', 'Bearer ' + this.encryptionService.decrypt(Cookie.get('access_token')));
    }
    headers = headers.append(this.SWIFT_QUEUE_AUTHORIZATION_HEADER_NAME, this.encryptionService.encrypt(this.USER_SIGNUP_TOKEN));
    return this.http.get(this.SERVER_BASE_URL + resourceUrl, {headers, responseType: 'text'}).toPromise();
  }

  postResource(resourceUrl: string, resource: any, authorized: boolean): Observable<any> {
    let headers = new HttpHeaders({
      'Content-type': 'application/json; charset=utf-8'
    });
    if (authorized) {
      headers = headers.append('Authorization', 'Bearer ' + this.encryptionService.decrypt(Cookie.get('access_token')));
    }
    headers = headers.append(this.SWIFT_QUEUE_AUTHORIZATION_HEADER_NAME, this.encryptionService.encrypt(this.USER_SIGNUP_TOKEN));
    return this.http.post(this.SERVER_BASE_URL + resourceUrl, resource, {headers, observe: 'response'});
  }

  putResource(resourceUrl: string, resource: any): Observable<any> {
    let headers = new HttpHeaders({
      'Content-type': 'application/json; charset=utf-8',
      Authorization: 'Bearer ' + this.encryptionService.decrypt(Cookie.get('access_token'))
    });
    headers = headers.append(this.SWIFT_QUEUE_AUTHORIZATION_HEADER_NAME, this.encryptionService.encrypt(this.USER_SIGNUP_TOKEN));
    return this.http.put(this.SERVER_BASE_URL + resourceUrl, resource, {headers, observe: 'response'});
  }

  deleteResource(resourceUrl: string): Observable<any> {
    let headers = new HttpHeaders({
      'Content-type': 'application/json; charset=utf-8',
      Authorization: 'Bearer ' + this.encryptionService.decrypt(Cookie.get('access_token'))
    });
    headers = headers.append(this.SWIFT_QUEUE_AUTHORIZATION_HEADER_NAME, this.encryptionService.encrypt(this.USER_SIGNUP_TOKEN));
    return this.http.delete(this.SERVER_BASE_URL + resourceUrl, {headers, observe: 'response'});
  }

  getCurrentLoggedInUser(): Observable<any> {
    const username = Cookie.get('username');
    return this.getResourceAsync('/api/v1/users/' + username, true);
  }

  /* For Protected Pages */
  checkCredentials(): void {
    if (!Cookie.check('access_token')){
      this.router.navigate(['/login']).then(r => r);
    }
  }

  isLoggedIn(): Observable<boolean> {
    return new Observable(observer => {
      setInterval(() => {
        observer.next(Cookie.check('access_token'));
      }, 100);
    });
  }

  logout(): void {
    this.ngxService.start();
    Cookie.delete('access_token');
    Cookie.delete('firstName');
    Cookie.delete('user_id');
    Cookie.delete('username');
    this.ngxService.stop();
    this.router.navigate(['/login']).then(r => r);
  }
}
