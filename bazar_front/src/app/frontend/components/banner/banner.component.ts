import { Component, CUSTOM_ELEMENTS_SCHEMA, Input, OnChanges, SimpleChanges } from '@angular/core';
import { SwiperOptions } from 'swiper/types/swiper-options';
import { register } from 'swiper/element/bundle';
import { MatButtonModule } from '@angular/material/button';
import { MovieService } from '../../core/services/movie.service';
import { Router } from '@angular/router';
import { StyleService } from '../../../core/service/style.service';
import { Product } from '../../../core/classes/product.class';
@Component({
  selector: 'app-banner',
  standalone: true,
  templateUrl: './banner.component.html',
  styleUrl: 'banner.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [MatButtonModule],
})
export class BannerComponent implements OnChanges {
  public config: SwiperOptions;
  public dataImages!: any[];
  @Input() data!: Product[];

  constructor(
    private router: Router,
    private styleService: StyleService,
  ) {
    register();
    this.config = {
      slidesPerView: 1,
      loop: true,
      speed: 1000,
      spaceBetween: 0,
      navigation: true,
      autoplay: {
        delay: 3000,
      },
      pagination: { bulletActiveClass: 'swiper-pagination-bullet-active', clickable: true },
      scrollbar: { draggable: true },
    };
    // this.movieService.getAll().subscribe((data: any) => {
    //   this.dataImages = data;
    // });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data'] && changes['data'].currentValue) {
      this.dataImages = changes['data'].currentValue;
      console.log("imagenes",this.dataImages)
    }
  }

  onNavigateMovie(movie: any) {
    this.router.navigate([`frontend/movies/${movie.parent_asin}`]);
  }
  onSlideChange(event: any) {
    console.log(event);
  }
}
