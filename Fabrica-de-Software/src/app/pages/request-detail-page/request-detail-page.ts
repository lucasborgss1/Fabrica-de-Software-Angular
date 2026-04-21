import { CommonModule, Location } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  ArrowLeft,
  Ban,
  Calendar,
  CheckCircle2,
  FileText,
  LucideAngularModule,
  Target,
  Users,
  XCircle,
} from 'lucide-angular';
import { firstValueFrom } from 'rxjs';

import { StatusBadge } from '../../components/status-badge/status-badge';
import { ProjectSummary, WorkgroupSummary, formatApiDate } from '../../core/models/api.models';
import { BackendApi } from '../../core/services/backend-api';
import { Auth } from '../../core/services/auth';

@Component({
  selector: 'app-request-detail-page',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, StatusBadge],
  templateUrl: './request-detail-page.html',
})
export class RequestDetailPage implements OnInit {
  private route = inject(ActivatedRoute);
  private location = inject(Location);
  private api = inject(BackendApi);
  public auth = inject(Auth);

  readonly ArrowLeft = ArrowLeft;
  readonly CheckCircle2 = CheckCircle2;
  readonly XCircle = XCircle;
  readonly Ban = Ban;
  readonly Calendar = Calendar;
  readonly Users = Users;
  readonly Target = Target;
  readonly FileText = FileText;

  readonly project = signal<ProjectSummary | undefined>(undefined);
  readonly group = signal<WorkgroupSummary | undefined>(undefined);
  readonly isLoading = signal(true);
  readonly isProcessing = signal(false);
  readonly errorMessage = signal('');
  readonly successMessage = signal('');

  readonly canAnalyze = computed(() => this.project()?.statusProjeto === 'SOLICITADO');
  readonly canApprove = computed(() => {
    const s = this.project()?.statusProjeto;
    return s === 'SOLICITADO' || s === 'EM_ANALISE';
  });
  readonly canCancel = computed(() => {
    const s = this.project()?.statusProjeto;
    return s === 'SOLICITADO' || s === 'EM_ANALISE';
  });

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    const navigationProject = history.state?.project as ProjectSummary | undefined;

    if (navigationProject?.id) {
      this.project.set(navigationProject);
    }

    if (!id) {
      this.isLoading.set(false);
      return;
    }

    await this.loadProject(id);
  }

  async loadProject(id: string) {
    this.isLoading.set(true);
    this.errorMessage.set('');

    try {
      const projects = await firstValueFrom(this.api.listProjects());
      this.project.set(projects.find((item) => item.id === id) ?? this.project());

      if (this.project()) {
        const groups = await firstValueFrom(this.api.listWorkgroups()).catch(
          () => [] as WorkgroupSummary[],
        );
        this.group.set(groups.find((item) => item.nomeProjeto === this.project()?.nome));
      }
    } catch {
      if (!this.project()) {
        this.errorMessage.set(
          'Não foi possível carregar o detalhe da solicitação. Verifique login, senha e as permissões da API.',
        );
      }
    } finally {
      this.isLoading.set(false);
    }
  }

  async analyzeProject() {
    const currentProject = this.project();
    if (!currentProject) return;

    this.isProcessing.set(true);
    this.successMessage.set('');
    this.errorMessage.set('');

    try {
      const updated = await firstValueFrom(this.api.analyzeProject(currentProject.id));
      this.project.set(updated);
      this.successMessage.set('Projeto colocado em análise com sucesso.');
    } catch {
      this.errorMessage.set('Não foi possível atualizar o status para EM_ANALISE.');
    } finally {
      this.isProcessing.set(false);
    }
  }

  async approveProject() {
    const currentProject = this.project();
    if (!currentProject) return;

    this.isProcessing.set(true);
    this.successMessage.set('');
    this.errorMessage.set('');

    try {
      const updated = await firstValueFrom(this.api.approveProject(currentProject.id));
      this.project.set(updated);
      this.successMessage.set('Projeto aprovado com sucesso.');
    } catch {
      this.errorMessage.set('Não foi possível aprovar o projeto.');
    } finally {
      this.isProcessing.set(false);
    }
  }

  async cancelProject() {
    const currentProject = this.project();
    if (!currentProject) return;

    this.isProcessing.set(true);
    this.successMessage.set('');
    this.errorMessage.set('');

    try {
      const updated = await firstValueFrom(this.api.cancelProject(currentProject.id));
      this.project.set(updated);
      this.successMessage.set('Projeto cancelado com sucesso.');
    } catch {
      this.errorMessage.set('Não foi possível cancelar o projeto.');
    } finally {
      this.isProcessing.set(false);
    }
  }

  formatDate(date: string | null) {
    return formatApiDate(date);
  }

  goBack() {
    this.location.back();
  }
}
