import { Component, Input, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true,
    },
  ],
  template: `
    <input
      [id]="id"
      [type]="type"
      [placeholder]="placeholder"
      [disabled]="disabled"
      [ngClass]="
        'flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ' +
        className
      "
      [(ngModel)]="value"
      (ngModelChange)="onChange($event)"
      (blur)="onTouched()"
    />
  `,
})
export class InputComponent implements ControlValueAccessor {
  @Input() id = '';
  @Input() type = 'text';
  @Input() placeholder = '';
  @Input() className = '';
  @Input() disabled = false;

  value: string = '';

  // Funções de callback exigidas pelo ControlValueAccessor
  onChange: any = () => {};
  onTouched: any = () => {};

  // Chamado pelo Angular quando o valor muda externamente
  writeValue(value: any): void {
    if (value !== undefined) {
      this.value = value;
    }
  }

  // Registra a função de mudança
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  // Registra a função de blur (toque)
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  // Desabilita o input dinamicamente
  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
