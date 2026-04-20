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

// Importação dos seus componentes de layout e UI
import { PageHeader } from '../../components/page-header/page-header';
import { StatusBadge } from '../../components/status-badge/status-badge';

// Importação dos mocks
import { students as mockStudents, Student } from '../../lib/mock-data';

@Component({
  selector: 'app-students-page',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule, PageHeader, StatusBadge],
  templateUrl: './students-page.html',
})
export class StudentsPage {
  // Inicialização dos Ícones
  readonly Plus = Plus;
  readonly Search = Search;
  readonly Pencil = Pencil;
  readonly ToggleLeft = ToggleLeft;
  readonly ToggleRight = ToggleRight;
  readonly X = X;

  // Estado
  data: Student[] = [...mockStudents]; // Cópia para podermos editar/alterar status
  searchQuery: string = '';
  isModalOpen: boolean = false;
  editing: Student | null = null;

  // Filtro dinâmico equivalente ao `const filtered = ...` do React
  get filteredStudents() {
    const query = this.searchQuery.toLowerCase();
    return this.data.filter(
      (s) => s.name.toLowerCase().includes(query) || s.course.toLowerCase().includes(query),
    );
  }

  openModal(student?: Student) {
    this.editing = student || null;
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.editing = null;
  }

  toggleStatus(id: string) {
    this.data = this.data.map((s) => {
      if (s.id === id) {
        return { ...s, status: s.status === 'active' ? 'inactive' : 'active' };
      }
      return s;
    });
  }
}
