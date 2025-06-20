import { Routes } from '@angular/router';
import { ProductsComponent } from './admin/products/products.component';
import { SponsorsComponent } from './admin/sponsors/sponsors.component';
import { ProductFaqsComponent } from './admin/products/product-faqs/product-faqs.component';
import { PharmaciesComponent } from './admin/pharmacies/pharmacies.component';

export const routes: Routes = [
  { path: '', redirectTo: 'products', pathMatch: 'full' },
  { path: 'products', component: ProductsComponent, title: 'Products' },
  { path: 'product-faqs/:id', component: ProductFaqsComponent, title: 'Product Faqs' },
  { path: 'sponsors', component: SponsorsComponent, title: 'Sponsors' },
  { path: 'pharmacies', component: PharmaciesComponent, title: 'Pharmacies' },
];
