import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  LucideAngularModule,
  Plus,
  Search,
  Pencil,
  ToggleLeft,
  ToggleRight,
  X,
} from 'lucide-angular';

import { PageHeader } from '../../components/page-header/page-header';
import { StatusBadge } from '../../components/status-badge/status-badge';
import { professors as mockProfessors, Professor } from '../../lib/mock-data';

@Component({
  selector: 'app-professors-page',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule, PageHeader, StatusBadge],
  templateUrl: './professors-page.html',
})
export class ProfessorsPage {
  // Ícones
  readonly Plus = Plus;
  readonly Search = Search;
  readonly Pencil = Pencil;
  readonly ToggleLeft = ToggleLeft;
  readonly ToggleRight = ToggleRight;
  readonly X = X;

  // Estado da Página
  data: Professor[] = [...mockProfessors];
  searchQuery: string = '';
  isModalOpen: boolean = false;
  editing: Professor | null = null;

  // Filtro Dinâmico
  get filteredProfessors() {
    const query = this.searchQuery.toLowerCase();
    return this.data.filter(
      (p) => p.name.toLowerCase().includes(query) || p.email.toLowerCase().includes(query),
    );
  }

  // Controles do Modal
  openModal(professor?: Professor) {
    this.editing = professor || null;
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.editing = null;
  }

  // Controle de Status
  toggleStatus(id: string) {
    this.data = this.data.map((p) => {
      if (p.id === id) {
        return { ...p, status: p.status === 'active' ? 'inactive' : 'active' };
      }
      return p;
    });
  }
}
