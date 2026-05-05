import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { LojaPublica } from '../models/index';

@Injectable({
  providedIn: 'root',
})
export class LojaService {

  private readonly apiUrl = 'http://localhost:8080/lojas';

  constructor(private http: HttpClient) {}

  listarTodas(): Observable<LojaPublica[]> {
    return this.http.get<LojaPublica[]>(this.apiUrl);
  }

  buscarPorId(id: number): Observable<LojaPublica> {
    return this.http.get<LojaPublica>(`${this.apiUrl}/${id}`);
  }
}
