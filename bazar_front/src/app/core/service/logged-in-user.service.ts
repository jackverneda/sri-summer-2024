import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
// import { IUser } from '../../classes/user.class';
import { Subject } from 'rxjs';
import { environment } from '../../../environment/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class LoggedInUserService {
  $loggedInUserUpdated = new Subject<any>();
  $languageChanged = new Subject<any>();
  loggedInUser: any;
  listNavItems: any[] = [];
  userUrl = environment.apiUrl + 'user/';

  constructor(
    private route: Router,
    private httpClient: HttpClient,
  ) {
    const data = localStorage.getItem('user');
    if (data) {
      this.loggedInUser = JSON.parse(data);
    }
  }

  public setNewProfile(profile: any) {
    let dataValue = JSON.parse(localStorage.getItem('user') || '');
    dataValue.profile = Object.assign(dataValue.profile, profile);
    localStorage.setItem('user', JSON.stringify(dataValue));
    this.loggedInUser = dataValue;
    this.$loggedInUserUpdated.next(this.loggedInUser);
  }

  public getLanguage() {
    return JSON.parse(localStorage.getItem('language') || '');
  }

  public getLoggedInUser(): any {
    let localUser = localStorage.getItem('user');
    let data = localUser ? JSON.parse(localUser) : null;
    return data;
  }

  fetchLoggedInUser() {
    this.httpClient.get(this.userUrl + this.loggedInUser.id).subscribe(
      (result: any) => {
        localStorage.removeItem('user');
        this.updateUserProfile(result);
      },
      () => {},
    );

    return false;
  }

  public getTokenOfUser(): any {
    let localUser = localStorage.getItem('user');
    let data = localUser ? JSON.parse(localUser) : null;
    data = data ? data.token : null;
    return data;
  }

  public setLoggedInUser(user: any) {
    this.loggedInUser = user;
  }

  public updateUserProfile(user: any) {
    let dataString: string;
    let localUser = localStorage.getItem('user');
    this.loggedInUser = localUser ? JSON.parse(localUser) : null;
    const tempdata = this.loggedInUser ? this.loggedInUser : {};
    if (user) {
      this.loggedInUser = Object.assign(tempdata, user);
    } else {
      this.loggedInUser = null;
    }
    dataString = JSON.stringify(this.loggedInUser);
    localStorage.setItem('user', dataString);
    this.$loggedInUserUpdated.next(this.loggedInUser);
  }

  public isAdminUser() {
    const user = this.getLoggedInUser();
    if (!user) {
      return false;
    }
    return user.role.name == 'ADMIN' || user.role.name == 'SUPERADMIN';
  }
  public isSuperAdminUser() {
    const user = this.getLoggedInUser();
    if (!user) {
      return false;
    }
    return user.role.name == 'SUPERADMIN';
  }

  public isClientUser() {
    const user = this.getLoggedInUser();
    if (!user) {
      return false;
    }
    return user.role.name == 'USER';
  }

  public isModerator() {
    const user = this.getLoggedInUser();
    if (!user) {
      return false;
    }
    return user.role == 'MOD';
  }

  public logout() {
    localStorage.removeItem('user');
    this.loggedInUser = null;
    this.$loggedInUserUpdated.next(null);
    this.route.navigate(['/']);
  }
}
