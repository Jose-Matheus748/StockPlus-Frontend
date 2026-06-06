import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG, API_ENDPOINTS } from '../config/api.config';
import { Estoque, Produto, ValorTotalEstoque } from '../models';

@Injectable({
  providedIn: 'root',
})
export class EstoqueService {
  constructor(private http: HttpClient) {}

  create(estoque: Estoque): Observable<Estoque> {
    return this.http.post<Estoque>(
      `${API_CONFIG.baseURL}/estoques`,
      estoque
    );
  }

  listarPorLoja(lojaId: number): Observable<Estoque[]> {
    return this.http.get<Estoque[]>(
      `${API_CONFIG.baseURL}/estoques/loja/${lojaId}`
    );
  }

  getById(id: number): Observable<Estoque> {
    return this.http.get<Estoque>(
      `${API_CONFIG.baseURL}/estoques/${id}`
    );
  }

  update(id: number, estoque: Estoque, lojaId: number): Observable<Estoque> {
    return this.http.put<Estoque>(
      `${API_CONFIG.baseURL}/estoques/${id}?lojaId=${lojaId}`,
      estoque
    );
  }

  delete(id: number, lojaId: number): Observable<void> {
    return this.http.delete<void>(
      `${API_CONFIG.baseURL}/estoques/${id}?lojaId=${lojaId}`
    );
  }

  listarProdutos(id: number): Observable<Produto[]> {
    return this.http.get<Produto[]>(
      `${API_CONFIG.baseURL}/produtos/estoque/${id}`
    );
  }

  calcularValorTotal(id: number): Observable<ValorTotalEstoque> {
    return this.http.get<ValorTotalEstoque>(
      `${API_CONFIG.baseURL}/estoques/${id}/valor-total`
    );
  }
}
