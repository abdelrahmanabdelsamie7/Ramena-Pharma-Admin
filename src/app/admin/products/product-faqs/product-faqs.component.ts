import { Component, DestroyRef, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductFaqService } from '../../../core/services/product-faq.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../../core/services/product.service';
import { ProductFaq } from '../../../core/interfaces/product-faq';
import { Product } from '../../../core/interfaces/product';
import { EmptyComponent } from "../../shared/empty/empty.component";
import { LoaderComponent } from "../../shared/loader/loader.component";

@Component({
  selector: 'app-product-faqs',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, EmptyComponent, LoaderComponent],
  templateUrl: './product-faqs.component.html',
  styleUrl: './product-faqs.component.css'
})
export class ProductFaqsComponent implements OnInit {
  msg = signal<string>('');
  product = signal<Product>({} as Product);
  isLoading = signal<boolean>(false);
  isFetching = signal<boolean>(false);
  selectedProductFaq: ProductFaq | null = null;
  modalTitle = signal<string>('Add Product Faq');
  modalButton = signal<string>('Save');
  productId = signal<string>('');
  product_faqs = signal<any[]>([]);
  addProductFaqForm = new FormGroup({
    question: new FormControl('', [Validators.required, Validators.maxLength(255)]),
    answer: new FormControl('', [Validators.required]),
    product_id: new FormControl('',),
  });
  constructor(private _ActivatedRoute: ActivatedRoute, private _ProductService: ProductService, private _ProductFaqService: ProductFaqService, private _DestroyRef: DestroyRef) { }
  ngOnInit() {
    this._ActivatedRoute.params.subscribe(params => {
      this.productId.set(params['id']);
      const subscription = this._ProductService.showProduct(this.productId()).subscribe({
        next: (resp: any) => {
          this.isFetching.set(true);
          this.product.set(resp.data);
          this.product_faqs.set(resp.data.product_faqs || []);
        },
        error: () => {
          this.isFetching.set(false);
        }
      });
      this._DestroyRef.onDestroy(() => {
        subscription.unsubscribe();
      });
    });

  }
  openAddModal() {
    this.selectedProductFaq = null;
    this.modalTitle.set('Add Product Faq');
    this.modalButton.set('Save');
    this.addProductFaqForm.reset();
  }
  async openUpdateModal(productFaq: ProductFaq) {
    this.selectedProductFaq = productFaq;
    this.modalTitle.set('Update Product Faq');
    this.modalButton.set('Save Changes');
    this.addProductFaqForm.patchValue({
      question: productFaq.question,
      answer: productFaq.answer,
      product_id: this.productId()
    });
  }
  closeModal() {
    document.getElementById('closeModalButton')?.click();
  }
  // Add or Update Product Faq Method
  saveProductFaq() {
    this.addProductFaqForm.get('product_id')?.setValue(this.productId());
    const question = this.addProductFaqForm.get('question')?.value;
    const answer = this.addProductFaqForm.get('answer')?.value;
    const product_id = this.productId();
    if (!question || !answer || !product_id) {
      this.msg.set('All fields are required');
      setTimeout(() => this.msg.set(''), 3000);
      return;
    }
    const formData = new FormData();
    formData.append('question', question);
    formData.append('answer', answer);
    formData.append('product_id', product_id);
    if (this.selectedProductFaq) {
      this._ProductFaqService.updatedProductFaq(this.selectedProductFaq.id, formData).subscribe({
        next: (resp: any) => {
          this.msg.set('Product Faq Updated Successfully');
          setTimeout(() => this.msg.set(''), 3000);
          this.product_faqs.set(this.product_faqs().map(product => product.id === this.selectedProductFaq!.id ? resp.data : product));
          this.closeModal();
        },
        error: (err) => {
          this.msg.set('Check Validation Of Data !');
          setTimeout(() => this.msg.set(''), 3000);
        },
        complete: () => {
          this.isLoading.set(false);
        }
      });
    } else {
      this._ProductFaqService.addProductFaq(formData).subscribe({
        next: (resp: any) => {
          this.msg.set('Product Added Successfully !');
          setTimeout(() => this.msg.set(''), 3000);
          this.product_faqs.update(product_faqs => [...product_faqs, resp.data]);
          this.closeModal();
        },
        error: (err) => {
          this.msg.set('Check Validation Of Data !');
          setTimeout(() => this.msg.set(''), 3000);
        },
        complete: () => {
          this.isLoading.set(false);
        }
      });
    }
  }

  // Delete Specific Product Faq Method
  deleteProductFaq(id: string) {
    this._ProductFaqService.deleteProductFaq(id).subscribe({
      next: () => {
        this.product_faqs.update(product_faqs => product_faqs.filter(product_faq => product_faq.id !== id));
        this.msg.set('Product Faq Deleted Successfully !');
        setTimeout(() => this.msg.set(''), 3000);
      },
      error: (err) => {
        this.msg.set(err.error.message);
      },
    })
  }
}
