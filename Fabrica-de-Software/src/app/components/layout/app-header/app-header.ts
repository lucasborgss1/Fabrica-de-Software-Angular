import { notifications } from '../../../lib/mock-data';
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Bell, Menu } from 'lucide-angular';
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

  // Ícones
  readonly Bell = Bell;
  readonly Menu = Menu;

  // Mock de Dados
  notifications = notifications;

  get unreadCount() {
    return this.notifications.filter((n) => !n.read).length;
  }

  toggleNotifications() {
    this.showNotifications = !this.showNotifications;
  }
}
