import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

import { LayoutClienteComponent } from '../../components/layout/layout-cliente/layout-cliente';
import { LojaService } from '../../services/loja.service';
import { LojaPublica } from '../../models/index';

@Component({
  selector: 'app-lojas',
  standalone: true,
  imports: [CommonModule, RouterModule, LayoutClienteComponent],
  templateUrl: './lojas.component.html',
})
export class LojasComponent implements OnInit {

  lojas: LojaPublica[] = [];
  isLoading = true;
  erro = '';

  constructor(
    private lojaService: LojaService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.carregarLojas();
  }

  carregarLojas(): void {
    this.isLoading = true;
    this.erro = '';

    this.lojaService.listarTodas().subscribe({
      next: (data) => {
        this.lojas = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.erro = 'Erro ao carregar lojas. Tente novamente.';
        this.isLoading = false;
      },
    });
  }

  acessarLoja(loja: LojaPublica): void {
    this.router.navigate(['/lojas', loja.id]);
  }
}
