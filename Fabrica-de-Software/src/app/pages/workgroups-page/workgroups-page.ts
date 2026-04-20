import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Plus, Users, UserCog, GraduationCap, X } from 'lucide-angular';

import { PageHeader } from '../../components/page-header/page-header';
import {
  workgroups as mockWorkgroups,
  professors,
  students as allStudents,
} from '../../lib/mock-data';

@Component({
  selector: 'app-workgroups-page',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule, PageHeader],
  templateUrl: './workgroups-page.html',
})
export class WorkgroupsPage {
  // Ícones
  readonly Plus = Plus;
  readonly Users = Users;
  readonly UserCog = UserCog;
  readonly GraduationCap = GraduationCap;
  readonly X = X;

  // Estado da tela principal
  workgroups = [...mockWorkgroups];

  // Opções para o Modal (apenas usuários ativos)
  activeProfessors = professors.filter((p) => p.status === 'active');
  activeStudents = allStudents.filter((s) => s.status === 'active');

  // Controle do Modal
  isModalOpen = false;

  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }
}
