import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Eye, EyeOff, FolderKanban, LucideAngularModule } from 'lucide-angular';
import { firstValueFrom } from 'rxjs';

import { ButtonComponent } from '../../components/ui/button/button';
import { InputComponent } from '../../components/ui/input/input';
import { BackendApi } from '../../core/services/backend-api';
import { Auth } from '../../core/services/auth';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule, ButtonComponent, InputComponent],
  templateUrl: './login-page.html',
})
export class LoginPage {
  // Convertidos para Signals
  readonly login = signal('');
  readonly password = signal('');
  readonly showPassword = signal(false);
  readonly rememberMe = signal(true);
  readonly isLoading = signal(false);
  readonly errorMessage = signal('');

  readonly FolderKanban = FolderKanban;
  readonly Eye = Eye;
  readonly EyeOff = EyeOff;

  private router = inject(Router);
  private authService = inject(Auth);
  private api = inject(BackendApi);

  togglePassword() {
    this.showPassword.update((show) => !show);
  }

  async handleLogin(event: Event) {
    event.preventDefault();
    this.errorMessage.set('');

    const currentLogin = this.login().trim();
    const currentPassword = this.password().trim();

    if (!currentLogin || !currentPassword) {
      this.errorMessage.set('Informe login e senha para acessar o sistema.');
      return;
    }

    this.isLoading.set(true);
    this.authService.login({
      loginName: currentLogin,
      password: currentPassword,
      userName: currentLogin,
    });

    try {
      await firstValueFrom(this.api.listProjects());
      this.authService.setRole('admin', true);
      this.router.navigate(['/dashboard']);
    } catch (error: unknown) {
      if (error instanceof HttpErrorResponse) {
        if (error.status === 401) {
          this.authService.logout();
          this.errorMessage.set('Login ou senha inválidos.');
          return;
        }

        if (error.status === 0) {
          this.authService.logout();
          this.errorMessage.set(
            'Não foi possível conectar ao backend. Verifique se está ativo em http://localhost:8083.',
          );
          return;
        }

        // status 403 ou qualquer outro código: credenciais válidas, acesso restrito → professor
        this.authService.setRole('professor', true);
        this.router.navigate(['/dashboard']);
        return;
      }

      this.authService.logout();
      this.errorMessage.set(
        'Não foi possível conectar ao backend. Verifique se está ativo em http://localhost:8083.',
      );
    } finally {
      this.isLoading.set(false);
    }
  }
}
