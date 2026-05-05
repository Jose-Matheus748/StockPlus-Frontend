import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Pedido, StatusPedido } from '../models/index';

@Injectable({
  providedIn: 'root'
})
export class PedidoService {

  private readonly apiUrl = 'http://localhost:8080/pedidos';

  constructor(private http: HttpClient) {}

  listarPorLoja(lojaId: number): Observable<Pedido[]> {
    return this.http.get<Pedido[]>(`${this.apiUrl}/loja/${lojaId}`);
  }

  buscarPorId(id: number): Observable<Pedido> {
    return this.http.get<Pedido>(`${this.apiUrl}/${id}`);
  }

  atualizarStatus(id: number, status: StatusPedido): Observable<Pedido> {
    return this.http.patch<Pedido>(`${this.apiUrl}/${id}/status`, { status });
  }

  concluirPedido(id: number): Observable<Pedido> {
    return this.http.patch<Pedido>(`${this.apiUrl}/${id}/status`, { status: 'CONCLUIDO' });
  }
}
