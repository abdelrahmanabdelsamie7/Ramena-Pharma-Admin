import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Observable } from 'rxjs';
import { Sponsor } from '../interfaces/sponsor';

@Injectable({
  providedIn: 'root'
})
export class SponsorService {
  constructor(private _HttpClient: HttpClient) { }
  addSponsor(sponsor: FormData): Observable<Sponsor> {
    return this._HttpClient.post<Sponsor>(`${environment.baseUrl}/sponsors`, sponsor);
  }
  getSponsors(): Observable<void> {
    return this._HttpClient.get<void>(`${environment.baseUrl}/sponsors`);
  }
  showSponsor(id: string): Observable<void> {
    return this._HttpClient.get<void>(`${environment.baseUrl}/sponsors/${id}`);
  }
  updatedSponsor(id: string, sponsor: FormData): Observable<Sponsor> {
    return this._HttpClient.post<Sponsor>(`${environment.baseUrl}/sponsors/${id}`, sponsor);
  }
  deleteSponsor(id: string): Observable<void> {
    return this._HttpClient.delete<void>(`${environment.baseUrl}/sponsors/${id}`);
  }
}
