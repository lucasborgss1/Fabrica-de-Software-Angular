import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FolderKanban, LucideAngularModule, Users } from 'lucide-angular';
import { firstValueFrom } from 'rxjs';

import { PageHeader } from '../../components/page-header/page-header';
import { StatusBadge } from '../../components/status-badge/status-badge';
import { ProjectSummary, WorkgroupSummary, formatApiDate } from '../../core/models/api.models';
import { BackendApi } from '../../core/services/backend-api';
import { Auth } from '../../core/services/auth';

@Component({
  selector: 'app-projects-page',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, PageHeader, StatusBadge],
  templateUrl: './projects-page.html',
})
export class ProjectsPage implements OnInit {
  private router = inject(Router);
  private api = inject(BackendApi);
  private auth = inject(Auth);

  readonly FolderKanban = FolderKanban;
  readonly Users = Users;

  // Convertido para Signals
  readonly projects = signal<ProjectSummary[]>([]);
  readonly workgroups = signal<WorkgroupSummary[]>([]);
  readonly isLoading = signal(true);
  readonly errorMessage = signal('');

  // Convertido de 'get' para 'computed'
  readonly myProjects = computed(() => {
    const activeProjects = this.projects().filter(
      (project) =>
        project.statusProjeto === 'APROVADO' ||
        project.statusProjeto === 'FINALIZADO' ||
        project.statusProjeto === 'EM_ANALISE',
    );

    if (this.auth.role() !== 'professor') {
      return activeProjects;
    }

    const userName = this.auth.userName().trim().toLowerCase();

    if (!userName || userName === 'usuário') {
      return activeProjects;
    }

    return activeProjects.filter((project) =>
      project.nomeProfessorSolicitante.toLowerCase().includes(userName),
    );
  });

  async ngOnInit() {
    await this.loadProjects();
  }

  async loadProjects() {
    this.isLoading.set(true);
    this.errorMessage.set('');

    try {
      const [projectsData, workgroupsData] = await Promise.all([
        firstValueFrom(this.api.listProjects()),
        firstValueFrom(this.api.listWorkgroups()).catch(() => [] as WorkgroupSummary[]),
      ]);

      this.projects.set(projectsData);
      this.workgroups.set(workgroupsData);
    } catch {
      this.projects.set([]);
      this.workgroups.set([]);
      this.errorMessage.set(
        'Não foi possível carregar os projetos. Verifique se o login possui acesso ao endpoint /api/projetos.',
      );
    } finally {
      this.isLoading.set(false);
    }
  }

  getWorkgroupForProject(projectName: string): WorkgroupSummary | undefined {
    return this.workgroups().find((group) => group.nomeProjeto === projectName);
  }

  viewProject(project: ProjectSummary) {
    this.router.navigate(['/requests', project.id], { state: { project } });
  }

  formatDate(date: string | null) {
    return formatApiDate(date);
  }
}
