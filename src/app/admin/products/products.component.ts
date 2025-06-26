import { Component, DestroyRef, OnInit, signal } from '@angular/core';
import { ProductService } from '../../core/services/product.service';
import { Product } from '../../core/interfaces/product';
import { CommonModule } from '@angular/common';
import { LoaderComponent } from "../shared/loader/loader.component";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import { EmptyComponent } from "../shared/empty/empty.component";
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, LoaderComponent, ReactiveFormsModule,RouterModule ,EmptyComponent],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent implements OnInit {
  isFetching = signal<boolean>(false);
  isLoading = signal<boolean>(false);
  products = signal<Product[]>([])
  product = signal<Product | null>(null);
  msg = signal<string>('');
  selectedProduct: Product | null = null;
  modalTitle = signal<string>('Add Product');
  modalButton = signal<string>('Save');
  ProductImage = signal<any>('');
  showImageWarning = signal<boolean>(false);

  addProductForm = new FormGroup({
    title: new FormControl('', [Validators.required, Validators.maxLength(255)]),
    description: new FormControl('', [Validators.required]),
    image: new FormControl<File | null>(null),
    price: new FormControl(0, [Validators.required]),
    video_en: new FormControl('', [Validators.required, CustomValidators.url]),
    video_ar: new FormControl('', [Validators.required, CustomValidators.url]),
  });

  addProductImages = new FormGroup({
    id: new FormControl('', Validators.required),
    image: new FormControl<File[] | null>(null)
  });
  selectedProductId: string | null = null;
  selectedFiles: File[] = [];
  constructor(private _ProductService: ProductService, private _DestroyRef: DestroyRef) { }
  openAddModal() {
    this.selectedProduct = null;
    this.modalTitle.set('Add Product');
    this.modalButton.set('Save');
    this.addProductForm.reset();
    this.ProductImage.set(null);
  }
  async urlToFile(url: string, filename: string): Promise<File> {
    const response = await fetch(`http://localhost:8000${url}`);
    const blob = await response.blob();
    return new File([blob], filename, { type: blob.type });
  }
  async openUpdateModal(product: Product) {
    this.selectedProduct = product;
    this.modalTitle.set('Update Product');
    this.modalButton.set('Save Changes');
    this.ProductImage.set(product.image || null);

    this.addProductForm.patchValue({
      title: product.title,
      description: product.description,
      image: null,
      price: product.price,
      video_ar: product.video_ar,
      video_en: product.video_en
    });
    if (typeof product.image === 'string' && product.image) {
      const file = await this.urlToFile(product.image, 'old-image.jpg');
      this.addProductForm.patchValue({ image: file });
    }
  }
  closeModal() {
    document.getElementById('closeModalButton')?.click();
  }
  ngOnInit(): void {
    this.getProducts();
  }
  // Get All Product Method
  getProducts() {
    this.isFetching.set(true);
    const subcsription = this._ProductService.getProducts().subscribe({
      next: (resp: any) => {
        this.isFetching.set(false)
        this.products.set(resp.data)
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
  // Show Product Details Method
  openViewModal(id: string) {
    this.isFetching.set(true)
    this._ProductService.showProduct(id).subscribe({
      next: (resp: any) => {
        this.isFetching.set(false)
        this.product.set(resp.data);
        console.log(this.product());

      }
    });
  }
  // Select File Image
  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.addProductForm.patchValue({ image: input.files[0] });
    }
  }
  // Add or Update Product Method
  saveProduct() {
    const formData = new FormData();
    formData.append('title', this.addProductForm.value.title || '');
    formData.append('description', this.addProductForm.value.description || '');
    formData.append('price', String(this.addProductForm.value.price ?? 0));
    formData.append('video_ar', String(this.addProductForm.value.video_ar ?? ''));
    formData.append('video_en', String(this.addProductForm.value.video_en ?? ''));

    const file = this.addProductForm.value.image;
    if (file && file instanceof File) {
      formData.append('image', file);
    }

    if (this.selectedProduct) {
      this.isLoading.set(true);
      this._ProductService.updatedProduct(this.selectedProduct.id, formData).subscribe({
        next: (resp: any) => {
          this.msg.set('Product Updated Successfully');
          setTimeout(() => this.msg.set(''), 3000);
          this.products.set(this.products().map(product => product.id === this.selectedProduct!.id ? resp.data : product));
          this.closeModal();
        },
        error: (err) => {
          if (err.error.message === 'The image field is required.') {
            this.msg.set('Add Image Again');
          } else {
            this.isLoading.set(false);
            this.msg.set('Check Validation Of Data !');
          }
          setTimeout(() => this.msg.set(''), 3000);
        },
        complete: () => {
          this.isLoading.set(false);
        }
      });
    } else {
      this.isLoading.set(true);
      this._ProductService.addProduct(formData).subscribe({
        next: (resp: any) => {
          this.msg.set('Product Added Successfully !');
          setTimeout(() => this.msg.set(''), 3000);
          this.products.update(products => [...products, resp.data]);
          this.closeModal();
        },
        error: (err) => {
          this.isLoading.set(false);
          if (err.error.message === 'The image field is required.') {
            this.msg.set('Add Image Again');
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
  // Delete Specific Product Method
  deleteProduct(id: string) {
    this._ProductService.deleteProduct(id).subscribe({
      next: () => {
        this.products.update(products => products.filter(product => product.id !== id));
        this.msg.set('Product Deleted Successfully !');
        setTimeout(() => this.msg.set(''), 3000);
      },
      error: (err) => {
        this.msg.set(err.error.message);
      },
    })
  }
}
