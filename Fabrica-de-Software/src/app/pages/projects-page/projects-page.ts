import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LucideAngularModule, FolderKanban, Users } from 'lucide-angular';

import { PageHeader } from '../../components/page-header/page-header';
import { StatusBadge } from '../../components/status-badge/status-badge';
import { projectRequests, workgroups, ProjectRequest, Workgroup } from '../../lib/mock-data';

@Component({
  selector: 'app-projects-page',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, PageHeader, StatusBadge],
  templateUrl: './projects-page.html',
})
export class ProjectsPage {
  private router = inject(Router);

  // Ícones
  readonly FolderKanban = FolderKanban;
  readonly Users = Users;

  // Filtra os projetos (no futuro, isso será feito diretamente pela API baseando-se no token JWT)
  get myProjects(): ProjectRequest[] {
    return projectRequests.filter(
      (p) =>
        p.professor === 'Dr. Carlos Silva' &&
        (p.status === 'Aprovado' || p.status === 'Em andamento'),
    );
  }

  // Busca o grupo de trabalho daquele projeto específico
  getWorkgroupForProject(projectId: string): Workgroup | undefined {
    return workgroups.find((w) => w.projectId === projectId);
  }

  viewProject(id: string) {
    this.router.navigate(['/requests', id]);
  }
}
