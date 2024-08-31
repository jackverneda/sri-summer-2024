import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { SwiperOptions } from 'swiper/types/swiper-options';
import { register } from 'swiper/element/bundle';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MovieService } from '../../core/services/movie.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-carrousel-right',
  standalone: true,
  templateUrl: './carrousel-right.component.html',
  styleUrl: 'carrousel-right.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [MatButtonModule, MatIconModule],
})
export class CarrouselRightComponent {
  public dataImages!: any[];

  constructor(
    private movieService: MovieService,
    private router: Router,
  ) {
    register();
    this.movieService.getAll().subscribe((data: any) => {
      let i = 0;
      this.dataImages = data.filter((movie: any) => {
        i++;
        return i % 3 == 0;
      });
    });
  }
  onNavigate(id: string) {
    console.log(id);
    this.router.navigate([`frontend/movies/${id}`]);
  }
}
