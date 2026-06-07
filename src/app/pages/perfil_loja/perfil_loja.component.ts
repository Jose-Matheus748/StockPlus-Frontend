import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { LayoutComponent } from '../../components/layout/layout.component';
import { AlertaComponent } from '../../components/alerts/alerta.component';
import { AuthService, Loja } from '../../services/auth.service';
import { API_CONFIG } from '../../config/api.config';
import { finalize } from 'rxjs';
 
@Component({
  selector: 'app-perfil-loja',
  standalone: true,
  imports: [CommonModule, FormsModule, LayoutComponent, AlertaComponent],
  templateUrl: './perfil_loja.component.html',
})
export class PerfilLojaComponent implements OnInit {
 
  isLoading = false;
  isSaving = false;
  isSavingSenha = false;
 
  modoEdicao = false;
  modoSenha = false;
 
  alertMensagem = '';
  alertTipo: 'erro' | 'sucesso' | 'info' = 'info';
  alertVisivel = false;
 
  formData: Partial<Loja> = {
    nome: '',
    email: '',
    cnpj: '',
  };
 
  formDataOriginal: Partial<Loja> = {};
 
  senhaData = {
    novaSenha: '',
    confirmarSenha: '',
  };
 
  constructor(
    private authService: AuthService,
    private http: HttpClient
  ) {}
 
  ngOnInit(): void {
    this.carregarPerfil();
  }
 
  carregarPerfil(): void {
    const usuario = this.authService.getCurrentUser() as Loja;
    if (!usuario) return;
 
    this.formData = {
      nome: usuario.nome,
      email: usuario.email,
      cnpj: usuario.cnpj,
    };
    this.formDataOriginal = { ...this.formData };
  }
 
  getNomeInicial(): string {
    return this.formData.nome?.charAt(0)?.toUpperCase() ?? '?';
  }
 
  ativarEdicao(): void {
    this.formDataOriginal = { ...this.formData };
    this.modoEdicao = true;
  }
 
  cancelarEdicao(): void {
    this.formData = { ...this.formDataOriginal };
    this.modoEdicao = false;
  }
 
  salvarDados(): void {
    if (!this.formData.nome?.trim()) {
      this.mostrarAlerta('Informe o nome da loja', 'info');
      return;
    }
    if (!this.formData.email?.trim()) {
      this.mostrarAlerta('Informe o email', 'info');
      return;
    }
 
    const id = this.authService.getUsuarioId();
    if (!id) {
      this.mostrarAlerta('Usuário não autenticado', 'erro');
      return;
    }
 
    this.isSaving = true;
 
    const payload = {
      nome: this.formData.nome!.trim(),
      email: this.formData.email!.trim(),
    };
 
    this.http.put<Loja>(`${API_CONFIG.baseURL}/lojas/${id}`, payload)
      .pipe(finalize(() => this.isSaving = false))
      .subscribe({
        next: (lojaAtualizada) => {
          // Atualiza sessão local com novos dados
          const usuarioAtual = this.authService.getCurrentUser() as Loja;
          const atualizado: Loja = { ...usuarioAtual, ...lojaAtualizada };
          localStorage.setItem('currentUser', JSON.stringify(atualizado));
 
          this.formData = {
            nome: lojaAtualizada.nome,
            email: lojaAtualizada.email,
            cnpj: lojaAtualizada.cnpj,
          };
          this.formDataOriginal = { ...this.formData };
          this.modoEdicao = false;
          this.mostrarAlerta('Dados atualizados com sucesso', 'sucesso');
        },
        error: (err) => {
          this.mostrarAlerta(
            err?.error?.message || 'Erro ao atualizar dados',
            'erro'
          );
        }
      });
  }
 
  ativarAlteracaoSenha(): void {
    this.senhaData = { novaSenha: '', confirmarSenha: '' };
    this.modoSenha = true;
  }
 
  cancelarSenha(): void {
    this.senhaData = { novaSenha: '', confirmarSenha: '' };
    this.modoSenha = false;
  }
 
  salvarSenha(): void {
    if (!this.senhaData.novaSenha.trim()) {
      this.mostrarAlerta('Informe a nova senha', 'info');
      return;
    }
    if (this.senhaData.novaSenha !== this.senhaData.confirmarSenha) {
      this.mostrarAlerta('As senhas não coincidem', 'erro');
      return;
    }
    if (this.senhaData.novaSenha.length < 6) {
      this.mostrarAlerta('A senha deve ter no mínimo 6 caracteres', 'info');
      return;
    }
 
    const id = this.authService.getUsuarioId();
    if (!id) {
      this.mostrarAlerta('Usuário não autenticado', 'erro');
      return;
    }
 
    this.isSavingSenha = true;
 
    this.http.put(`${API_CONFIG.baseURL}/lojas/${id}/senha`, { senha: this.senhaData.novaSenha })
      .pipe(finalize(() => this.isSavingSenha = false))
      .subscribe({
        next: () => {
          this.cancelarSenha();
          this.mostrarAlerta('Senha alterada com sucesso', 'sucesso');
        },
        error: (err) => {
          this.mostrarAlerta(
            err?.error?.message || 'Erro ao alterar senha',
            'erro'
          );
        }
      });
  }
 
  mostrarAlerta(mensagem: string, tipo: 'erro' | 'sucesso' | 'info' = 'info'): void {
    this.alertMensagem = mensagem;
    this.alertTipo = tipo;
    this.alertVisivel = true;
    setTimeout(() => { this.alertVisivel = false; }, 3000);
  }
}