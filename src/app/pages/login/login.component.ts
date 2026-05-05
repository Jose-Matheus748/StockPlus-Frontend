import { Component, OnInit } from '@angular/core';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { LoginRequest } from '../../models';
import { AlertaComponent } from '../../components/alerts/alerta.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule ],
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit {
  email: string = '';
  senha: string = '';
  erro: string = '';
  isLoading: boolean = false;

  tipo: 'cliente' | 'loja' = 'cliente';

  alertMensagem = '';
  alertTipo: 'erro' | 'sucesso' | 'info' = 'info';
  alertVisivel = false;

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

    const credentials: LoginRequest = {
      email: this.email,
      senha: this.senha,
    };

    const request$ =
      this.tipo === 'cliente'
        ? this.authService.loginCliente(credentials)
        : this.authService.loginLoja(credentials);

    request$.subscribe({
      next: () => {
        this.router.navigate(['/estoques']);
      },
      error: (error) => {
        this.erro =
          error.error?.message || 'Erro ao fazer login. Tente novamente.';
        this.isLoading = false;
      },
    });
  }

  mostrarAlerta(
    msg: string,
    tipo: 'erro' | 'sucesso' | 'info' = 'info'
  ) {
    this.alertMensagem = msg;
    this.alertTipo = tipo;
    this.alertVisivel = true;

    setTimeout(() => {
      this.alertVisivel = false;
    }, 3000);
  }
}
