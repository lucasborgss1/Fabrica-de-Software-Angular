import { Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import {
  LucideAngularModule,
  LayoutDashboard,
  GraduationCap,
  Users,
  FolderKanban,
  UserCog,
  FileText,
  LogOut,
} from 'lucide-angular';
import { Auth } from '../../../core/services/auth';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule],
  templateUrl: './app-sidebar.html',
})
export class AppSidebar {
  public authService = inject(Auth);
  private router = inject(Router);

  // Propriedade para controlar se a sidebar está expandida ou não (pode ser recebida do Layout pai)
  @Input() collapsed = false;

  // Ícones do Lucide
  readonly FolderKanban = FolderKanban;
  readonly LogOut = LogOut;

  // Arrays de menu separados por perfil
  adminItems = [
    { title: 'Dashboard', url: '/dashboard', icon: LayoutDashboard },
    { title: 'Professores', url: '/professors', icon: UserCog },
    { title: 'Alunos', url: '/students', icon: GraduationCap },
    { title: 'Solicitações', url: '/requests', icon: FileText },
    { title: 'Grupos de Trabalho', url: '/workgroups', icon: Users },
  ];

  professorItems = [
    { title: 'Dashboard', url: '/dashboard', icon: LayoutDashboard },
    { title: 'Minhas Solicitações', url: '/requests', icon: FileText },
    { title: 'Meus Projetos', url: '/projects', icon: FolderKanban },
  ];

  // Retorna os itens baseados na Role atual usando o Signal
  get currentItems() {
    return this.authService.role() === 'admin' ? this.adminItems : this.professorItems;
  }

  handleLogout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
