import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseService } from '../../../core/service/base.service';
import { LoggedInUserService } from '../../../core/service/logged-in-user.service';

@Injectable({
  providedIn: 'root',
})
export class MovieService extends BaseService {
  data: any[] = [];
  movieByName!: string;
  AllMovies: any[] = [];

  constructor(
    private httpClient: HttpClient,
    private loggedInUser: LoggedInUserService,
  ) {
    super(httpClient, 'products', loggedInUser);
    this.movieByName = this.baseUrl + '/name/:value';
    this.fetchMovies();
  }

  async fetchMovies() {
    let query = this.getAll().subscribe((data: any) => {
      this.AllMovies = data;
      console.log('fetched');
    });
    await query;
    console.log('done');
    return;
  }

  // getAllFiltered(name: string) {
  //   return this.httpClient.get(this.movieByName.replace(':value', name));
  // }
  getRandMovies(n: number) {
    return this.AllMovies.sort(() => Math.random() - 0.5).slice(0, n);
  }

  getbyname(name: string){
    return this.httpClient.get(this.movieByName.replace(":value", name))
  }

  getAllFiltered(name: string) {
    return this.AllMovies.filter((movie) => movie.name.toLowerCase().includes(name.toLowerCase()));
  }

  getClassicMovies() {
    return this.AllMovies.filter((movie) => new Date(movie.premiere) < new Date('2010-01-01'));
  }

  getNewMovies() {
    return this.AllMovies.filter((movie) => new Date(movie.premiere) >= new Date('2024-01-01'));
  }

  getMoviesByGenre(genre: string) {
    return this.AllMovies.filter((movie) => movie.genres.includes(genre));
  }

  getMoviesByActor(actor: string) {
    return this.AllMovies.filter((movie) => movie.actors.includes(actor));
  }

  getMoviesByDirector(director: string) {
    return this.AllMovies.filter((movie) => movie.director === director);
  }

  buyProduct(body: any) {
    return this.httpClient.post(this.baseUrl.replace('product', 'purchase'), body);
  }

  getSuggestions() {
    return this.httpClient.get(this.baseUrl+'/suggestion/1');
  }
}
