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
  readonly successMessage = signal('');
  readonly requestProfessorId = signal('');
  readonly allRequests = signal<ProjectSummary[]>([]);

  newRequest: CreateProjectPayload = this.createEmptyRequest();

  readonly roleBasedRequests = computed(() => {
    if (this.auth.role() !== 'professor') {
      return this.allRequests();
    }

    const userName = this.auth.userName().trim().toLowerCase();

    if (!userName || userName === 'usuário') {
      return this.allRequests();
    }

    return this.allRequests().filter((p) =>
      p.nomeProfessorSolicitante.toLowerCase().includes(userName),
    );
  });

  readonly filteredRequests = computed(() => {
    const query = this.searchQuery().toLowerCase();

    return this.roleBasedRequests().filter(
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

    try {
      this.allRequests.set(await firstValueFrom(this.api.listProjects()));
    } catch (error: unknown) {
      this.allRequests.set([]);

      if (
        error instanceof HttpErrorResponse &&
        (error.status === 500 || error.status === 403) &&
        this.auth.role() === 'professor'
      ) {
        this.errorMessage.set(
          'A documentação informa que a listagem completa de projetos é restrita ao perfil ADMIN. O envio de novas solicitações continua disponível para PROFESSOR.',
        );
      } else {
        this.errorMessage.set(this.extractErrorMessage(error));
      }
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
    this.errorMessage.set('');
    this.isNewRequestOpen.set(true);
  }

  closeNewRequest() {
    this.isNewRequestOpen.set(false);
  }

  resetFormErrors() {
    this.errorMessage.set('');
    this.successMessage.set('');
  }

  clearForm() {
    this.newRequest = this.createEmptyRequest();
  }

  async submitNewRequest() {
    const r = this.newRequest;
    if (!r.nome.trim()) {
      this.errorMessage.set('O campo "Nome do projeto" é obrigatório.');
      return;
    }
    if (r.nome.trim().length < 3) {
      this.errorMessage.set('O campo "Nome do projeto" deve ter pelo menos 3 caracteres.');
      return;
    }
    if (!r.objetivo.trim()) {
      this.errorMessage.set('O campo "Objetivo" é obrigatório.');
      return;
    }
    if (r.objetivo.trim().length < 10) {
      this.errorMessage.set('O campo "Objetivo" deve ter pelo menos 10 caracteres.');
      return;
    }
    if (!r.quemIraUtilizar.trim()) {
      this.errorMessage.set('O campo "Quem irá utilizar" é obrigatório.');
      return;
    }
    if (!r.publicoAlvo.trim()) {
      this.errorMessage.set('O campo "Público-alvo" é obrigatório.');
      return;
    }
    if (!r.localUso.trim()) {
      this.errorMessage.set('O campo "Local de uso" é obrigatório.');
      return;
    }
    if (!r.dataInicioEstimativa) {
      this.errorMessage.set('A "Data estimada de início" é obrigatória.');
      return;
    }
    if (isNaN(new Date(r.dataInicioEstimativa).getTime())) {
      this.errorMessage.set('A "Data estimada de início" informada é inválida.');
      return;
    }
    if (!r.escopo.trim()) {
      this.errorMessage.set('O campo "Escopo" é obrigatório.');
      return;
    }
    if (r.escopo.trim().length < 10) {
      this.errorMessage.set('O campo "Escopo" deve ter pelo menos 10 caracteres.');
      return;
    }

    const professorId = this.auth.professorId() || this.requestProfessorId().trim();

    if (!professorId) {
      this.errorMessage.set(
        'Informe o ID do professor no formulário para enviar a solicitação ao endpoint de projetos.',
      );
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');
    this.auth.setProfessorId(professorId);

    try {
      await firstValueFrom(this.api.requestProject(professorId, this.newRequest));
      this.successMessage.set('Solicitação enviada com sucesso.');
      this.clearForm();
      this.closeNewRequest();
      await this.loadRequests();
    } catch (error: unknown) {
      this.errorMessage.set(this.extractErrorMessage(error));
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

  private extractErrorMessage(error: unknown): string {
    if (error instanceof HttpErrorResponse) {
      const apiMessage = error.error?.message || error.error?.error;
      return (
        apiMessage ||
        'Não foi possível carregar os dados da API. Verifique login, senha e o backend em http://localhost:8083.'
      );
    }

    return 'Ocorreu um erro inesperado ao comunicar com o backend.';
  }
}
