import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { register } from 'swiper/element/bundle';
import { MatButtonModule } from '@angular/material/button';
import { MovieService } from '../../core/services/movie.service';
import { Product } from '../../../core/classes/product.class';

@Component({
  selector: 'app-carrusel-clasicos',
  standalone: true,
  templateUrl: './carrousel-clasicos.component.html',
  styleUrl: 'carrousel-clasicos.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [MatButtonModule],
})
export class CarrouselClasicos {
  public dataImagesU!: any[];
  public dataImagesD!: any[];

  constructor(private movieService: MovieService) {
    register();
    this.movieService.getAll().subscribe((data: any) => {
      this.dataImagesD = data.slice(30,45)
      this.dataImagesU = data.slice(15,30)
    });
  }
}
