import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import {
  CreateProfessorPayload,
  CreateProjectPayload,
  CreateStudentPayload,
  CreateWorkgroupPayload,
  ProfessorSummary,
  ProjectSummary,
  StudentSummary,
  WorkgroupSummary,
} from '../models/api.models';
import { Auth } from './auth';

@Injectable({
  providedIn: 'root',
})
export class BackendApi {
  private readonly http = inject(HttpClient);
  private readonly auth = inject(Auth);
  private readonly baseUrl = 'http://localhost:8083';

  private getHttpOptions() {
    const authorizationValue = this.auth.token();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      ...(authorizationValue ? { Authorization: authorizationValue } : {}),
    });

    return { headers };
  }

  listStudents(): Observable<StudentSummary[]> {
    return this.http.get<StudentSummary[]>(`${this.baseUrl}/api/alunos`, this.getHttpOptions());
  }

  createStudent(payload: CreateStudentPayload): Observable<StudentSummary> {
    return this.http.post<StudentSummary>(
      `${this.baseUrl}/api/alunos`,
      payload,
      this.getHttpOptions(),
    );
  }

  deactivateStudent(id: string): Observable<StudentSummary> {
    return this.http.delete<StudentSummary>(
      `${this.baseUrl}/api/alunos/${id}`,
      this.getHttpOptions(),
    );
  }

  listProfessors(): Observable<ProfessorSummary[]> {
    return this.http.get<ProfessorSummary[]>(
      `${this.baseUrl}/api/professores`,
      this.getHttpOptions(),
    );
  }

  createProfessor(payload: CreateProfessorPayload): Observable<ProfessorSummary> {
    return this.http.post<ProfessorSummary>(
      `${this.baseUrl}/api/professores`,
      payload,
      this.getHttpOptions(),
    );
  }

  deactivateProfessor(id: string): Observable<ProfessorSummary> {
    return this.http.delete<ProfessorSummary>(
      `${this.baseUrl}/api/professores/${id}`,
      this.getHttpOptions(),
    );
  }

  listProjects(): Observable<ProjectSummary[]> {
    return this.http.get<ProjectSummary[]>(`${this.baseUrl}/api/projetos`, this.getHttpOptions());
  }

  listDeniedProjects(): Observable<ProjectSummary[]> {
    return this.http.get<ProjectSummary[]>(
      `${this.baseUrl}/api/projetos/negados`,
      this.getHttpOptions(),
    );
  }

  listMyProjects(): Observable<ProjectSummary[]> {
    return this.http.get<ProjectSummary[]>(
      `${this.baseUrl}/api/projetos/meus-projetos`,
      this.getHttpOptions(),
    );
  }

  requestProject(payload: CreateProjectPayload): Observable<ProjectSummary> {
    return this.http.post<ProjectSummary>(
      `${this.baseUrl}/api/projetos/solicitar`,
      payload,
      this.getHttpOptions(),
    );
  }

  analyzeProject(id: string): Observable<ProjectSummary> {
    return this.http.patch<ProjectSummary>(
      `${this.baseUrl}/api/projetos/${id}/analisar`,
      {},
      this.getHttpOptions(),
    );
  }

  approveProject(id: string): Observable<ProjectSummary> {
    return this.http.patch<ProjectSummary>(
      `${this.baseUrl}/api/projetos/${id}/aprovar`,
      {},
      this.getHttpOptions(),
    );
  }

  cancelProject(id: string): Observable<ProjectSummary> {
    return this.http.patch<ProjectSummary>(
      `${this.baseUrl}/api/projetos/${id}/cancelar`,
      {},
      this.getHttpOptions(),
    );
  }

  listWorkgroups(): Observable<WorkgroupSummary[]> {
    return this.http.get<WorkgroupSummary[]>(`${this.baseUrl}/api/grupos`, this.getHttpOptions());
  }

  createWorkgroup(payload: CreateWorkgroupPayload): Observable<WorkgroupSummary> {
    return this.http.post<WorkgroupSummary>(
      `${this.baseUrl}/api/grupos`,
      payload,
      this.getHttpOptions(),
    );
  }

  deactivateWorkgroup(id: string): Observable<WorkgroupSummary> {
    return this.http.delete<WorkgroupSummary>(
      `${this.baseUrl}/api/grupos/${id}`,
      this.getHttpOptions(),
    );
  }
}
