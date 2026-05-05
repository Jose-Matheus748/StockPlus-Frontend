import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { RouterModule } from '@angular/router';

import { LayoutComponent } from '../../components/layout/layout.component';
import { AlertaComponent } from '../../components/alerts/alerta.component';
import { PedidoService } from '../../services/pedido.service';
import { AuthService } from '../../services/auth.service';
import { Pedido, StatusPedido } from '../../models/index';

type FiltroStatus = StatusPedido | 'TODOS';

interface OpcaoFiltro {
  label: string;
  valor: FiltroStatus;
  classeAtiva: string;
}

@Component({
  selector: 'app-pedidos-loja',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    DatePipe,
    DecimalPipe,
    LayoutComponent,
    AlertaComponent
  ],
  templateUrl: './pedidos_loja.component.html'
})
export class PedidosLojaComponent implements OnInit {

  pedidos: Pedido[] = [];
  pedidosFiltrados: Pedido[] = [];

  isLoading = true;
  erro = '';

  filtroAtivo: FiltroStatus = 'TODOS';
  pedidoEmProcessamento: number | null = null;

  alertMensagem = '';
  alertTipo: 'erro' | 'sucesso' | 'info' = 'info';
  alertVisivel = false;

  readonly filtros: OpcaoFiltro[] = [
    { label: 'Todos',        valor: 'TODOS',       classeAtiva: 'bg-gray-800 text-white' },
    { label: 'Em andamento', valor: 'EM_ANDAMENTO', classeAtiva: 'bg-blue-500 text-white' },
    { label: 'Concluídos',   valor: 'CONCLUIDO',    classeAtiva: 'bg-green-500 text-white' },
    { label: 'Cancelados',   valor: 'CANCELADO',    classeAtiva: 'bg-red-500 text-white' },
  ];

  constructor(
    private pedidoService: PedidoService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.carregarPedidos();
  }

  carregarPedidos(): void {
    this.isLoading = true;
    this.erro = '';

    const usuario = this.authService.getCurrentUser();

    if (!usuario?.id) {
      this.erro = 'Usuário não autenticado';
      this.isLoading = false;
      return;
    }

    this.pedidoService.listarPorLoja(usuario.id).subscribe({
      next: (data) => {
        this.pedidos = data;
        this.aplicarFiltro();
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.erro = 'Erro ao carregar pedidos';
        this.isLoading = false;
      }
    });
  }

  filtrarPor(status: FiltroStatus): void {
    this.filtroAtivo = status;
    this.aplicarFiltro();
  }

  private aplicarFiltro(): void {
    if (this.filtroAtivo === 'TODOS') {
      this.pedidosFiltrados = [...this.pedidos];
    } else {
      this.pedidosFiltrados = this.pedidos.filter(p => p.status === this.filtroAtivo);
    }
  }

  concluirPedido(pedido: Pedido): void {
    if (!pedido.id) return;

    if (!confirm(`Confirmar conclusão do pedido de "${pedido.clienteNome}"?`)) return;

    this.pedidoEmProcessamento = pedido.id;

    this.pedidoService.concluirPedido(pedido.id).subscribe({
      next: () => {
        this.pedidoEmProcessamento = null;
        this.carregarPedidos();
        this.mostrarAlerta('Pedido concluído com sucesso!', 'sucesso');
      },
      error: (err) => {
        console.error(err);
        this.pedidoEmProcessamento = null;
        this.mostrarAlerta('Erro ao concluir pedido', 'erro');
      }
    });
  }

  getBadgeClasse(status: StatusPedido): string {
    const classes: Record<StatusPedido, string> = {
      EM_ANDAMENTO: 'bg-blue-100 text-blue-700',
      CONCLUIDO:    'bg-green-100 text-green-700',
      CANCELADO:    'bg-red-100 text-red-700',
    };
    return classes[status] ?? 'bg-gray-100 text-gray-600';
  }

  getLabelStatus(status: StatusPedido): string {
    const labels: Record<StatusPedido, string> = {
      EM_ANDAMENTO: '🔄 Em andamento',
      CONCLUIDO:    '✓ Concluído',
      CANCELADO:    '✕ Cancelado',
    };
    return labels[status] ?? status;
  }

  mostrarAlerta(msg: string, tipo: 'erro' | 'sucesso' | 'info' = 'info'): void {
    this.alertMensagem = msg;
    this.alertTipo = tipo;
    this.alertVisivel = true;

    setTimeout(() => {
      this.alertVisivel = false;
    }, 3000);
  }
}
