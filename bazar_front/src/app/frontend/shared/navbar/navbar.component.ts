import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, EventEmitter, Inject, Input, OnChanges, OnInit, Output, PLATFORM_ID, SimpleChanges } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { Router, RouterModule } from '@angular/router';
import { LoggedInUserService } from '../../../core/service/logged-in-user.service';

@Component({
  standalone: true,
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  imports: [CommonModule, RouterModule, MatToolbarModule, MatIconModule, MatButtonModule, MatMenuModule, MatSidenavModule],
})
export class NavbarComponent implements OnInit, OnChanges {
  user: any;
  directory: any[];
  @Input() pages: any[] = [];
  @Output() toogleDrawer = new EventEmitter();

  constructor(
    @Inject(PLATFORM_ID) private _platformId: any,
    private loggedInUserService: LoggedInUserService,
    private router: Router,
  ) {
    this.user = this.loggedInUserService.getLoggedInUser();
    this.directory = this.pages;
    console.log(this.user);
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes['pages'] && changes['pages'].currentValue) {
      this.directory = changes['pages'].currentValue;
    }
  }

  ngOnInit() {
    if (isPlatformBrowser(this._platformId)) window.addEventListener('scroll', this.topOfPage);
    this.loggedInUserService.$loggedInUserUpdated.subscribe(() => {
      this.user = this.loggedInUserService.getLoggedInUser();
      this.directory = this.pages;
    });
  }

  topOfPage(): boolean {
    if (isPlatformBrowser(this._platformId)) return window.pageYOffset < 20;
    return false;
  }

  goToSearch() {
    this.router.navigateByUrl('/frontend/search');
  }
  goToRegister() {
    this.router.navigateByUrl('/auth/login');
  }

  toggleDrawer() {
    this.toogleDrawer.emit(null);
  }

  logout() {
    this.loggedInUserService.logout();
  }
}
