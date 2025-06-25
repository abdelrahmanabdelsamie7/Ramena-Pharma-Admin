import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AdminService } from '../../../core/services/admin.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  msg = signal<string>('');
  constructor(private _AdminService: AdminService, private _Router: Router) {}
  adminLoginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
    ]),
  });
  adminLogin(adminLoginForm: FormGroup) {
    this._AdminService.adminLogin(adminLoginForm.value).subscribe({
      next: (data: any) => {
        localStorage.setItem('adminTokenRamena', data.access_token);
        this.msg.set('Welcome Back Admin !');
        setTimeout(() => this.msg.set(''), 3000);
        this._Router.navigateByUrl('/dashboard');
      },
      error: (error) => {
        this.msg.set('Check Your Email or Password !');
        setTimeout(() => this.msg.set(''), 3000);
      },
    });
  }
}
