import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import {
  CheckCircle2,
  Clock,
  FileText,
  FolderKanban,
  GraduationCap,
  LucideAngularModule,
  Users,
  XCircle,
} from 'lucide-angular';
import { firstValueFrom } from 'rxjs';

import { PageHeader } from '../../components/page-header/page-header';
import { StatusBadge } from '../../components/status-badge/status-badge';
import { ProjectSummary, formatApiDate } from '../../core/models/api.models';
import { BackendApi } from '../../core/services/backend-api';
import { Auth } from '../../core/services/auth';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, PageHeader, StatusBadge],
  templateUrl: './dashboard-page.html',
})
export class DashboardPage implements OnInit {
  private router = inject(Router);
  private api = inject(BackendApi);
  public authService = inject(Auth);

  readonly Clock = Clock;
  readonly CheckCircle2 = CheckCircle2;
  readonly XCircle = XCircle;
  readonly Users = Users;
  readonly GraduationCap = GraduationCap;
  readonly FolderKanban = FolderKanban;
  readonly FileText = FileText;

  // Convertido para Signals
  readonly projectRequests = signal<ProjectSummary[]>([]);
  readonly professorsCount = signal(0);
  readonly studentsCount = signal(0);
  readonly workgroupsCount = signal(0);
  readonly isLoading = signal(true);
  readonly errorMessage = signal('');

  // Convertido de 'get' para 'computed'
  readonly pendingCount = computed(
    () =>
      this.projectRequests().filter(
        (p) => p.statusProjeto === 'SOLICITADO' || p.statusProjeto === 'EM_ANALISE',
      ).length,
  );

  readonly approvedCount = computed(
    () =>
      this.projectRequests().filter(
        (p) => p.statusProjeto === 'APROVADO' || p.statusProjeto === 'FINALIZADO',
      ).length,
  );

  readonly rejectedCount = computed(
    () => this.projectRequests().filter((p) => p.statusProjeto === 'NAO_APROVADO').length,
  );

  readonly myRequests = computed(() => {
    const userName = this.authService.userName().trim().toLowerCase();

    if (!userName || userName === 'usuário') {
      return this.projectRequests();
    }

    return this.projectRequests().filter((p) =>
      p.nomeProfessorSolicitante.toLowerCase().includes(userName),
    );
  });

  readonly submittedCount = computed(() => this.myRequests().length);

  readonly inProgressCount = computed(
    () =>
      this.myRequests().filter(
        (p) => p.statusProjeto === 'SOLICITADO' || p.statusProjeto === 'EM_ANALISE',
      ).length,
  );

  async ngOnInit() {
    await this.loadDashboard();
  }

  async loadDashboard() {
    this.isLoading.set(true);
    this.errorMessage.set('');

    try {
      const [projects, professors, students, workgroups] = await Promise.all([
        firstValueFrom(this.api.listProjects()).catch(() => [] as ProjectSummary[]),
        firstValueFrom(this.api.listProfessors()).catch(() => []),
        firstValueFrom(this.api.listStudents()).catch(() => []),
        firstValueFrom(this.api.listWorkgroups()).catch(() => []),
      ]);

      this.projectRequests.set(projects);
      this.professorsCount.set(professors.length);
      this.studentsCount.set(students.length);
      this.workgroupsCount.set(workgroups.length);

      if (!this.authService.token()) {
        this.errorMessage.set(
          'Informe login e senha válidos na tela inicial para carregar os dados do backend.',
        );
      }
    } finally {
      this.isLoading.set(false);
    }
  }

  navigateToRequest(project: ProjectSummary) {
    this.router.navigate(['/requests', project.id], { state: { project } });
  }

  formatDate(date: string | null) {
    return formatApiDate(date);
  }
}
