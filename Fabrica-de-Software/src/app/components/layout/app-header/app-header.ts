import { notifications } from '../../../lib/mock-data';
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Bell, ChevronDown, Menu } from 'lucide-angular';
import { Auth } from '../../../core/services/auth';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './app-header.html',
})
export class AppHeader {
  public auth = inject(Auth);

  // Controlo dos menus dropdown
  showNotifications = false;
  showRoleMenu = false;

  // Ícones
  readonly Bell = Bell;
  readonly ChevronDown = ChevronDown;
  readonly Menu = Menu;

  // Mock de Dados
  notifications = notifications;

  get unreadCount() {
    return this.notifications.filter((n) => !n.read).length;
  }

  toggleRoleMenu() {
    this.showRoleMenu = !this.showRoleMenu;
    this.showNotifications = false; // Fecha o outro menu se estiver aberto
  }

  toggleNotifications() {
    this.showNotifications = !this.showNotifications;
    this.showRoleMenu = false;
  }

  changeRole(newRole: string) {
    this.auth.setRole(newRole);
    this.showRoleMenu = false; // Esconde o menu após a seleção
  }
}
