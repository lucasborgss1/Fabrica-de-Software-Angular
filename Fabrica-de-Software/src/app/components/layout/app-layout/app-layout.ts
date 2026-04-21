import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { FolderKanban, LogOut, LucideAngularModule, Menu, X } from 'lucide-angular';

import { Auth } from '../../../core/services/auth';
import { AppHeader } from './../app-header/app-header';
import { AppSidebar } from '../app-sidebar/app-sidebar';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule, AppHeader, AppSidebar, RouterOutlet],
  templateUrl: './app-layout.html',
})
export class AppLayout {
  private authService = inject(Auth);
  private router = inject(Router);

  isMobileMenuOpen = false;

  readonly Menu = Menu;
  readonly LogOut = LogOut;
  readonly X = X;
  readonly FolderKanban = FolderKanban;

  constructor() {
    if (!this.authService.isLoggedIn()) {
      queueMicrotask(() => this.router.navigate(['/login']));
    }
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
