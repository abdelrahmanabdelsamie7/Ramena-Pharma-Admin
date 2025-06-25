import { CommonModule } from '@angular/common';
import { Component, HostListener, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule,RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  constructor(private _Router:Router){}
  isMobileNavOpen = signal(false);
  isAuth = signal(true);
  toggleMobileNav(): void {
    this.isMobileNavOpen.update(val => !val);
  }
  closeMobileNav(): void {
    this.isMobileNavOpen.set(false);
  }
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (target.closest('#navmenu a')) {
      this.closeMobileNav();
    }
    if (target.classList.contains('toggle-dropdown')) {
      const parent = target.parentElement;
      if (parent) {
        parent.classList.toggle('active');
        const next = parent.nextElementSibling as HTMLElement;
        if (next) {
          next.classList.toggle('dropdown-active');
        }
        event.preventDefault();
        event.stopImmediatePropagation();
      }
    }
  }
  logout(): void {
    localStorage.removeItem('adminTokenRamena');
    this.isAuth.set(false);
    this._Router.navigateByUrl('/admin-login');
  }
}
