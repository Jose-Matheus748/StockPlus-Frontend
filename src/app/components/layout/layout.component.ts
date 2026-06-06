import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { PedidoService } from '../../services/pedido.service';
import { FotoPerfilComponent } from '../foto-perfil/foto-perfil.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, FotoPerfilComponent],
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

  salvarFoto(foto: string): void {
  const id = this.authService.getUsuarioId();
  if (!id) return;

  if (this.authService.isLoja()) {
    this.authService.uploadFotoLoja(id, foto).subscribe();
  } else {
    this.authService.uploadFotoCliente(id, foto).subscribe();
  }
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

  getFoto(): string | null {
  const user = this.authService.getCurrentUser();
  return (user as any)?.fotoPerfil ?? null;
}
}
