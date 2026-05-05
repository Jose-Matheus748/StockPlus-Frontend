import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-alerta',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './alerta.component.html',
  styleUrls: ['./alerta.component.scss']
})
export class AlertaComponent {

  @Input() tipo: 'sucesso' | 'erro' | 'info' = 'info';
  @Input() mensagem: string = '';
  @Input() visivel: boolean = false;

}
