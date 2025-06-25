import { Component, DestroyRef, OnInit, signal } from '@angular/core';
import { ContactUsService } from '../../core/services/contact-us.service';
import { ContactUs } from '../../core/interfaces/contact-us';
import { LoaderComponent } from "../shared/loader/loader.component";
import { EmptyComponent } from "../shared/empty/empty.component";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-inbox',
  standalone: true,
  imports: [LoaderComponent, EmptyComponent,CommonModule,FormsModule],
  templateUrl: './inbox.component.html',
  styleUrl: './inbox.component.css'
})
export class InboxComponent implements OnInit {
  msg = signal<string>('');
  isLoading = signal<boolean>(false);
  isFetching = signal<boolean>(true);
  contactUs = signal<ContactUs[]>([]);
  contactDetials = signal<ContactUs>({} as ContactUs);
  constructor(private _ContactUsService: ContactUsService, private _DestroyRef: DestroyRef) { }
  ngOnInit(): void {
    const subscription = this._ContactUsService.getContacts().subscribe({
      next: (response:any) => {
        this.isFetching.set(false);
        this.contactUs.set(response.data as ContactUs[]);
        console.log('Contacts fetched successfully:', this.contactUs());

      },
    })
    this._DestroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });
  }
  openViewModal(id: string) {
    this.isFetching.set(true)
    this._ContactUsService.showContactDteails(id).subscribe({
      next: (resp: any) => {
        this.isFetching.set(false)
        this.contactDetials.set(resp.data);
      }
    });
  }
  deleteContact(id: string) {
    this._ContactUsService.deleteContact(id).subscribe({
      next: () => {
        this.contactUs.update(contactUs => contactUs.filter(Contact => Contact.id !== id));
        this.msg.set('Contact Deleted Successfully !');
        setTimeout(() => this.msg.set(''), 3000);
      },
      error: (err) => {
        this.msg.set(err.error.message);
      },
    })
  }
  sendReply(id: string) {
    this._ContactUsService.replyToContact(id, this.contactDetials()).subscribe({
      next: (resp: any) => {
        this.msg.set('Reply Sent Successfully !');
        setTimeout(() => this.msg.set(''), 3000);
        this.contactUs.update(contactUs => contactUs.map(Contact => Contact.id === id ? resp.data : Contact));
      },
      error: (err) => {
        this.msg.set(err.error.message);
      }
  })
}
}
