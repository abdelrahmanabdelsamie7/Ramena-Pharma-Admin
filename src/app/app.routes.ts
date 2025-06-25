import { Routes } from '@angular/router';
import { ProductsComponent } from './admin/products/products.component';
import { SponsorsComponent } from './admin/sponsors/sponsors.component';
import { ProductFaqsComponent } from './admin/products/product-faqs/product-faqs.component';
import { PharmaciesComponent } from './admin/pharmacies/pharmacies.component';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { adminGuard } from './core/guards/admin.guard';
import { StatisticsComponent } from './admin/statistics/statistics.component';
import { InboxComponent } from './admin/inbox/inbox.component';

export const routes: Routes = [

  { path: 'admin-login', loadComponent: () => import('./admin/shared/login/login.component').then(m => m.LoginComponent), title: 'Admin Login' },

  {
    path: '',
    component: DashboardComponent,
    canActivate: [adminGuard],
    title: 'Admin Panel',
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        component: StatisticsComponent,
        title: 'Dashboard',
      },
      { path: 'products', component: ProductsComponent, title: 'Products' },
      { path: 'product-faqs/:id', component: ProductFaqsComponent, title: 'Product Faqs' },
      { path: 'sponsors', component: SponsorsComponent, title: 'Sponsors' },
      { path: 'pharmacies', component: PharmaciesComponent, title: 'Pharmacies' },
      { path: 'inbox', component: InboxComponent, title: 'Inbox Contact' },

    ]
  },


];
