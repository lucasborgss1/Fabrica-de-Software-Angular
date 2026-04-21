import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Eye, LucideAngularModule, Plus, Search, X } from 'lucide-angular';
import { firstValueFrom } from 'rxjs';

import { PageHeader } from '../../components/page-header/page-header';
import { StatusBadge } from '../../components/status-badge/status-badge';
import {
  CreateProjectPayload,
  ProjectSummary,
  demandaOptions,
  formatApiDate,
} from '../../core/models/api.models';
import { BackendApi } from '../../core/services/backend-api';
import { Auth } from '../../core/services/auth';

@Component({
  selector: 'app-requests-page',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule, PageHeader, StatusBadge],
  templateUrl: './requests-page.html',
})
export class RequestsPage implements OnInit {
  public auth = inject(Auth);
  private router = inject(Router);
  private api = inject(BackendApi);

  readonly Plus = Plus;
  readonly Search = Search;
  readonly Eye = Eye;
  readonly X = X;
  readonly demandaOptions = demandaOptions;

  readonly searchQuery = signal('');
  readonly isNewRequestOpen = signal(false);
  readonly isLoading = signal(true);
  readonly isSubmitting = signal(false);
  readonly errorMessage = signal('');
  readonly formErrorMessage = signal('');
  readonly successMessage = signal('');
  readonly requestProfessorId = signal('');
  readonly allRequests = signal<ProjectSummary[]>([]);

  newRequest: CreateProjectPayload = this.createEmptyRequest();

  readonly filteredRequests = computed(() => {
    const query = this.searchQuery().toLowerCase();

    return this.allRequests()
      .filter((p) => this.auth.role() !== 'professor' || p.statusProjeto === 'SOLICITADO')
      .filter(
        (p) =>
          p.nome.toLowerCase().includes(query) ||
          p.nomeProfessorSolicitante.toLowerCase().includes(query),
      );
  });

  async ngOnInit() {
    await this.loadRequests();
  }

  async loadRequests() {
    this.isLoading.set(true);
    this.errorMessage.set('');

    const projectsRequest =
      this.auth.role() === 'professor' ? this.api.listMyProjects() : this.api.listProjects();

    try {
      this.allRequests.set(await firstValueFrom(projectsRequest));
    } catch (error: unknown) {
      this.allRequests.set([]);
    } finally {
      this.isLoading.set(false);
    }
  }

  viewDetails(project: ProjectSummary) {
    this.router.navigate(['/requests', project.id], { state: { project } });
  }

  openNewRequest() {
    this.newRequest = this.createEmptyRequest();
    this.requestProfessorId.set(this.auth.professorId());
    this.successMessage.set('');
    this.formErrorMessage.set('');
    this.isNewRequestOpen.set(true);
  }

  closeNewRequest() {
    this.isNewRequestOpen.set(false);
  }

  resetFormErrors() {
    this.formErrorMessage.set('');
    this.successMessage.set('');
  }

  clearForm() {
    this.newRequest = this.createEmptyRequest();
  }

  async submitNewRequest() {
    const r = this.newRequest;
    if (!r.nome.trim()) {
      this.formErrorMessage.set('O campo "Nome do projeto" é obrigatório.');
      return;
    }
    if (r.nome.trim().length < 3) {
      this.formErrorMessage.set('O campo "Nome do projeto" deve ter pelo menos 3 caracteres.');
      return;
    }
    if (!r.objetivo.trim()) {
      this.formErrorMessage.set('O campo "Objetivo" é obrigatório.');
      return;
    }
    if (r.objetivo.trim().length < 10) {
      this.formErrorMessage.set('O campo "Objetivo" deve ter pelo menos 10 caracteres.');
      return;
    }
    if (!r.quemIraUtilizar.trim()) {
      this.formErrorMessage.set('O campo "Quem irá utilizar" é obrigatório.');
      return;
    }
    if (!r.publicoAlvo.trim()) {
      this.formErrorMessage.set('O campo "Público-alvo" é obrigatório.');
      return;
    }
    if (!r.localUso.trim()) {
      this.formErrorMessage.set('O campo "Local de uso" é obrigatório.');
      return;
    }
    if (!r.dataInicioEstimativa) {
      this.formErrorMessage.set('A "Data estimada de início" é obrigatória.');
      return;
    }
    if (isNaN(new Date(r.dataInicioEstimativa).getTime())) {
      this.formErrorMessage.set('A "Data estimada de início" informada é inválida.');
      return;
    }
    if (!r.escopo.trim()) {
      this.formErrorMessage.set('O campo "Escopo" é obrigatório.');
      return;
    }
    if (r.escopo.trim().length < 10) {
      this.formErrorMessage.set('O campo "Escopo" deve ter pelo menos 10 caracteres.');
      return;
    }

    const professorId = this.auth.professorId() || this.requestProfessorId().trim();

    this.isSubmitting.set(true);
    this.formErrorMessage.set('');
    this.successMessage.set('');
    this.auth.setProfessorId(professorId);

    try {
      await firstValueFrom(this.api.requestProject(this.newRequest));
      this.successMessage.set('Solicitação enviada com sucesso.');
      this.clearForm();
      this.closeNewRequest();
      await this.loadRequests();
    } catch (error: unknown) {
      this.formErrorMessage.set(this.extractSubmitErrorMessage(error));
    } finally {
      this.isSubmitting.set(false);
    }
  }

  formatDate(date: string | null) {
    return formatApiDate(date);
  }

  private createEmptyRequest(): CreateProjectPayload {
    return {
      nome: '',
      objetivo: '',
      quemIraUtilizar: '',
      localUso: '',
      publicoAlvo: '',
      demanda: 'INTERNA',
      dataInicioEstimativa: '',
      escopo: '',
    };
  }

  private extractSubmitErrorMessage(error: unknown): string {
    if (error instanceof HttpErrorResponse) {
      const apiMessage = error.error?.message || error.error?.error;
      return apiMessage || `Não foi possível enviar a solicitação. Código: ${error.status}.`;
    }

    return 'Ocorreu um erro inesperado ao enviar a solicitação.';
  }
}
