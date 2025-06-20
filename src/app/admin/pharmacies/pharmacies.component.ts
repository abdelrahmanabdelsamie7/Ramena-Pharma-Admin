import { AfterViewInit, Component, DestroyRef, OnInit, signal } from '@angular/core';
import { Pharmacy } from '../../core/interfaces/pharmacy';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CustomValidators } from 'ng2-validation';
import { PharmacyService } from '../../core/services/pharmacy.service';
import { LoaderComponent } from "../shared/loader/loader.component";
import { EmptyComponent } from "../shared/empty/empty.component";
import * as L from 'leaflet';
@Component({
  selector: 'app-pharmacies',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, LoaderComponent, EmptyComponent],
  templateUrl: './pharmacies.component.html',
  styleUrl: './pharmacies.component.css'
})
export class PharmaciesComponent implements OnInit , AfterViewInit {
  isFetching = signal<boolean>(false);
  isLoading = signal<boolean>(false);
  pharmacies = signal<Pharmacy[]>([])
  pharmacy = signal<Pharmacy | null>(null);
  msg = signal<string>('');
  selectedPharmacy: Pharmacy | null = null;
  modalTitle = signal<string>('Add Pharmacy');
  modalButton = signal<string>('Save');
  pharmacyLogo = signal<any>('');
  showLogoWarning = signal<boolean>(false);

  addPharmacyForm = new FormGroup({
    title: new FormControl('', [Validators.required, Validators.maxLength(255)]),
    location_name: new FormControl('', [Validators.required]),
    logo: new FormControl<File | null>(null),
    address: new FormControl('', [Validators.required]),
    phone_number: new FormControl('', [Validators.required,]),
    latitude: new FormControl(0, [Validators.required,]),
    longitude: new FormControl(0, [Validators.required,]),
  });

  addPharmacyLogos = new FormGroup({
    id: new FormControl('', Validators.required),
    logo: new FormControl<File[] | null>(null)
  });
  selectedPharmacyId: string | null = null;
  selectedFiles: File[] = [];
  constructor(private _PharmacyService: PharmacyService, private _DestroyRef: DestroyRef) { }

  openAddModal() {
    this.selectedPharmacy = null;
    this.modalTitle.set('Add Pharmacy');
    this.modalButton.set('Save');
    this.addPharmacyForm.reset();
    this.pharmacyLogo.set(null);
  }
  async urlToFile(url: string, filename: string): Promise<File> {
    const response = await fetch(`http://localhost:8000${url}`);
    const blob = await response.blob();
    return new File([blob], filename, { type: blob.type });
  }
  async openUpdateModal(Pharmacy: Pharmacy) {
    this.selectedPharmacy = Pharmacy;
    this.modalTitle.set('Update Pharmacy');
    this.modalButton.set('Save Changes');
    this.pharmacyLogo.set(Pharmacy.logo || null);

    this.addPharmacyForm.patchValue({
      title: Pharmacy.title,
      location_name: Pharmacy.location_name,
      address: Pharmacy.address,
      phone_number: Pharmacy.phone_number,
      logo: null,
      latitude: Pharmacy.latitude,
      longitude: Pharmacy.longitude
    });
    if (typeof Pharmacy.logo === 'string' && Pharmacy.logo) {
      const file = await this.urlToFile(Pharmacy.logo, 'old-logo.jpg');
      this.addPharmacyForm.patchValue({ logo: file });
    }
  }
  closeModal() {
    document.getElementById('closeModalButton')?.click();
  }
  ngOnInit(): void {
    this.getPharmacies();
  }
  map!: L.Map;

  ngAfterViewInit(): void {
    this.initMap();
    this.addMarkers();
  }

  initMap(): void {
    this.map = L.map('map').setView([26.6475, 31.6457], 15);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: 'Map data © Ramena Pharma'
    }).addTo(this.map);
  }

  addMarkers(): void {

    if (!this.pharmacies()) {
      console.warn('No pharmacies available to add markers.');
      return;
    }
    this.pharmacies().forEach((pharmacy: Pharmacy) => {
      console.log(`Adding marker for pharmacy: ${pharmacy.title} at [${pharmacy.latitude}, ${pharmacy.longitude}]`);

      const marker = L.marker([+pharmacy.latitude, +pharmacy.longitude]).addTo(this.map);
      marker.bindPopup(`
        <b>${pharmacy.title}</b><br>
        العنوان: ${pharmacy.address}<br>
        <a href="tel:${pharmacy.phone_number}">اتصل الآن</a>
      `);
    });
  }
  // Get All pharmacies Method
  getPharmacies() {
    this.isFetching.set(true);
    const subcsription = this._PharmacyService.getPharmacies().subscribe({
      next: (resp: any) => {
        this.isFetching.set(false)
        this.pharmacies.set(resp.data)
        this.pharmacies().forEach((pharmacy: Pharmacy) => {
          console.log(`Adding marker for pharmacy: ${pharmacy.title} at [${pharmacy.latitude}, ${pharmacy.longitude}]`);

          const marker = L.marker([+pharmacy.latitude, +pharmacy.longitude]).addTo(this.map);
          marker.bindPopup(`
            <b>${pharmacy.title}</b><br>
            العنوان: ${pharmacy.address}<br>
            <a href="tel:${pharmacy.phone_number}">اتصل الآن</a>
          `);
        });
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
  // Show Pharmacy Details Method
  openViewModal(id: string) {
    this.isFetching.set(true)
    this._PharmacyService.showPharmacy(id).subscribe({
      next: (resp: any) => {
        this.isFetching.set(false)
        this.pharmacy.set(resp.data);
      }
    });
  }
  // Select File logo
  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.addPharmacyForm.patchValue({ logo: input.files[0] });
    }
  }
  savePharmacy() {
    const formData = new FormData();
    formData.append('title', this.addPharmacyForm.value.title || '');
    formData.append('location_name', this.addPharmacyForm.value.location_name || '');
    formData.append('phone_number', this.addPharmacyForm.value.phone_number || '');
    formData.append('address', String(this.addPharmacyForm.value.address ?? ''));
    formData.append('latitude', String(this.addPharmacyForm.value.latitude ?? ''));
    formData.append('longitude', String(this.addPharmacyForm.value.longitude ?? ''));
    const file = this.addPharmacyForm.value.logo;
    if (file && file instanceof File) {
      formData.append('logo', file);
    }
    if (this.selectedPharmacy) {
      this.isLoading.set(true);
      this._PharmacyService.updatedPharmacy(this.selectedPharmacy.id, formData).subscribe({
        next: (resp: any) => {
          this.msg.set('Pharmacy Updated Successfully');
          setTimeout(() => this.msg.set(''), 3000);
          this.pharmacies.set(this.pharmacies().map(Pharmacy => Pharmacy.id === this.selectedPharmacy!.id ? resp.data : Pharmacy));
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
      this._PharmacyService.addPharmacy(formData).subscribe({
        next: (resp: any) => {
          this.isLoading.set(false);
          this.msg.set('Pharmacy Added Successfully !');
          setTimeout(() => this.msg.set(''), 3000);
          this.pharmacies.update(pharmacies => [...pharmacies, resp.data]);
          this.closeModal();
        },
        error: (err) => {
          console.log(err);

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
  // Delete Specific Pharmacy Method
  deletePharmacy(id: string) {
    this._PharmacyService.deletePharmacy(id).subscribe({
      next: () => {
        this.pharmacies.update(pharmacies => pharmacies.filter(Pharmacy => Pharmacy.id !== id));
        this.msg.set('Pharmacy Deleted Successfully !');
        setTimeout(() => this.msg.set(''), 3000);
      },
      error: (err) => {
        this.msg.set(err.error.message);
      },
    })
  }
}
