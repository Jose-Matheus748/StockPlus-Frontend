import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-layout-cliente',
  standalone: true,
  imports: [CommonModule, RouterModule],
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
