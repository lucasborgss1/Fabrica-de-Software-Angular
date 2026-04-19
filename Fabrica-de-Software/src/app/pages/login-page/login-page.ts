import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LucideAngularModule, FolderKanban, Eye, EyeOff } from 'lucide-angular';
import { Auth } from '../../core/services/auth';
import { ButtonComponent } from '../../components/ui/button/button';
import { InputComponent } from '../../components/ui/input/input';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule, ButtonComponent, InputComponent],
  templateUrl: './login-page.html',
})
export class LoginPage {
  email = '';
  password = '';
  showPassword = false;
  rememberMe = false;
  isLoading = false;

  readonly FolderKanban = FolderKanban;
  readonly Eye = Eye;
  readonly EyeOff = EyeOff;

  private router = inject(Router);
  private auth = inject(Auth);

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  handleLogin(event: Event) {
    event.preventDefault();
    this.isLoading = true;
    // TODO: integrar com endpoint de autenticação quando disponível
    this.auth.login();
    this.router.navigate(['/dashboard']);
  }
}
