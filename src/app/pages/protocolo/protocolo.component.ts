import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LayoutComponent } from '../../components/layout/layout.component';
import { ProtocoloService } from '../../services/protocolo.service';
import { ProdutoService } from '../../services/produto.service';
import { AuthService } from '../../services/auth.service';
import { Protocolo, Produto, ItemProtocoloDTO } from '../../models';
import { AlertaComponent } from '../../components/alerts/alerta.component';

@Component({
  selector: 'app-protocolo-detalhe',
  standalone: true,
  imports: [CommonModule, FormsModule, LayoutComponent, AlertaComponent],
  templateUrl: './protocolo.component.html',
})
export class ProtocoloComponent implements OnInit {

  protocolo: Protocolo = {
    id: 0,
    nome: '',
    preco: 0,
    lojaId: 0,
    itens: []
  };
  produtos: Produto[] = [];

  total = 0;
  isLoading = true;
  erro = '';

  alertMensagem = '';
  alertTipo: 'erro' | 'sucesso' | 'info' = 'info';
  alertVisivel = false;

  novoItem = {
    produtoId: null as number | null,
    quantidade: 1
  };

  constructor(
    private protocoloService: ProtocoloService,
    private produtoService: ProdutoService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (!id) {
      this.erro = 'Protocolo inválido';
      return;
    }

    this.carregarDados(id);
  }

  /**
   * 🔥 Carrega produtos + protocolo corretamente
   */
  carregarDados(id: number): void {
    this.isLoading = true;

    this.produtoService.getAll().subscribe({
      next: (produtos) => {
        this.produtos = produtos;
        this.carregarProtocolo(id);
      },
      error: () => {
        this.erro = 'Erro ao carregar produtos';
        this.isLoading = false;
      }
    });
  }

  carregarProtocolo(id: number): void {
    this.protocoloService.buscarPorId(id).subscribe({
      next: (data) => {
        this.protocolo = data;
        this.calcularTotal();
        this.isLoading = false;
      },
      error: () => {
        this.erro = 'Erro ao carregar protocolo';
        this.isLoading = false;
      }
    });
  }

  /**
   * 🔥 Adiciona item usando endpoint correto do backend
   */
  adicionarItem(): void {
    if (!this.protocolo?.id) {
      this.mostrarAlerta('Protocolo inválido', 'erro');
      return;
    }

    if (!this.novoItem.produtoId || this.novoItem.quantidade <= 0) {
      this.mostrarAlerta('Selecione produto e quantidade válida', 'info');
      return;
    }

    this.protocoloService.adicionarItem(this.protocolo.id, {
      produtoId: this.novoItem.produtoId,
      quantidade: this.novoItem.quantidade
    }).subscribe({
      next: (protocoloAtualizado) => {
        this.protocolo = protocoloAtualizado;
        this.calcularTotal();
        this.novoItem = { produtoId: null, quantidade: 1 };
      },
      error: (err) => {
        this.mostrarAlerta(err.error?.message || 'Erro ao adicionar item', 'erro');
      }
    });
  }


  removerItem(itemId?: number): void {
    if (!itemId || !this.protocolo?.id) return;

    this.protocoloService.removerItem(itemId).subscribe({
      next: () => {
        this.carregarProtocolo(this.protocolo.id!);
        this.mostrarAlerta('Item removido com sucesso', 'sucesso');
      },
      error: () => {
        this.mostrarAlerta('Erro ao remover item', 'erro');
      }
    });
  }

  calcularTotal(): void {
    this.total = this.protocolo?.itens?.reduce(
      (soma: number, item: ItemProtocoloDTO) =>
        soma + (item.valorItem ?? 0),
      0
    ) ?? 0;
  }

  excluirProtocolo(): void {
    if (!this.protocolo?.id) return;

    if (!confirm('Deseja excluir o protocolo?')) return;

    this.protocoloService.deletar(this.protocolo.id).subscribe({
      next: () => {
        this.mostrarAlerta('Protocolo excluído', 'sucesso');
        this.router.navigate(['/protocolos']);
      },
      error: () => {
        this.mostrarAlerta('Erro ao excluir protocolo', 'erro');
      }
    });
  }

  mostrarAlerta(msg: string, tipo: 'erro' | 'sucesso' | 'info' = 'info') {
    this.alertMensagem = msg;
    this.alertTipo = tipo;
    this.alertVisivel = true;

    setTimeout(() => {
      this.alertVisivel = false;
    }, 3000);
  }
}
