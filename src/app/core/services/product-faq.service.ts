import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ProductFaq } from '../interfaces/product-faq';
import { environment } from '../../../environments/environment.development';
@Injectable({
  providedIn: 'root'
})
export class ProductFaqService {
  constructor(private _HttpClient: HttpClient) { }
  addProductFaq(productFaq: FormData): Observable<ProductFaq> {
    return this._HttpClient.post<ProductFaq>(`${environment.baseUrl}/product-faqs`, productFaq);
  }
  updatedProductFaq(id: string, productFaq: FormData): Observable<ProductFaq> {
    return this._HttpClient.post<ProductFaq>(`${environment.baseUrl}/product-faqs/${id}`, productFaq);
  }
  deleteProductFaq(id: string): Observable<void> {
    return this._HttpClient.delete<void>(`${environment.baseUrl}/product-faqs/${id}`);
  }
}
