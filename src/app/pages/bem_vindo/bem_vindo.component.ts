import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './bem_vindo.component.html'
})
export class WelcomeComponent {

  constructor(private router: Router) {}

  loginCliente() {
    this.router.navigate(['/login/cliente']);
  }

  loginLoja() {
    this.router.navigate(['/login/loja']);
  }

  cadastroCliente() {
    this.router.navigate(['/cadastro/cliente'])
  }
}
