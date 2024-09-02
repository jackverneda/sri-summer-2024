import { Component } from '@angular/core';
import { LoggedInUserService } from '../../core/service/logged-in-user.service';
import { StyleService } from '../../core/service/style.service';

@Component({
  selector: 'app-layout',
  templateUrl: 'layout.component.html',
  styleUrl: 'layout.component.scss',
})
export class LayoutComponent {
  pages: any[] = [];
  bgImageUrl: string = '../../../assets/images/auth/authbackground.jpg';

  constructor(
    private loggedInService: LoggedInUserService,
    private styleService: StyleService,
  ) {
    this.setPages();
    loggedInService.$loggedInUserUpdated.subscribe(() => {
      this.setPages();
    });

    this.styleService.$styleChanged.subscribe((url: string) => {
      this.bgImageUrl = this.styleService.bgImg;
    });
  }

  setPages() {
    this.pages = [
      {
        name: 'Inicio',
        permissions: true,
        link: '/frontend/home',
      },
      // {
      //   name: 'Administración',
      //   link: '/backend',
      //   permissions: this.loggedInService.isAdminUser(),
      // },
      // {
      //   name: 'Eventos',
      //   link: '/frontend/news',
      // },
    ];
  }
}
