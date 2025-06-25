import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Pharmacy } from '../interfaces/pharmacy';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class PharmacyService {

  constructor(private _HttpClient: HttpClient) { }
  addPharmacy(pharmacy: FormData): Observable<Pharmacy> {
    return this._HttpClient.post<Pharmacy>(`${environment.baseUrl}/pharmacies`, pharmacy);
  }
  getPharmacies(): Observable<void> {
    return this._HttpClient.get<void>(`${environment.baseUrl}/pharmacies`);
  }
  showPharmacy(id: string): Observable<void> {
    return this._HttpClient.get<void>(`${environment.baseUrl}/pharmacies/${id}`);
  }
  updatedPharmacy(id: string, pharmacy: FormData): Observable<Pharmacy> {
    return this._HttpClient.post<Pharmacy>(`${environment.baseUrl}/pharmacies/${id}`, pharmacy);
  }
  deletePharmacy(id: string): Observable<void> {
    return this._HttpClient.delete<void>(`${environment.baseUrl}/pharmacies/${id}`);
  }
}
