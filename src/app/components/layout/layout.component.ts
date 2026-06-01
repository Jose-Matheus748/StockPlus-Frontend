import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { PedidoService } from '../../services/pedido.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './layout.component.html',
})
export class LayoutComponent implements OnInit {

  sidebarOpen = true;
  userMenuOpen = false;
  totalPendentes = 0;

  usuario: { nome?: string; email?: string } | null = null;

  constructor(
    private authService: AuthService,
    private router: Router,
    private pedidoService: PedidoService,
  ) {}

  ngOnInit(): void {
    this.usuario = this.authService.getCurrentUser();
    this.carregarPendentes();
  }

  private carregarPendentes(): void {
    const lojaId = this.authService.getUsuarioId();
    if (!lojaId) return;

    this.pedidoService.listarPorLoja(lojaId).subscribe({
      next: (pedidos) => {
        this.totalPendentes = pedidos.filter(p => p.status === 'EM_ANDAMENTO').length;
      },
      error: () => { /* silencioso — badge é informativo */ },
    });
  }

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }

  toggleUserMenu(): void {
    this.userMenuOpen = !this.userMenuOpen;
  }

  getNomeInicial(): string {
    return this.usuario?.nome?.charAt(0)?.toUpperCase() ?? '?';
  }

  handleLogout(): void {
    this.userMenuOpen = false;
    this.authService.logout();
    this.router.navigate(['/']);
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.userMenuOpen = false;
  }
}
