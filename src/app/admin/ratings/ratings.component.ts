import { Component, DestroyRef, OnInit, signal } from '@angular/core';
import { ProductRating } from '../../core/interfaces/product-rating';
import { ProductRatingService } from '../../core/services/product-rating.service';
import { EmptyComponent } from "../shared/empty/empty.component";
import { LoaderComponent } from "../shared/loader/loader.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ratings',
  standalone: true,
  imports: [EmptyComponent, LoaderComponent,CommonModule],
  templateUrl: './ratings.component.html',
  styleUrl: './ratings.component.css'
})
export class RatingsComponent implements OnInit {
  msg = signal<string>('');
  isLoading = signal<boolean>(false);
  isFetching = signal<boolean>(true);
  product_ratings = signal<ProductRating[]>([]);
  product_rating= signal<ProductRating>({} as ProductRating);
  constructor(private _ProductRatingService: ProductRatingService, private _DestroyRef: DestroyRef) { }
  ngOnInit(): void {
    const subscription = this._ProductRatingService.getRatings().subscribe({
      next: (response:any) => {
        this.isFetching.set(false);
        this.product_ratings.set(response.data as ProductRating[]);
        console.log('Ratings fetched successfully:', this.product_rating());

      },
    })
    this._DestroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });
  }
  openViewModal(id: string) {
    this.isFetching.set(true)
    this._ProductRatingService.showRating(id).subscribe({
      next: (resp: any) => {
        this.isFetching.set(false)
        this.product_rating.set(resp.data);
      }
    });
  }
  deleteRating(id: string) {
    this._ProductRatingService.deleteRating(id).subscribe({
      next: () => {
        this.product_ratings.update(product_ratings => product_ratings.filter(rating => rating.id !== id));
        this.msg.set('Rating Of Product Deleted Successfully !');
        setTimeout(() => this.msg.set(''), 3000);
      },
      error: (err) => {
        this.msg.set(err.error.message);
      },
    })
  }
}
