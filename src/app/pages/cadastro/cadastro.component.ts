import { Component, OnInit } from '@angular/core';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-cadastro',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './cadastro.component.html',
})
export class CadastroComponent implements OnInit {
  nome = '';
  email = '';
  cpfOuCnpj = '';
  senha = '';
  confirmarSenha = '';

  tipo: 'cliente' | 'loja' = 'cliente';

  erro = '';
  sucesso = '';
  isLoading = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const tipoParam = this.route.snapshot.paramMap.get('tipo');
    if (tipoParam === 'loja') {
      this.tipo = 'loja';
    }
  }

  handleSubmit(): void {
    this.erro = '';
    this.sucesso = '';
    this.isLoading = true;

    if (!this.nome || !this.email || !this.senha || !this.confirmarSenha) {
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

    const request$ =
      this.tipo === 'cliente'
        ? this.authService.registerCliente({
            nome: this.nome,
            email: this.email,
            cpfOuCnpj: this.cpfOuCnpj,
            senha: this.senha
          })
        : this.authService.registerLoja({
            nome: this.nome,
            email: this.email,
            cpfOuCnpj: this.cpfOuCnpj,
            senha: this.senha
          });

    request$.subscribe({
      next: () => {
        this.sucesso = 'Cadastro realizado com sucesso!';

        setTimeout(() => {
          this.router.navigate([`/login/${this.tipo}`]);
        }, 1500);
      },
      error: (error) => {
        this.erro =
          error.error?.message || 'Erro ao cadastrar. Tente novamente.';
        this.isLoading = false;
      },
    });
  }
}
