import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

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
  @Input() status: string = '';

  get badgeClass(): string {
    const statusClasses: Record<string, string> = {
      'Em análise': 'status-analysis',
      Aprovado: 'status-approved',
      Rejeitado: 'status-rejected',
      Cancelado: 'status-cancelled',
      'Em andamento': 'status-approved',
      active: 'status-active',
      inactive: 'status-inactive',
    };

    const mappedClass = statusClasses[this.status] || 'status-badge bg-muted text-muted-foreground';
    // Garantimos que a classe base sempre seja aplicada junto com a cor
    return mappedClass.includes('status-badge') ? mappedClass : `status-badge ${mappedClass}`;
  }

  get displayStatus(): string {
    if (this.status === 'active') return 'Ativo';
    if (this.status === 'inactive') return 'Inativo';
    return this.status;
  }
}
