import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { SwiperOptions } from 'swiper/types/swiper-options';
import { register } from 'swiper/element/bundle';
import { MatButtonModule } from '@angular/material/button';
import { MovieService } from '../../core/services/movie.service';
import { Router } from '@angular/router';
import { Product } from '../../../core/classes/product.class';
@Component({
  selector: 'app-carrousel',
  standalone: true,
  templateUrl: './carrousel.component.html',
  styleUrl: 'carrousel.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [MatButtonModule],
})
export class CarrouselComponent {
  public data!: Product[];

  constructor(
    private movieService: MovieService,
    private router: Router,
  ) {
    register();
    this.movieService.getSuggestions().subscribe((data: any) => {
      this.data = data;
    });
  }
  onNavigateMovie(data: Product) {
    this.router.navigate(['frontend/movies/', data.parent_asin]);
  }
}
