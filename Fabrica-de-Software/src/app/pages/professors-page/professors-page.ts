import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Plus, Search, ToggleLeft, ToggleRight, X } from 'lucide-angular';
import { firstValueFrom } from 'rxjs';

import { PageHeader } from '../../components/page-header/page-header';
import { StatusBadge } from '../../components/status-badge/status-badge';
import { CreateProfessorPayload, ProfessorSummary } from '../../core/models/api.models';
import { BackendApi } from '../../core/services/backend-api';

@Component({
  selector: 'app-professors-page',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule, PageHeader, StatusBadge],
  templateUrl: './professors-page.html',
})
export class ProfessorsPage implements OnInit {
  private api = inject(BackendApi);

  readonly Plus = Plus;
  readonly Search = Search;
  readonly ToggleLeft = ToggleLeft;
  readonly ToggleRight = ToggleRight;
  readonly X = X;

  readonly data = signal<ProfessorSummary[]>([]);
  readonly searchQuery = signal('');
  readonly isModalOpen = signal(false);
  readonly isLoading = signal(true);
  readonly isSubmitting = signal(false);
  readonly errorMessage = signal('');
  readonly successMessage = signal('');
  form: CreateProfessorPayload = this.createEmptyForm();

  readonly filteredProfessors = computed(() => {
    const query = this.searchQuery().toLowerCase();

    return this.data().filter(
      (professor) =>
        professor.nome.toLowerCase().includes(query) ||
        professor.matricula.toLowerCase().includes(query) ||
        professor.escola.toLowerCase().includes(query),
    );
  });

  async ngOnInit() {
    await this.loadProfessors();
  }

  async loadProfessors() {
    this.isLoading.set(true);
    this.errorMessage.set('');

    try {
      this.data.set(await firstValueFrom(this.api.listProfessors()));
    } catch (error: unknown) {
      this.data.set([]);
      this.errorMessage.set(this.extractErrorMessage(error));
    } finally {
      this.isLoading.set(false);
    }
  }

  openModal() {
    this.form = this.createEmptyForm();
    this.errorMessage.set('');
    this.successMessage.set('');
    this.isModalOpen.set(true);
  }

  resetFormErrors() {
    this.errorMessage.set('');
    this.successMessage.set('');
  }

  clearForm() {
    this.form = this.createEmptyForm();
  }

  closeModal() {
    this.isModalOpen.set(false);
  }

  async saveProfessor() {
    const f = this.form;
    if (!f.nome.trim()) {
      this.errorMessage.set('O campo "Nome completo" é obrigatório.');
      return;
    }
    if (f.nome.trim().length < 3) {
      this.errorMessage.set('O campo "Nome completo" deve ter pelo menos 3 caracteres.');
      return;
    }
    if (!f.matricula.trim()) {
      this.errorMessage.set('O campo "Matrícula" é obrigatório.');
      return;
    }
    if (!/^[A-Za-z0-9]+$/.test(f.matricula.trim())) {
      this.errorMessage.set(
        'A "Matrícula" deve conter apenas letras e números, sem espaços ou caracteres especiais.',
      );
      return;
    }
    if (!f.escola.trim()) {
      this.errorMessage.set('O campo "Escola" é obrigatório.');
      return;
    }
    if (!f.email.trim()) {
      this.errorMessage.set('O campo "E-mail" é obrigatório.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.trim())) {
      this.errorMessage.set('Informe um endereço de e-mail válido (exemplo: nome@dominio.com).');
      return;
    }
    if (f.whatsapp.trim() && !/^\+?[\d\s\-()+]{8,20}$/.test(f.whatsapp.trim())) {
      this.errorMessage.set(
        'O campo "WhatsApp" deve conter apenas dígitos, espaços e os caracteres + ( ) -.',
      );
      return;
    }
    if (f.telefoneContato.trim() && !/^\+?[\d\s\-()+]{8,20}$/.test(f.telefoneContato.trim())) {
      this.errorMessage.set(
        'O campo "Telefone" deve conter apenas dígitos, espaços e os caracteres + ( ) -.',
      );
      return;
    }
    if (!f.senha.trim()) {
      this.errorMessage.set('O campo "Senha" é obrigatório.');
      return;
    }
    if (f.senha.trim().length < 6) {
      this.errorMessage.set('A "Senha" deve ter pelo menos 6 caracteres.');
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    try {
      await firstValueFrom(this.api.createProfessor(this.form));
      this.successMessage.set('Professor cadastrado com sucesso.');
      this.clearForm();
      this.closeModal();
      await this.loadProfessors();
    } catch (error: unknown) {
      this.errorMessage.set(this.extractErrorMessage(error));
    } finally {
      this.isSubmitting.set(false);
    }
  }

  async toggleStatus(id: string, currentStatus: string) {
    if (currentStatus === 'INATIVO') {
      return;
    }

    this.errorMessage.set('');
    this.successMessage.set('');

    try {
      await firstValueFrom(this.api.deactivateProfessor(id));
      this.successMessage.set('Professor inativado com sucesso.');
      await this.loadProfessors();
    } catch (error: unknown) {
      this.errorMessage.set(this.extractErrorMessage(error));
    }
  }

  private createEmptyForm(): CreateProfessorPayload {
    return {
      nome: '',
      matricula: '',
      email: '',
      whatsapp: '',
      telefoneContato: '',
      escola: '',
      senha: '',
    };
  }

  private extractErrorMessage(error: unknown): string {
    if (error instanceof HttpErrorResponse) {
      const apiMessage = error.error?.message || error.error?.error;
      return (
        apiMessage || 'Não foi possível comunicar com /api/professores. Verifique login e senha.'
      );
    }

    return 'Ocorreu um erro inesperado ao processar a operação.';
  }
}
