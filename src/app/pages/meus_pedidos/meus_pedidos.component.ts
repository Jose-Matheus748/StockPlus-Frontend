import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

import { LayoutClienteComponent } from '../../components/layout/layout-cliente/layout-cliente';
import { PedidoService } from '../../services/pedido.service';
import { AuthService } from '../../services/auth.service';
import { PedidoExterno, StatusPedido, FiltroStatus } from '../../models/index';

interface PedidoView extends PedidoExterno {
  _cancelando?: boolean;
}

interface Filtro {
  label: string;
  valor: FiltroStatus;
}

@Component({
  selector: 'app-meus-pedidos',
  standalone: true,
  imports: [CommonModule, RouterModule, LayoutClienteComponent],
  templateUrl: './meus_pedidos.component.html',
})
export class MeusPedidosComponent implements OnInit {

  pedidos: PedidoView[] = [];
  isLoading = true;
  erro = '';

  filtroAtivo: FiltroStatus = 'TODOS';

  filtros: Filtro[] = [
    { label: 'Todos',                  valor: 'TODOS' },
    { label: 'Aguardando Confirmação', valor: 'EM_ANDAMENTO' },
    { label: 'Concluídos',             valor: 'CONCLUIDO' },
    { label: 'Cancelados',             valor: 'CANCELADO' },
  ];

  constructor(
    private pedidoService: PedidoService,
    private authService: AuthService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.carregarPedidos();
  }

  carregarPedidos(): void {
    const usuario = this.authService.getCurrentUser();

    if (!usuario?.id) {
      this.erro = 'Usuário não autenticado.';
      this.isLoading = false;
      return;
    }

    this.isLoading = true;
    this.erro = '';

    this.pedidoService.listarPorCliente(usuario.id).subscribe({
      next: (pedidos) => {
        this.pedidos = pedidos.sort((a, b) => (b.id ?? 0) - (a.id ?? 0));
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.erro = 'Erro ao carregar pedidos. Tente novamente.';
        this.isLoading = false;
      },
    });
  }

  get pedidosFiltrados(): PedidoView[] {
    if (this.filtroAtivo === 'TODOS') return this.pedidos;
    return this.pedidos.filter(p => p.status === this.filtroAtivo);
  }

  selecionarFiltro(filtro: FiltroStatus): void {
    this.filtroAtivo = filtro;
  }

  contagemPorStatus(filtro: FiltroStatus): number {
    if (filtro === 'TODOS') return this.pedidos.length;
    return this.pedidos.filter(p => p.status === filtro).length;
  }

  cancelarPedido(pedido: PedidoView): void {
    if (!pedido.id || pedido._cancelando) return;

    pedido._cancelando = true;
    this.erro = '';

    this.pedidoService.cancelar(pedido.id).subscribe({
      next: (atualizado) => {
        pedido.status = atualizado.status;
        pedido._cancelando = false;
      },
      error: (err) => {
        console.error(err);
        pedido._cancelando = false;
        this.erro = err?.error?.message ?? 'Erro ao cancelar pedido.';
      },
    });
  }

  irParaLojas(): void {
    this.router.navigate(['/lojas']);
  }

  getStatusLabel(status: StatusPedido | undefined): string {
    const map: Record<StatusPedido, string> = {
      EM_ANDAMENTO: 'Aguardando confirmação',
      CONCLUIDO:    'Concluído',
      CANCELADO:    'Cancelado',
    };
    return status ? (map[status] ?? status) : '—';
  }

  getStatusClass(status: StatusPedido | undefined): string {
    const map: Record<StatusPedido, string> = {
      EM_ANDAMENTO: 'bg-amber-50 text-amber-700',
      CONCLUIDO:    'bg-green-50 text-green-700',
      CANCELADO:    'bg-red-50 text-red-600',
    };
    return status ? (map[status] ?? 'bg-gray-100 text-gray-500') : 'bg-gray-100 text-gray-500';
  }

  getStatusDotClass(status: StatusPedido | undefined): string {
    const map: Record<StatusPedido, string> = {
      EM_ANDAMENTO: 'bg-amber-400',
      CONCLUIDO:    'bg-green-500',
      CANCELADO:    'bg-red-400',
    };
    return status ? (map[status] ?? 'bg-gray-400') : 'bg-gray-400';
  }

  getBadgeColor(filtro: FiltroStatus): string {
    const map: Partial<Record<FiltroStatus, string>> = {
      EM_ANDAMENTO: 'bg-amber-400',
      CONCLUIDO:    'bg-green-500',
      CANCELADO:    'bg-red-400',
    };
    return map[filtro] ?? '';
  }
}
