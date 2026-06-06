import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-foto-perfil',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './foto-perfil.component.html',
})
export class FotoPerfilComponent {
  @Input() foto: string | null = null;
  @Input() tamanho: number = 100;
  @Output() fotoSelecionada = new EventEmitter<string>();

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const file = input.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      const base64 = reader.result as string;
      this.foto = base64;
      this.fotoSelecionada.emit(base64);
    };

    reader.readAsDataURL(file);
  }
}
