import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Plus, Search, ToggleLeft, ToggleRight, X } from 'lucide-angular';
import { firstValueFrom } from 'rxjs';

import { PageHeader } from '../../components/page-header/page-header';
import { StatusBadge } from '../../components/status-badge/status-badge';
import {
  AreaInteresse,
  CreateStudentPayload,
  StudentSummary,
  areaInteresseOptions,
  turnoOptions,
} from '../../core/models/api.models';
import { BackendApi } from '../../core/services/backend-api';

interface StudentFormValue {
  nome: string;
  matricula: string;
  emailContato: string;
  whatsapp: string;
  curso: string;
  turno: 'MATUTINO' | 'VESPERTINO' | 'NOTURNO';
  dataSelecao: string;
  linkLinkedin: string;
  linkGithub: string;
  disciplinasCursadas: string;
  areasDeInteresse: AreaInteresse[];
  horasSemanais: number;
  senha: string;
}

@Component({
  selector: 'app-students-page',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule, PageHeader, StatusBadge],
  templateUrl: './students-page.html',
})
export class StudentsPage implements OnInit {
  private api = inject(BackendApi);

  readonly Plus = Plus;
  readonly Search = Search;
  readonly ToggleLeft = ToggleLeft;
  readonly ToggleRight = ToggleRight;
  readonly X = X;
  readonly areaInteresseOptions = areaInteresseOptions;
  readonly turnoOptions = turnoOptions;

  // Variáveis convertidas para Signals
  readonly data = signal<StudentSummary[]>([]);
  readonly searchQuery = signal('');
  readonly isModalOpen = signal(false);
  readonly isLoading = signal(true);
  readonly isSubmitting = signal(false);
  readonly errorMessage = signal('');
  readonly successMessage = signal('');

  // Mantido como objeto comum para o [(ngModel)] do formulário
  form: StudentFormValue = this.createEmptyForm();

  // Convertido para computed (só recalcula quando data ou searchQuery mudarem)
  readonly filteredStudents = computed(() => {
    const query = this.searchQuery().toLowerCase();

    return this.data().filter(
      (student) =>
        student.nome.toLowerCase().includes(query) ||
        student.curso.toLowerCase().includes(query) ||
        student.matricula.toLowerCase().includes(query) ||
        student.emailContato.toLowerCase().includes(query),
    );
  });

  async ngOnInit() {
    await this.loadStudents();
  }

  async loadStudents() {
    this.isLoading.set(true);
    this.errorMessage.set('');

    try {
      this.data.set(await firstValueFrom(this.api.listStudents()));
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

  toggleArea(area: AreaInteresse, checked: boolean) {
    if (checked) {
      this.form.areasDeInteresse = [...this.form.areasDeInteresse, area];
      return;
    }

    this.form.areasDeInteresse = this.form.areasDeInteresse.filter((item) => item !== area);
  }

  async saveStudent() {
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
    if (!f.emailContato.trim()) {
      this.errorMessage.set('O campo "E-mail" é obrigatório.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.emailContato.trim())) {
      this.errorMessage.set('Informe um endereço de e-mail válido (exemplo: nome@dominio.com).');
      return;
    }
    if (f.whatsapp.trim() && !/^\+?[\d\s\-()+]{8,20}$/.test(f.whatsapp.trim())) {
      this.errorMessage.set(
        'O campo "WhatsApp" deve conter apenas dígitos, espaços e os caracteres + ( ) -.',
      );
      return;
    }
    if (!f.curso.trim()) {
      this.errorMessage.set('O campo "Curso" é obrigatório.');
      return;
    }
    if (f.dataSelecao && isNaN(new Date(f.dataSelecao).getTime())) {
      this.errorMessage.set('A "Data de seleção" informada não é uma data válida.');
      return;
    }
    if (f.linkLinkedin.trim() && !/^https?:\/\/.+/.test(f.linkLinkedin.trim())) {
      this.errorMessage.set(
        'O "Link do LinkedIn" deve ser uma URL válida iniciando com http:// ou https://.',
      );
      return;
    }
    if (f.linkGithub.trim() && !/^https?:\/\/.+/.test(f.linkGithub.trim())) {
      this.errorMessage.set(
        'O "Link do GitHub" deve ser uma URL válida iniciando com http:// ou https://.',
      );
      return;
    }
    if (
      !Number.isInteger(Number(f.horasSemanais)) ||
      Number(f.horasSemanais) < 1 ||
      Number(f.horasSemanais) > 40
    ) {
      this.errorMessage.set('O campo "Horas semanais" deve ser um número inteiro entre 1 e 40.');
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
      const payload: CreateStudentPayload = {
        ...this.form,
        dataSelecao: new Date(this.form.dataSelecao || new Date().toISOString()).toISOString(),
        disciplinasCursadas: this.form.disciplinasCursadas
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean),
      };

      await firstValueFrom(this.api.createStudent(payload));
      this.successMessage.set('Aluno cadastrado com sucesso.');
      this.clearForm();
      this.closeModal();
      await this.loadStudents();
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
      await firstValueFrom(this.api.deactivateStudent(id));
      this.successMessage.set('Aluno inativado com sucesso.');
      await this.loadStudents();
    } catch (error: unknown) {
      this.errorMessage.set(this.extractErrorMessage(error));
    }
  }

  private createEmptyForm(): StudentFormValue {
    return {
      nome: '',
      matricula: '',
      emailContato: '',
      whatsapp: '',
      curso: '',
      turno: 'MATUTINO',
      dataSelecao: '',
      linkLinkedin: '',
      linkGithub: '',
      disciplinasCursadas: '',
      areasDeInteresse: [],
      horasSemanais: 20,
      senha: '',
    };
  }

  private extractErrorMessage(error: unknown): string {
    if (error instanceof HttpErrorResponse) {
      const apiMessage = error.error?.message || error.error?.error;
      return apiMessage || 'Não foi possível comunicar com /api/alunos. Verifique login e senha.';
    }

    return 'Ocorreu um erro inesperado ao processar a operação.';
  }

  formatArea(area: string): string {
    const labels: Record<string, string> = {
      DESENVOLVIMENTO_BACK_END: 'Back-end',
      DESENVOLVIMENTO_FRONT_END: 'Front-end',
      UI_UX: 'UI/UX',
    };
    return labels[area] ?? area;
  }
}
