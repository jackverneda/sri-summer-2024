import { Component } from '@angular/core';
import { MovieService } from '../core/services/movie.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.component.html',
  styleUrl: 'home.component.scss',
})
export class HomeComponent {
  movies: any[] = [];
  searchResults = [];
  bannerData!: any[];

  constructor(
    private movieService: MovieService,
    private route: ActivatedRoute,
  ) {
    this.movies = this.route.snapshot.data['data'];
    this.movieService.getSuggestions().subscribe((data: any) => {
      this.bannerData = data;
      console.log(this.bannerData);
    });
  }
}
