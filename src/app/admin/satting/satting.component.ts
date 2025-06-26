import { Component, OnInit, signal } from '@angular/core';
import { AdminService } from '../../core/services/admin.service';
import { Admin } from '../../core/interfaces/admin';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-satting',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './satting.component.html',
  styleUrl: './satting.component.css'
})
export class SattingComponent implements OnInit {
  modalTitle = signal<string>('')
  modalButton = signal<string>('')
  msg = signal<string>('')
  isLoading = signal<boolean>(false) ;
  admin = signal<Admin>({} as Admin);
  allAdmins = signal<Admin[]>([]);
  addAdminForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.maxLength(255)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)])
  });
  constructor(private _AdminService: AdminService) { }
  ngOnInit(): void {
    this._AdminService.getAccount().subscribe({
      next: (resp) => {
        this.admin.set(resp)
      }
    });
    this._AdminService.getAdmins().subscribe({
      next: (resp) => {
        console.log(resp);
        this.allAdmins.set(resp)
      }
    })
  }
  openAddModal() {
    this.modalTitle.set('Add Admin');
    this.modalButton.set('Save');
    this.addAdminForm.reset();
  }
  addAdmin(addAdminForm: FormGroup) {
    const formData = new FormData();
    const values = addAdminForm.value;
    formData.append('name', values.name || '');
    formData.append('email', values.email || '');
    formData.append('password', values.password || '');
    this._AdminService.addAdmin(formData).subscribe({
      next:(res:any)=>{
        this.msg.set('Pharmacy Added Successfully !');
        setTimeout(() => this.msg.set(''), 3000);
        console.log(res);

        this.allAdmins.update(allAdmins => [...allAdmins, res.admin]);
        this.closeModal();
      }
    });
  }
  closeModal() {
    document.getElementById('closeModalButton')?.click();
  }
  deleteAdmin(id: string) {
    this._AdminService.deleteAdmin(id).subscribe({
      next: () => {
        this.allAdmins.update(allAdmins => allAdmins.filter(admin => admin.id !== id));
        this.msg.set('admin Deleted Successfully !');
        setTimeout(() => this.msg.set(''), 3000);
      },
      error: (err) => {
        this.msg.set(err.error.message);
      },
    })
  }
}
