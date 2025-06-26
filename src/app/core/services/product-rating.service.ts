import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { ProductRating } from '../interfaces/product-rating';

@Injectable({
  providedIn: 'root'
})
export class ProductRatingService {
  constructor(private _HttpClient: HttpClient) { }
  addRating(rating: ProductRating): Observable<ProductRating> {
    return this._HttpClient.post<ProductRating>(`${environment.baseUrl}/product-rating`, rating);
  }
  getRatings(): Observable<void> {
    return this._HttpClient.get<void>(`${environment.baseUrl}/product-rating`);
  }
  showRating(id: string): Observable<void> {
    return this._HttpClient.get<void>(`${environment.baseUrl}/product-rating/${id}`);
  }
  deleteRating(id: string): Observable<void> {
    return this._HttpClient.delete<void>(`${environment.baseUrl}/product-rating/${id}`);
  }
}
