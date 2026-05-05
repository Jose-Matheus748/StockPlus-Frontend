import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LayoutComponent } from '../../components/layout/layout.component';
import { EstoqueService } from '../../services/estoque.service';
import { ProdutoService } from '../../services/produto.service';
import { Produto } from '../../models';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertaComponent } from '../../components/alerts/alerta.component';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-estoque',
  standalone: true,
  imports: [CommonModule, FormsModule, LayoutComponent, AlertaComponent],
  templateUrl: './estoque.component.html',
})
export class EstoqueComponent implements OnInit {

  produtos: Produto[] = [];
  isLoading = true;
  erro = '';

  showFormModal = false;
  isEditMode = false;

  estoqueId!: number;

  formData: Produto = this.getEmptyProduto();

  valorTotalEstoque = 0;
  quantidadeTotalItens = 0;
  totalProdutos = 0;
  precoMedioUnitario = 0;

  alertMensagem = '';
  alertTipo: 'erro' | 'sucesso' | 'info' = 'info';
  alertVisivel = false;

  constructor(
    private estoqueService: EstoqueService,
    private produtoService: ProdutoService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.estoqueId = Number(this.route.snapshot.paramMap.get('id'));

    if (!this.estoqueId) {
      this.router.navigate(['/estoques']);
      return;
    }

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
      estoqueIds: [this.estoqueId]
    };
  }

  carregarProdutos(): void {
    this.isLoading = true;

    this.produtoService.listarPorEstoque(this.estoqueId).subscribe({
      next: (data) => {
        this.produtos = data;
        this.calcularResumo();
        this.buscarValorTotal();
        this.isLoading = false;
      },
      error: () => {
        this.erro = 'Erro ao carregar produtos';
        this.isLoading = false;
      }
    });
  }

  buscarValorTotal(): void {
    this.estoqueService.calcularValorTotal(this.estoqueId).subscribe({
      next: (res) => {
        this.valorTotalEstoque = res.valorTotal;
        this.quantidadeTotalItens = res.quantidadeTotal;
      }
    });
  }

  calcularResumo(): void {
    this.totalProdutos = this.produtos.length;

    this.quantidadeTotalItens =
      this.produtos.reduce((s, p) => s + p.quantidade, 0);

    this.precoMedioUnitario =
      this.totalProdutos > 0
        ? this.produtos.reduce((s, p) => s + p.precoUnitario, 0) / this.totalProdutos
        : 0;
  }

  abrirFormulario(): void {
    this.isEditMode = false;

    this.formData = {
      ...this.getEmptyProduto(),
      estoqueIds: [this.estoqueId]  // ← vincula ao estoque atual
    };

    this.showFormModal = true;
  }

  editarProduto(produto: Produto): void {
    this.isEditMode = true;
    this.formData = {
      ...produto,
      estoqueIds: produto.estoqueIds?.length ? produto.estoqueIds : [this.estoqueId]
    };
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

    if (this.isEditMode && this.formData.id) {
      this.atualizarProduto();
    } else {
      this.criarProduto();
    }
  }

  criarProduto(): void {
    const lojaId = this.authService.getUsuarioId();

    if (!lojaId) {
      this.mostrarAlerta('Usuário não autenticado', 'erro');
      return;
    }

    const payload: Produto = {
      ...this.formData,
      quantidade: Number(this.formData.quantidade),
      precoUnitario: Number(this.formData.precoUnitario),
      estoqueIds: [this.estoqueId]  // ← era estoqueId: this.estoqueId
    };

    this.produtoService.create(payload, lojaId).subscribe({
      next: () => {
        this.mostrarAlerta('Produto criado com sucesso!', 'sucesso');
        this.fecharFormulario();
        this.carregarProdutos();
      },
      error: (err) => {
        this.mostrarAlerta(err.error?.message || 'Erro ao criar produto', 'erro');
      }
    });
  }

  atualizarProduto(): void {
    const lojaId = this.authService.getUsuarioId();
    
    if (!lojaId || !this.formData.id) return;
    
    const payload: Produto = {
      ...this.formData,
      estoqueIds: this.formData.estoqueIds?.length
        ? this.formData.estoqueIds
        : [this.estoqueId]  // ← fallback seguro
    };
  
    this.produtoService.update(this.formData.id, payload, lojaId).subscribe({
      next: () => {
        this.mostrarAlerta('Produto atualizado!', 'sucesso');
        this.fecharFormulario();
        this.carregarProdutos();
      },
      error: (err) => {
        this.mostrarAlerta(err.error?.message || 'Erro ao atualizar', 'erro');
      },
    });
  }
  
  deletarProduto(id?: number): void {
    const lojaId = this.authService.getUsuarioId();

    if (!id || !lojaId) return;

    if (confirm('Deseja deletar?')) {
      this.produtoService.delete(id, lojaId).subscribe({
        next: () => {
          this.mostrarAlerta('Produto removido', 'sucesso');
          this.carregarProdutos();
        },
        error: (err) => {
          this.mostrarAlerta(err.error?.message || 'Erro ao deletar', 'erro');
        },
      });
    }
  }

  adicionarQuantidade(produto: Produto): void {
    const quantidade = Number(prompt('Quantidade:', '1'));
    const lojaId = this.authService.getUsuarioId();

    if (quantidade > 0 && lojaId && produto.id) {
      this.produtoService.addQuantidade(produto.id, quantidade, lojaId)
        .subscribe(() => this.carregarProdutos());
    }
  }

  removerQuantidade(produto: Produto): void {
    const quantidade = Number(prompt('Quantidade:', '1'));
    const lojaId = this.authService.getUsuarioId();

    if (quantidade > 0 && lojaId && produto.id) {
      this.produtoService.removeQuantidade(produto.id, quantidade, lojaId)
        .subscribe(() => this.carregarProdutos());
    }
  }

  calcularValorTotal(produto: Produto): number {
    return produto.quantidade * produto.precoUnitario;
  }

  voltarEstoques(): void {
    this.router.navigate(['/estoques']);
  }

  mostrarAlerta(msg: string, tipo: 'erro' | 'sucesso' | 'info' = 'info') {
    this.alertMensagem = msg;
    this.alertTipo = tipo;
    this.alertVisivel = true;

    setTimeout(() => this.alertVisivel = false, 3000);
  }
}
