import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { FotoPerfilComponent } from '../../foto-perfil/foto-perfil.component';

@Component({
  selector: 'app-layout-cliente',
  standalone: true,
  imports: [CommonModule, RouterModule, FotoPerfilComponent],
  templateUrl: './layout-cliente.component.html',
})
export class LayoutClienteComponent implements OnInit {

  sidebarOpen = true;
  userMenuOpen = false;

  usuario: { nome?: string; email?: string } | null = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.usuario = this.authService.getCurrentUser();
  }

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }

  toggleUserMenu(): void {
    this.userMenuOpen = !this.userMenuOpen;
  }

  getFoto(): string | null {
    const user = this.authService.getCurrentUser();
    return (user as any)?.fotoPerfil ?? null;
  }

  getNomeInicial(): string {
    return this.usuario?.nome?.charAt(0)?.toUpperCase() ?? '?';
  }

  salvarFoto(foto: string): void {
    const id = this.authService.getUsuarioId();
    if (!id) return;

    this.authService.uploadFotoCliente(id, foto).subscribe();
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
