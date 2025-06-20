import { Component, DestroyRef, OnInit, signal } from '@angular/core';
import { Sponsor } from '../../core/interfaces/sponsor';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CustomValidators } from 'ng2-validation';
import { SponsorService } from '../../core/services/sponsor.service';
import { LoaderComponent } from "../shared/loader/loader.component";
import { EmptyComponent } from "../shared/empty/empty.component";

@Component({
  selector: 'app-sponsors',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LoaderComponent, EmptyComponent],
  templateUrl: './sponsors.component.html',
  styleUrl: './sponsors.component.css'
})
export class SponsorsComponent implements OnInit {
  isFetching = signal<boolean>(false);
  isLoading = signal<boolean>(false);
  sponsors = signal<Sponsor[]>([])
  sponsor = signal<Sponsor | null>(null);
  msg = signal<string>('');
  selectedsponsor: Sponsor | null = null;
  modalTitle = signal<string>('Add Sponsor');
  modalButton = signal<string>('Save');
  sponsorLogo = signal<any>('');
  showLogoWarning = signal<boolean>(false);

  addSponsorForm = new FormGroup({
    title: new FormControl('', [Validators.required, Validators.maxLength(255)]),
    description: new FormControl('', [Validators.required]),
    logo: new FormControl<File | null>(null),
    website_url: new FormControl('', [Validators.required, CustomValidators.url]),
  });

  addSponsorLogos = new FormGroup({
    id: new FormControl('', Validators.required),
    logo: new FormControl<File[] | null>(null)
  });
  selectedsponsorId: string | null = null;
  selectedFiles: File[] = [];
  constructor(private _sponsorservice: SponsorService, private _DestroyRef: DestroyRef) { }

  openAddModal() {
    this.selectedsponsor = null;
    this.modalTitle.set('Add sponsor');
    this.modalButton.set('Save');
    this.addSponsorForm.reset();
    this.sponsorLogo.set(null);
  }
  async urlToFile(url: string, filename: string): Promise<File> {
    const response = await fetch(`http://localhost:8000${url}`);
    const blob = await response.blob();
    return new File([blob], filename, { type: blob.type });
  }
  async openUpdateModal(sponsor: Sponsor) {
    this.selectedsponsor = sponsor;
    this.modalTitle.set('Update sponsor');
    this.modalButton.set('Save Changes');
    this.sponsorLogo.set(sponsor.logo || null);

    this.addSponsorForm.patchValue({
      title: sponsor.title,
      description: sponsor.description,
      logo: null,
      website_url: sponsor.website_url
    });
    if (typeof sponsor.logo === 'string' && sponsor.logo) {
      const file = await this.urlToFile(sponsor.logo, 'old-logo.jpg');
      this.addSponsorForm.patchValue({ logo: file });
    }
  }
  closeModal() {
    document.getElementById('closeModalButton')?.click();
  }
  ngOnInit(): void {
    this.getSponsors();
  }
  // Get All Sponsors Method
  getSponsors() {
    this.isFetching.set(true);
    const subcsription = this._sponsorservice.getSponsors().subscribe({
      next: (resp: any) => {
        this.isFetching.set(false)
        this.sponsors.set(resp.data)
      },
      error: (err) => {
        this.isFetching.set(false)
        this.msg.set(err.error.message);
      }
    })
    this._DestroyRef.onDestroy(() => {
      subcsription.unsubscribe();
    });
  }
  // Show sponsor Details Method
  openViewModal(id: string) {
    this.isFetching.set(true)
    this._sponsorservice.showSponsor(id).subscribe({
      next: (resp: any) => {
        this.isFetching.set(false)
        this.sponsor.set(resp.data);
      }
    });
  }
  // Select File logo
  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.addSponsorForm.patchValue({ logo: input.files[0] });
    }
  }
  saveSponsor() {
    const formData = new FormData();
    formData.append('title', this.addSponsorForm.value.title || '');
    formData.append('description', this.addSponsorForm.value.description || '');
    formData.append('website_url', String(this.addSponsorForm.value.website_url ?? ''));

    const file = this.addSponsorForm.value.logo;
    if (file && file instanceof File) {
      formData.append('logo', file);
    }

    if (this.selectedsponsor) {
      this.isLoading.set(true);
      this._sponsorservice.updatedSponsor(this.selectedsponsor.id, formData).subscribe({
        next: (resp: any) => {
          this.msg.set('Sponsor Updated Successfully');
          setTimeout(() => this.msg.set(''), 3000);
          this.sponsors.set(this.sponsors().map(sponsor => sponsor.id === this.selectedsponsor!.id ? resp.data : sponsor));
          this.closeModal();
        },
        error: (err) => {
          if (err.error.message === 'The logo field is required.') {
            this.msg.set('Add logo Again');
          } else {
            this.msg.set('Check Validation Of Data !');
          }
          setTimeout(() => this.msg.set(''), 3000);
        }, complete: () => {
          this.isLoading.set(false);
        }
      });
    } else {
      this.isLoading.set(true);
      this._sponsorservice.addSponsor(formData).subscribe({
        next: (resp: any) => {
          this.isLoading.set(false);
          this.msg.set('Sponsor Added Successfully !');
          setTimeout(() => this.msg.set(''), 3000);
          this.sponsors.update(sponsors => [...sponsors, resp.data]);
          this.closeModal();
        },
        error: (err) => {
          this.isLoading.set(false);
          if (err.error.message === 'The Logo field is required.') {
            this.msg.set('Add logo Again');
          } else {
            this.msg.set('Check Validation Of Data !');
          }
          setTimeout(() => this.msg.set(''), 3000);
        },
        complete: () => {
          this.isLoading.set(false);
        }
      });
    }
  }
  // Delete Specific sponsor Method
  deleteSponsor(id: string) {
    this._sponsorservice.deleteSponsor(id).subscribe({
      next: () => {
        this.sponsors.update(sponsors => sponsors.filter(sponsor => sponsor.id !== id));
        this.msg.set('Sponsor Deleted Successfully !');
        setTimeout(() => this.msg.set(''), 3000);
      },
      error: (err) => {
        this.msg.set(err.error.message);
      },
    })
  }
}
