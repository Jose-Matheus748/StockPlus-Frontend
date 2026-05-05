import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-cadastro-loja',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './cadastro_loja.component.html',
})
export class CadastroLojaComponent {
  nome = '';
  email = '';
  cnpj = '';
  senha = '';
  confirmarSenha = '';

  erro = '';
  sucesso = '';
  isLoading = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  handleSubmit(): void {
    this.erro = '';
    this.sucesso = '';
    this.isLoading = true;

    if (!this.nome || !this.email || !this.cnpj || !this.senha || !this.confirmarSenha) {
      this.erro = 'Preencha todos os campos';
      this.isLoading = false;
      return;
    }

    if (!this.email.includes('@')) {
      this.erro = 'Email inválido';
      this.isLoading = false;
      return;
    }

    if (this.senha !== this.confirmarSenha) {
      this.erro = 'Senhas não conferem';
      this.isLoading = false;
      return;
    }

    if (this.senha.length < 6) {
      this.erro = 'Senha deve ter pelo menos 6 caracteres';
      this.isLoading = false;
      return;
    }

    this.authService.registerLoja({
      nome: this.nome,
      email: this.email,
      cnpj: this.cnpj,
      senha: this.senha,
    }).subscribe({
      next: () => {
        this.sucesso = 'Loja cadastrada com sucesso!';
        setTimeout(() => this.router.navigate(['/login/loja']), 1500);
      },
      error: (error) => {
        this.erro = error.error?.message || 'Erro ao cadastrar. Tente novamente.';
        this.isLoading = false;
      },
    });
  }
}
