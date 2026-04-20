import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-page-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <div>
        <h1 class="text-2xl font-bold tracking-tight">{{ title }}</h1>
        <p *ngIf="description" class="text-muted-foreground mt-1">{{ description }}</p>
      </div>
      <div>
        <ng-content></ng-content>
      </div>
    </div>
  `,
})
export class PageHeader {
  @Input() title: string = '';
  @Input() description?: string;
}
