import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { ContactUs } from '../interfaces/contact-us';
@Injectable({
  providedIn: 'root'
})
export class ContactUsService {
  constructor(private _HttpClient: HttpClient) { }
  sendMessage(contact: ContactUs): Observable<ContactUs> {
    return this._HttpClient.post<ContactUs>(`${environment.baseUrl}/contact-us`, contact);
  }
  getContacts(): Observable<void> {
    return this._HttpClient.get<void>(`${environment.baseUrl}/contact-us`);
  }
  showContactDteails(id: string): Observable<void> {
    return this._HttpClient.get<void>(`${environment.baseUrl}/contact-us/${id}`);
  }
  replyToContact(id: string, reply: ContactUs): Observable<ContactUs> {
    return this._HttpClient.post<ContactUs>(`${environment.baseUrl}/contact-us/${id}/reply`, reply);
  }
  deleteContact(id: string): Observable<void> {
    return this._HttpClient.delete<void>(`${environment.baseUrl}/contact-us/${id}`);
  }
}
