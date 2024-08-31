import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MovieService } from '../core/services/movie.service';
import { fb } from '../../../../dist/cinemax-front/browser/chunk-T5IL2VME';
import { Product } from '../../core/classes/product.class';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrl: 'search.component.scss',
})
export class SearchComponent {
  searchForm: FormGroup;
  rates = [1, 2, 3, 4, 5];
  searchResults: Product[] = [];
  constructor(
    private movieService: MovieService,
    private fb: FormBuilder,
  ) {
    this.searchForm = fb.group({
      name: [''],
    });

    this.movieService.getAll().subscribe((data: any)=>{
      this.searchResults = data
      console.log("all p", this.searchResults)
    });
    this.searchForm.valueChanges.subscribe(() => {
      this.movieService.getbyname(this.searchForm?.get('name')?.value).subscribe((data: any)=>
        this.searchResults = data
      )
      // this.searchResults = this.movieService.getAllFiltered(this.searchForm?.get('name')?.value);
    });
  }
}
