import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ProdutoService } from '../../services/produto.service';
import { Produto } from '../../models';
import { AuthService } from '../../services/auth.service';
import { LayoutComponent } from '../../components/layout/layout.component';
import { FormsModule } from '@angular/forms';
import { AlertaComponent } from '../../components/alerts/alerta.component';

@Component({
  selector: 'app-produtos',
  standalone: true,
  imports: [CommonModule, LayoutComponent, FormsModule, AlertaComponent],
  templateUrl: './produtos.component.html',
})
export class ProdutosComponent implements OnInit {

  produtos: Produto[] = [];
  isLoading = true;
  erro = '';

  estoqueId!: number;

  showFormModal = false;
  isEditMode = false;

  alertMensagem = '';
  alertTipo: 'erro' | 'sucesso' | 'info' = 'info';
  alertVisivel = false;

  formData: Produto = this.getEmptyProduto();

  constructor(
    private produtoService: ProdutoService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.carregarProdutos();
  }

  getEmptyProduto(): Produto {
    return {
      nome: '',
      descricao: '',
      fornecedor: '',
      marca: '',
      quantidade: 0,
      precoUnitario: 0,
      estoqueIds: [] 
    };
  }

  carregarProdutos(): void {
    this.isLoading = true;
    this.produtoService.getAll().subscribe({
      next: (data) => {
        this.produtos = data;
        this.isLoading = false;
      },
      error: () => {
        this.erro = 'Erro ao carregar produtos';
        this.isLoading = false;
      }
    });
  }

  abrirFormulario(produto?: Produto): void {
    if (produto) {
      this.isEditMode = true;
      this.formData = { ...produto };
    } else {
      this.isEditMode = false;
      this.formData = this.getEmptyProduto();
    }

    this.showFormModal = true;
  }

  fecharFormulario(): void {
    this.showFormModal = false;
  }

  salvarProduto(): void {
    if (!this.formData.nome || !this.formData.fornecedor || !this.formData.marca) {
      this.mostrarAlerta('Preencha os campos obrigatórios', 'erro');
      return;
    }

    const lojaId = this.authService.getUsuarioId();

    if (!lojaId) {
      this.mostrarAlerta('Usuário não autenticado', 'erro');
      return;
    }

    if (this.isEditMode && this.formData.id) {
      this.produtoService.update(this.formData.id, this.formData, lojaId).subscribe({
        next: () => {
          this.mostrarAlerta('Produto atualizado!', 'sucesso');
          this.fecharFormulario();
          this.carregarProdutos();
        },
        error: (err) => {
          this.mostrarAlerta(err.error?.message || 'Erro ao atualizar', 'erro');
        }
      });
    } else {
      this.produtoService.create(this.formData, lojaId).subscribe({
        next: () => {
          this.mostrarAlerta('Produto criado!', 'sucesso');
          this.fecharFormulario();
          this.carregarProdutos();
        },
        error: (err) => {
          this.mostrarAlerta(err.error?.message || 'Erro ao criar', 'erro');
        }
      });
    }
  }

  deletarProduto(id?: number): void {
    if (!id) return;

    const lojaId = this.authService.getUsuarioId();
    if (!lojaId) return;

    if (confirm('Deseja deletar este produto?')) {
      this.produtoService.delete(id, lojaId).subscribe({
        next: () => {
          this.mostrarAlerta('Produto removido', 'sucesso');
          this.carregarProdutos();
        },
        error: (err) => {
          this.mostrarAlerta(err.error?.message || 'Erro ao deletar', 'erro');
        }
      });
    }
  }

  adicionarQuantidade(produto: Produto): void {
    const qtd = prompt('Quantidade para adicionar:', '1');
    const lojaId = this.authService.getUsuarioId();

    if (!qtd || Number(qtd) <= 0 || !lojaId) return;

    this.produtoService.addQuantidade(produto.id!, Number(qtd), lojaId).subscribe({
      next: () => this.carregarProdutos(),
      error: (err) => this.mostrarAlerta(err.error?.message, 'erro')
    });
  }

  removerQuantidade(produto: Produto): void {
    const qtd = prompt('Quantidade para remover:', '1');
    const lojaId = this.authService.getUsuarioId();

    if (!qtd || Number(qtd) <= 0 || !lojaId) return;

    this.produtoService.removeQuantidade(produto.id!, Number(qtd), lojaId).subscribe({
      next: () => this.carregarProdutos(),
      error: (err) => this.mostrarAlerta(err.error?.message, 'erro')
    });
  }

  mostrarAlerta(msg: string, tipo: 'erro' | 'sucesso' | 'info' = 'info') {
    this.alertMensagem = msg;
    this.alertTipo = tipo;
    this.alertVisivel = true;

    setTimeout(() => (this.alertVisivel = false), 3000);
  }
}
