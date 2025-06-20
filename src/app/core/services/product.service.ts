import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Product } from '../interfaces/product';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  constructor(private _HttpClient: HttpClient) { }
  addProduct(product: FormData): Observable<Product> {
    return this._HttpClient.post<Product>(`${environment.baseUrl}/products`, product);
  }
  getProducts(): Observable<void> {
    return this._HttpClient.get<void>(`${environment.baseUrl}/products`);
  }
  showProduct(id: string): Observable<void> {
    return this._HttpClient.get<void>(`${environment.baseUrl}/products/${id}`);
  }
  updatedProduct(id: string, product: FormData): Observable<Product> {
    return this._HttpClient.post<Product>(`${environment.baseUrl}/products/${id}`, product);
  }
  deleteProduct(id: string): Observable<void> {
    return this._HttpClient.delete<void>(`${environment.baseUrl}/products/${id}`);
  }
}
