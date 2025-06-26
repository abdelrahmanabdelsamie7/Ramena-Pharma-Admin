import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Admin } from '../interfaces/admin';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  constructor(private _HttpClient: HttpClient) { }
  adminLogin(admin: Admin): Observable<Admin> {
    return this._HttpClient.post<Admin>(`${environment.baseUrl}/admin/login`, admin);
  }
  adminLogout(): Observable<void> {
    return this._HttpClient.post<void>(`${environment.baseUrl}/admin/logout`,'');
  }
  getAccount(): Observable<Admin> {
    return this._HttpClient.get<Admin>(`${environment.baseUrl}/admin/getaccount`);
  }
  addAdmin(admin: FormData): Observable<Admin> {
    return this._HttpClient.post<Admin>(`${environment.baseUrl}/admin/add-admin`, admin);
  }
  deleteAdmin(id:string): Observable<void> {
    return this._HttpClient.delete<void>(`${environment.baseUrl}/admin/delete-admin/${id}`);
  }
  getAdmins(): Observable<Admin[]> {
    return this._HttpClient.get<Admin[]>(`${environment.baseUrl}/admin/all-admins`);
  }
}
