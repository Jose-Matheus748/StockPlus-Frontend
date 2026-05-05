import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { LayoutComponent } from '../../components/layout/layout.component';
import { EstoqueService } from '../../services/estoque.service';
import { Estoque } from '../../models';
import { AuthService } from '../../services/auth.service';
import { AlertaComponent } from '../../components/alerts/alerta.component';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-estoques',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, LayoutComponent, AlertaComponent],
  templateUrl: './estoques.component.html',
})
export class EstoquesComponent implements OnInit {

  estoques: Estoque[] = [];
  isLoading = false;
  erro = '';

  showFormModal = false;

  novoEstoque: Partial<Estoque> = this.getEmptyEstoque();

  alertMensagem = '';
  alertTipo: 'erro' | 'sucesso' | 'info' = 'info';
  alertVisivel = false;

  constructor(
    private estoqueService: EstoqueService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.carregarEstoques();
  }

  private getUsuarioId(): number | null {
    return this.authService.getUsuarioId();
  }

  private getEmptyEstoque(): Partial<Estoque> {
    return {
      nome: '',
      descricao: '',
    };
  }

  private validarFormulario(): boolean {
    if (!this.novoEstoque.nome?.trim()) {
      this.mostrarAlerta('Informe o nome do estoque', 'info');
      return false;
    }
    return true;
  }

  // =====================
  // 🔥 CARREGAR ESTOQUES
  // =====================
  carregarEstoques(): void {
    const usuarioId = this.getUsuarioId();

    if (!usuarioId) {
      this.erro = 'Usuário não autenticado';
      return;
    }

    this.isLoading = true;
    this.erro = '';

    this.estoqueService.listarPorLoja(usuarioId)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (data) => {
          this.estoques = data;
        },
        error: () => {
          this.erro = 'Erro ao carregar estoques';
        }
      });
  }

  abrirFormulario(): void {
    this.novoEstoque = this.getEmptyEstoque();
    this.showFormModal = true;
  }

  fecharFormulario(): void {
    this.showFormModal = false;
    this.novoEstoque = this.getEmptyEstoque();
  }

  // =====================
  // 🔥 CRIAR ESTOQUE
  // =====================
  criarEstoque(): void {
    if (!this.validarFormulario()) return;

    const usuarioId = this.getUsuarioId();

    if (!usuarioId) {
      this.mostrarAlerta('Usuário não autenticado', 'erro');
      return;
    }

    const payload: any = {
      nome: this.novoEstoque.nome!.trim(),
      descricao: this.novoEstoque.descricao?.trim(),
      lojaId: usuarioId // 🔥 CORRIGIDO (backend espera lojaId)
    };

    this.estoqueService.create(payload).subscribe({
      next: () => {
        this.mostrarAlerta('Estoque criado com sucesso', 'sucesso');
        this.fecharFormulario();
        this.carregarEstoques();
      },
      error: (err) => {
        this.mostrarAlerta(
          err?.error?.message || 'Erro ao criar estoque',
          'erro'
        );
      }
    });
  }

  selecionarEstoque(estoque: Estoque): void {
    if (!estoque.id) return;
    this.router.navigate(['/estoques', estoque.id]);
  }

  // =====================
  // 🔥 DELETAR ESTOQUE
  // =====================
  deletarEstoque(estoque: Estoque): void {
    if (!estoque.id) return;

    const usuarioId = this.getUsuarioId();

    if (!usuarioId) {
      this.mostrarAlerta('Usuário não autenticado', 'erro');
      return;
    }

    const confirmar = confirm(
      `Deseja deletar "${estoque.nome}"?\nTodos os produtos serão removidos.`
    );

    if (!confirmar) return;

    this.estoqueService.delete(estoque.id, usuarioId) // 🔥 CORRIGIDO
      .subscribe({
        next: () => {
          this.mostrarAlerta('Estoque removido com sucesso', 'sucesso');
          this.carregarEstoques();
        },
        error: (err) => {
          this.mostrarAlerta(
            err?.error?.message || 'Erro ao deletar estoque',
            'erro'
          );
        }
      });
  }

  mostrarAlerta(
    mensagem: string,
    tipo: 'erro' | 'sucesso' | 'info' = 'info'
  ): void {
    this.alertMensagem = mensagem;
    this.alertTipo = tipo;
    this.alertVisivel = true;

    setTimeout(() => {
      this.alertVisivel = false;
    }, 3000);
  }
}
