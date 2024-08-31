import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute } from '@angular/router';
import { MovieService } from '../core/services/movie.service';
import { ProjectionService } from '../core/services/projection.service';
import { StyleService } from '../../core/service/style.service';
import { Product } from '../../core/classes/product.class';

@Component({
  selector: 'app-movie',
  templateUrl: './movie.component.html',
  styleUrl: 'movie.component.scss',
})
export class MovieComponent {
  product: any;

  constructor(
    private activeRoute: ActivatedRoute,
    private movieService: MovieService,
    private styleService: StyleService,
  ) {
    this.activeRoute.params.subscribe((data) => {
      this.onLoadData(data['id']);
    });
  }
  onLoadData(id: string) {
    this.movieService.get(id).subscribe((data: any) => {
      this.product = data;
      this.product.details = Object.entries(data.details)
      this.styleService.setImage(data.images[0].thumb);
    });
  }

  onBuyProduct(){
    let body = {
      parent_asin: this.product.parent_asin,
      user_id: 1,
    }
    this.movieService.buyProduct(body).subscribe(() => {});
  }
}
