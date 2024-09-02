import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { DurationModule } from '../../../core/pipes/duration/duration.module';
import { Product } from '../../../core/classes/product.class';
import { Router } from '@angular/router';

@Component({
  selector: 'app-movie-list',
  standalone: true,
  templateUrl: './movie-list.component.html',
  styleUrl: 'movie-list.component.scss',
  imports: [MatChipsModule, MatIconModule, CommonModule, DurationModule],
})
export class MovieListComponent implements OnChanges {
  rates = [1, 2, 3, 4, 5];
  @Input() data!: any[];
  data_:  Product[];

  constructor(private router: Router) {
    this.data_ = this.data
    if(this.data){
      for(let item of this.data_){
        item.details = Object.entries(item.details)
      }
    }
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes['data'] && changes['data'].currentValue) {
      this.data_ = changes['data'].currentValue;
      this.data_.forEach((item)=> item.details = Object.entries(item.details))
      console.log("busqueda",this.data_)
    }
  }
  onNavigate(id: string) {
    this.router.navigate(['/frontend/movies/'+id]);
  }
}
