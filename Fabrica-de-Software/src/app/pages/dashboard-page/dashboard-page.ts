import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {
  LucideAngularModule,
  FileText,
  CheckCircle2,
  XCircle,
  Users,
  GraduationCap,
  Clock,
  FolderKanban,
} from 'lucide-angular';
import { Auth } from '../../core/services/auth';
import { PageHeader } from '../../components/page-header/page-header';
import { StatusBadge } from '../../components/status-badge/status-badge';

// Você importará seus mocks reais aqui
import { projectRequests, professors, students, workgroups } from '../../lib/mock-data';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, PageHeader, StatusBadge],
  templateUrl: './dashboard-page.html',
})
export class DashboardPage {
  private router = inject(Router);
  public authService = inject(Auth);

  // Mapeamento de Ícones
  readonly Clock = Clock;
  readonly CheckCircle2 = CheckCircle2;
  readonly XCircle = XCircle;
  readonly Users = Users;
  readonly GraduationCap = GraduationCap;
  readonly FolderKanban = FolderKanban;
  readonly FileText = FileText;

  // Dados Mockados
  projectRequests = projectRequests;
  professorsCount = professors.length;
  studentsCount = students.length;
  workgroupsCount = workgroups.length;

  // Métodos Auxiliares para o Admin
  get analysisCount() {
    return this.projectRequests.filter((p) => p.status === 'Em análise').length;
  }
  get approvedCount() {
    return this.projectRequests.filter(
      (p) => p.status === 'Aprovado' || p.status === 'Em andamento',
    ).length;
  }
  get rejectedCount() {
    return this.projectRequests.filter((p) => p.status === 'Rejeitado' || p.status === 'Cancelado')
      .length;
  }

  // Métodos Auxiliares para o Professor
  get myRequests() {
    return this.projectRequests.filter((p) => p.professor === 'Dr. Carlos Silva');
  } // Substituir por ID dinâmico no futuro
  get submittedCount() {
    return this.myRequests.length;
  }
  get inProgressCount() {
    return this.myRequests.filter((p) => p.status === 'Em andamento' || p.status === 'Aprovado')
      .length;
  }

  navigateToRequest(id: string) {
    this.router.navigate(['/requests', id]);
  }
}
