import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

import { formatApiStatus } from '../../core/models/api.models';

@Component({
  selector: 'app-status-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span [class]="badgeClass">
      {{ displayStatus }}
    </span>
  `,
})
export class StatusBadge {
  @Input() status = '';

  get badgeClass(): string {
    const statusClasses: Record<string, string> = {
      SOLICITADO: 'status-analysis',
      EM_ANALISE: 'status-analysis',
      APROVADO: 'status-approved',
      FINALIZADO: 'status-approved',
      NAO_APROVADO: 'status-rejected',
      ATIVO: 'status-active',
      INATIVO: 'status-inactive',
      active: 'status-active',
      inactive: 'status-inactive',
    };

    const mappedClass = statusClasses[this.status] || 'status-badge bg-muted text-muted-foreground';
    return mappedClass.includes('status-badge') ? mappedClass : `status-badge ${mappedClass}`;
  }

  get displayStatus(): string {
    return formatApiStatus(this.status);
  }
}
