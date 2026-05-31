import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

import { LayoutClienteComponent } from '../../components/layout/layout-cliente/layout-cliente';
import { LojaService } from '../../services/loja.service';
import { ProtocoloService } from '../../services/protocolo.service';
import { PedidoService } from '../../services/pedido.service';
import { AuthService } from '../../services/auth.service';
import { LojaPublica, Protocolo } from '../../models/index';

@Component({
  selector: 'app-loja-protocolos',
  standalone: true,
  imports: [CommonModule, RouterModule, CurrencyPipe, LayoutClienteComponent],
  templateUrl: './lojas_protocolos.component.html',
})
export class LojaProtocolosComponent implements OnInit {

  loja: LojaPublica | null = null;
  protocolos: Protocolo[] = [];
  protocosSelecionados: Protocolo[] = [];

  isLoadingLoja = true;
  isLoadingProtocolos = true;
  isCriandoPedido = false;

  erro = '';
  pedidoCriado = false;

  private lojaId!: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private lojaService: LojaService,
    private protocoloService: ProtocoloService,
    private pedidoService: PedidoService,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.lojaId = Number(this.route.snapshot.paramMap.get('id'));

    if (!this.lojaId) {
      this.erro = 'Loja não encontrada.';
      this.isLoadingLoja = false;
      return;
    }

    this.carregarLoja();
    this.carregarProtocolos();
  }

  carregarLoja(): void {
    this.isLoadingLoja = true;
    this.lojaService.buscarPorId(this.lojaId).subscribe({
      next: (loja) => {
        this.loja = loja;
        this.isLoadingLoja = false;
      },
      error: (err) => {
        console.error(err);
        this.erro = 'Erro ao carregar informações da loja.';
        this.isLoadingLoja = false;
      },
    });
  }

  carregarProtocolos(): void {
    this.isLoadingProtocolos = true;
    this.protocoloService.listarPorUsuario(this.lojaId).subscribe({
      next: (protocolos) => {
        this.protocolos = protocolos;
        this.isLoadingProtocolos = false;
      },
      error: (err) => {
        console.error(err);
        this.isLoadingProtocolos = false;
      },
    });
  }

  toggleSelecao(protocolo: Protocolo): void {
    if (this.isSelecionado(protocolo)) {
      this.protocosSelecionados = this.protocosSelecionados.filter(p => p.id !== protocolo.id);
    } else {
      this.protocosSelecionados = [...this.protocosSelecionados, protocolo];
    }
  }

  isSelecionado(protocolo: Protocolo): boolean {
    return this.protocosSelecionados.some(p => p.id === protocolo.id);
  }

  get totalPedido(): number {
    return this.protocosSelecionados.reduce((acc, p) => acc + (p.preco ?? 0), 0);
  }

  limparSelecao(): void {
    this.protocosSelecionados = [];
  }

  criarPedido(): void {
    if (this.protocosSelecionados.length === 0 || !this.loja) return;

    const clienteId = this.authService.getUsuarioId();
    if (!clienteId) {
      this.erro = 'Usuário não autenticado.';
      return;
    }

    this.isCriandoPedido = true;
    this.erro = '';

    const protocoloIds = this.protocosSelecionados.map(p => p.id as number);

    this.pedidoService.criarPedidos(clienteId, this.lojaId, protocoloIds).subscribe({
      next: () => {
        this.isCriandoPedido = false;
        this.pedidoCriado = true;
        this.protocosSelecionados = [];
      },
      error: (err) => {
        console.error(err);
        this.isCriandoPedido = false;
        this.erro = err?.error?.message ?? 'Erro ao criar pedido. Tente novamente.';
      },
    });
  }

  fecharModal(): void {
    this.pedidoCriado = false;
  }

  irParaPedidos(): void {
    this.router.navigate(['/pedidos']);
  }

  voltar(): void {
    this.router.navigate(['/lojas']);
  }
}
