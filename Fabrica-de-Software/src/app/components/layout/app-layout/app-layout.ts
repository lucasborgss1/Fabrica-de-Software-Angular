import { AppHeader } from './../app-header/app-header';
import { StatusBadge } from './../../status-badge/status-badge';
import { AppSidebar } from '../app-sidebar/app-sidebar';
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterOutlet, Router } from '@angular/router';
import {
  LucideAngularModule,
  LayoutDashboard,
  Users,
  GraduationCap,
  FileText,
  FolderKanban,
  Menu,
  LogOut,
  X,
  Network,
} from 'lucide-angular';
import { Auth } from '../../../core/services/auth';

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

  // Mapeamento dos ícones do Lucide
  readonly Menu = Menu;
  readonly LogOut = LogOut;
  readonly X = X;
  readonly FolderKanban = FolderKanban;

  // Definição dos links do menu lateral
  menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/professors', label: 'Professores', icon: Users },
    { path: '/students', label: 'Alunos', icon: GraduationCap },
    { path: '/requests', label: 'Solicitações', icon: FileText },
    { path: '/workgroups', label: 'Grupos de Trabalho', icon: Network },
    { path: '/projects', label: 'Projetos', icon: FolderKanban },
  ];

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
