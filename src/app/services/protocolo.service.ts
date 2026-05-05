import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../config/api.config';
import { Protocolo } from '../models';

@Injectable({
  providedIn: 'root'
})
export class ProtocoloService {

  private baseUrl = `${API_CONFIG.baseURL}/protocolos`;

  constructor(private http: HttpClient) {}

  criar(protocolo: Protocolo): Observable<Protocolo> {
    return this.http.post<Protocolo>(this.baseUrl, protocolo);
  }

  buscarPorId(id: number): Observable<Protocolo> {
    return this.http.get<Protocolo>(`${this.baseUrl}/${id}`);
  }

  listarPorUsuario(usuarioId: number): Observable<Protocolo[]> {
    return this.http.get<Protocolo[]>(`${this.baseUrl}/loja/${usuarioId}`);
  }

  atualizar(protocolo: Protocolo): Observable<Protocolo> {
    return this.http.put<Protocolo>(`${this.baseUrl}/${protocolo.id}`, protocolo);
  }

  deletar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  removerItem(itemId: number): Observable<void> {
    return this.http.delete<void>(
      `${this.baseUrl}/itens/${itemId}`
    );
  }

  adicionarItem(protocoloId: number, item: { produtoId: number; quantidade: number }) {
    return this.http.post<Protocolo>(
      `${this.baseUrl}/${protocoloId}/itens`,
      item
    );
  }
}
