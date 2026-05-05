import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { LoginRequest } from '../../models';

@Component({
  selector: 'app-login-cliente',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login_cliente.component.html',
})
export class LoginClienteComponent {
  email = '';
  senha = '';
  erro = '';
  isLoading = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  handleSubmit(): void {
    this.erro = '';
    this.isLoading = true;

    if (!this.email || !this.senha) {
      this.erro = 'Por favor, preencha todos os campos';
      this.isLoading = false;
      return;
    }

    if (!this.email.includes('@')) {
      this.erro = 'Email inválido';
      this.isLoading = false;
      return;
    }

    const credentials: LoginRequest = { email: this.email, senha: this.senha };

    this.authService.loginCliente(credentials).subscribe({
      next: () => this.router.navigate(['/lojas']),
      error: (error) => {
        this.erro = error.error?.message || 'Erro ao fazer login. Tente novamente.';
        this.isLoading = false;
      },
    });
  }
}
