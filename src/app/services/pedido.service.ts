import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PedidoExterno } from '../models/index';

@Injectable({ providedIn: 'root' })
export class PedidoService {

  private readonly apiUrl = 'http://localhost:8081/api/pedidos';

  constructor(private http: HttpClient) {}

  criarPedido(clienteId: number, lojaId: number, protocoloIds: number[]): Observable<PedidoExterno> {
    return this.http.post<PedidoExterno>(this.apiUrl, {
      clienteId,
      lojaId,
      protocoloIds,
    });
  }

  listarPorCliente(clienteId: number): Observable<PedidoExterno[]> {
    return this.http.get<PedidoExterno[]>(`${this.apiUrl}/cliente/${clienteId}`);
  }

  listarPorLoja(lojaId: number): Observable<PedidoExterno[]> {
    return this.http.get<PedidoExterno[]>(`${this.apiUrl}/loja/${lojaId}`);
  }

  concluir(id: number): Observable<PedidoExterno> {
    return this.http.put<PedidoExterno>(`${this.apiUrl}/${id}/concluir`, {});
  }

  cancelar(id: number): Observable<PedidoExterno> {
    return this.http.put<PedidoExterno>(`${this.apiUrl}/${id}/cancelar`, {});
  }
}
