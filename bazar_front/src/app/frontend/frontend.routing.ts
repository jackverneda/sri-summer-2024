import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { HomeResolver } from './core/resolver/home.resolver';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'home',
        resolve: {
          movies: HomeResolver,
        },
        loadChildren: () => import('./home/home.module').then((m) => m.HomeModule),
      },
      {
        path: 'movies/:id',
        loadChildren: () => import('./movie/movie.module').then((m) => m.MovieModule),
      },
      {
        path: 'search',
        loadChildren: () => import('./search/search.module').then((m) => m.SearchModule),
      },
      {
        path: 'profile',
        loadChildren: () => import('./user/user.module').then((m) => m.UserModule),
      },
      { path: '**', redirectTo: '/frontend/home' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FrontendRoutingModule {}
