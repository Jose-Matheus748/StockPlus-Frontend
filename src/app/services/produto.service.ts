import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../config/api.config';
import { Produto } from '../models';

@Injectable({
  providedIn: 'root',
})
export class ProdutoService {

  constructor(private http: HttpClient) {}

  create(produto: Produto, lojaId: number): Observable<Produto> {
    return this.http.post<Produto>(
      `${API_CONFIG.baseURL}/produtos`,
      produto,
      { params: { lojaId } }
    );
  }

  update(id: number, produto: Produto, lojaId: number): Observable<Produto> {
    return this.http.put<Produto>(
      `${API_CONFIG.baseURL}/produtos/${id}`,
      produto,
      { params: { lojaId } }
    );
  }

  delete(id: number, lojaId: number): Observable<void> {
    return this.http.delete<void>(
      `${API_CONFIG.baseURL}/produtos/${id}`,
      { params: { lojaId } }
    );
  }

  listarPorEstoque(estoqueId: number): Observable<Produto[]> {
    return this.http.get<Produto[]>(
      `${API_CONFIG.baseURL}/estoques/${estoqueId}/produtos`
    );
  }

  addQuantidade(id: number, quantidade: number, lojaId: number): Observable<Produto> {
    return this.http.post<Produto>(
      `${API_CONFIG.baseURL}/produtos/${id}/add`,
      {},
      { params: { quantidade, lojaId } }
    );
  }

  removeQuantidade(id: number, quantidade: number, lojaId: number): Observable<Produto> {
    return this.http.post<Produto>(
      `${API_CONFIG.baseURL}/produtos/${id}/remove`,
      {},
      { params: { quantidade, lojaId } }
    );
  }

  getAll(): Observable<Produto[]> {
    return this.http.get<Produto>(
      `${API_CONFIG.baseURL}/produtos`
    ) as any;
  }

  getById(id: number): Observable<Produto> {
    return this.http.get<Produto>(
      `${API_CONFIG.baseURL}/produtos/${id}`
    );
  }
}
