import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { MovieService } from '../services/movie.service';

@Injectable({
  providedIn: 'root',
})
export class HomeResolver implements Resolve<any> {
  constructor(private movieService: MovieService) {}

  resolve(): Observable<any> {
    return this.movieService.getAll();
  }
}
