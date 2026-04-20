import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LucideAngularModule, Plus, Search, Eye, X } from 'lucide-angular';

import { PageHeader } from '../../components/page-header/page-header';
import { StatusBadge } from '../../components/status-badge/status-badge';
import { Auth } from '../../core/services/auth';
import { projectRequests as mockRequests, ProjectRequest } from '../../lib/mock-data';

@Component({
  selector: 'app-requests-page',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule, PageHeader, StatusBadge],
  templateUrl: './requests-page.html',
})
export class RequestsPage {
  public auth = inject(Auth);
  private router = inject(Router);

  // Ícones
  readonly Plus = Plus;
  readonly Search = Search;
  readonly Eye = Eye;
  readonly X = X;

  // Estado
  searchQuery = '';
  isNewRequestOpen = false;
  allRequests: ProjectRequest[] = [...mockRequests];

  // Filtra as solicitações pela Role (Professor vê só as dele, Admin vê todas)
  get roleBasedRequests() {
    if (this.auth.role() === 'professor') {
      // Mock: Fixado no nome do professor logado para o exemplo
      return this.allRequests.filter((p) => p.professor === 'Dr. Carlos Silva');
    }
    return this.allRequests;
  }

  // Aplica o filtro de busca textual
  get filteredRequests() {
    const query = this.searchQuery.toLowerCase();
    return this.roleBasedRequests.filter((p) => p.name.toLowerCase().includes(query));
  }

  // Navegação
  viewDetails(id: string) {
    this.router.navigate(['/requests', id]);
  }

  // Controles do Modal
  openNewRequest() {
    this.isNewRequestOpen = true;
  }

  closeNewRequest() {
    this.isNewRequestOpen = false;
  }
}
