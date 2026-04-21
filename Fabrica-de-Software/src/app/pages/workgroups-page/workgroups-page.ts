import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GraduationCap, LucideAngularModule, Plus, UserCog, Users, X } from 'lucide-angular';
import { firstValueFrom } from 'rxjs';

import { PageHeader } from '../../components/page-header/page-header';
import { StatusBadge } from '../../components/status-badge/status-badge';
import {
  CreateWorkgroupPayload,
  ProfessorSummary,
  ProjectSummary,
  StudentSummary,
  WorkgroupSummary,
} from '../../core/models/api.models';
import { BackendApi } from '../../core/services/backend-api';

@Component({
  selector: 'app-workgroups-page',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule, PageHeader, StatusBadge],
  templateUrl: './workgroups-page.html',
})
export class WorkgroupsPage implements OnInit {
  private api = inject(BackendApi);

  readonly Plus = Plus;
  readonly Users = Users;
  readonly UserCog = UserCog;
  readonly GraduationCap = GraduationCap;
  readonly X = X;

  // Variáveis convertidas para Signals
  readonly workgroups = signal<WorkgroupSummary[]>([]);
  readonly activeProfessors = signal<ProfessorSummary[]>([]);
  readonly activeStudents = signal<StudentSummary[]>([]);
  readonly availableProjects = signal<ProjectSummary[]>([]);
  readonly selectedStudentIds = signal<string[]>([]);
  readonly isModalOpen = signal(false);
  readonly isLoading = signal(true);
  readonly isSubmitting = signal(false);
  readonly errorMessage = signal('');
  readonly successMessage = signal('');

  // Objeto mantido para facilitar o formulário
  form: CreateWorkgroupPayload = this.createEmptyForm();

  async ngOnInit() {
    await this.loadPageData();
  }

  async loadPageData() {
    this.isLoading.set(true);
    this.errorMessage.set('');

    try {
      const [workgroupsData, professorsData, studentsData, projectsData] = await Promise.all([
        firstValueFrom(this.api.listWorkgroups()),
        firstValueFrom(this.api.listProfessors()),
        firstValueFrom(this.api.listStudents()),
        firstValueFrom(this.api.listProjects()),
      ]);

      this.workgroups.set(workgroupsData);
      this.activeProfessors.set(professorsData.filter((item) => item.statusProfessor === 'ATIVO'));
      this.activeStudents.set(studentsData.filter((item) => item.statusAluno === 'ATIVO'));
      this.availableProjects.set(projectsData.filter((item) => item.statusProjeto === 'APROVADO'));
    } catch (error: unknown) {
      this.workgroups.set([]);
      this.activeProfessors.set([]);
      this.activeStudents.set([]);
      this.availableProjects.set([]);
      this.errorMessage.set(this.extractErrorMessage(error));
    } finally {
      this.isLoading.set(false);
    }
  }

  openModal() {
    this.form = this.createEmptyForm();
    this.selectedStudentIds.set([]);
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
    this.selectedStudentIds.set([]);
  }

  closeModal() {
    this.isModalOpen.set(false);
  }

  toggleStudent(studentId: string, checked: boolean) {
    if (checked) {
      this.selectedStudentIds.update((ids) => [...ids, studentId]);
    } else {
      this.selectedStudentIds.update((ids) => ids.filter((id) => id !== studentId));
    }
    this.form.alunosIds = this.selectedStudentIds();
  }

  async saveWorkgroup() {
    if (!this.form.projetoId) {
      this.errorMessage.set('Selecione um projeto.');
      return;
    }
    if (!this.form.professorCoordenadorId) {
      this.errorMessage.set('Selecione o professor coordenador.');
      return;
    }
    if (this.selectedStudentIds().length === 0) {
      this.errorMessage.set('Selecione ao menos um aluno para o grupo.');
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');
    this.form.alunosIds = this.selectedStudentIds();

    try {
      await firstValueFrom(this.api.createWorkgroup(this.form));
      this.successMessage.set('Grupo de trabalho criado com sucesso.');
      this.clearForm();
      this.closeModal();
      await this.loadPageData();
    } catch (error: unknown) {
      this.errorMessage.set(this.extractErrorMessage(error));
    } finally {
      this.isSubmitting.set(false);
    }
  }

  async deactivateGroup(id: string, currentStatus: string) {
    if (currentStatus === 'INATIVO') return;

    this.errorMessage.set('');
    this.successMessage.set('');

    try {
      await firstValueFrom(this.api.deactivateWorkgroup(id));
      this.successMessage.set('Grupo inativado com sucesso.');
      await this.loadPageData();
    } catch (error: unknown) {
      this.errorMessage.set(this.extractErrorMessage(error));
    }
  }

  private createEmptyForm(): CreateWorkgroupPayload {
    return {
      projetoId: '',
      professorCoordenadorId: '',
      alunosIds: [],
    };
  }

  private extractErrorMessage(error: unknown): string {
    if (error instanceof HttpErrorResponse) {
      const apiMessage = error.error?.message || error.error?.error;
      return apiMessage || 'Não foi possível comunicar com /api/grupos. Verifique login e senha.';
    }

    return 'Ocorreu um erro inesperado ao processar a operação.';
  }
}
