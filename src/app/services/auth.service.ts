import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';

import { API_CONFIG } from '../config/api.config';

export interface Cliente {
  id?: number;
  nome: string;
  email: string;
  senha: string;
  fotoPerfil?: string;
}

export interface Loja {
  id?: number;
  nome: string;
  email: string;
  cnpj: string;
  senha: string;
  fotoPerfil?: string;
}

export interface LoginRequest {
  email: string;
  senha: string;
}

type UsuarioLogado = Cliente | Loja;
type TipoUsuario = 'cliente' | 'loja';


const USER_KEY = 'currentUser';
const USER_TYPE_KEY = 'userType';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<UsuarioLogado | null>(
    this.getCurrentUserFromStorage()
  );

  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {}


  loginCliente(credentials: LoginRequest): Observable<Cliente> {
    return this.http
      .post<Cliente>(`${API_CONFIG.baseURL}/clientes/login`, credentials)
      .pipe(tap((cliente) => this.setSession(cliente, 'cliente')));
  }

  loginLoja(credentials: LoginRequest): Observable<Loja> {
    return this.http
      .post<Loja>(`${API_CONFIG.baseURL}/lojas/login`, credentials)
      .pipe(tap((loja) => this.setSession(loja, 'loja')));
  }


  registerCliente(cliente: Omit<Cliente, 'id'>): Observable<Cliente> {
    return this.http.post<Cliente>(`${API_CONFIG.baseURL}/clientes`, cliente);
  }

  registerLoja(loja: Omit<Loja, 'id'>): Observable<Loja> {
    return this.http.post<Loja>(`${API_CONFIG.baseURL}/lojas`, loja);
  }
  
  private setSession(user: UsuarioLogado, type: TipoUsuario): void {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    localStorage.setItem(USER_TYPE_KEY, type);
    this.currentUserSubject.next(user);
  }

  logout(): void {
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(USER_TYPE_KEY);
    this.currentUserSubject.next(null);
  }

  private getCurrentUserFromStorage(): UsuarioLogado | null {
    try {
      const user = localStorage.getItem(USER_KEY);
      return user ? JSON.parse(user) : null;
    } catch {
      return null;
    }
  }

  uploadFotoLoja(id: number, fotoPerfil: string): Observable<Loja> {
  return this.http.patch<Loja>(
    `${API_CONFIG.baseURL}/lojas/${id}/foto`,
    { fotoPerfil }
  ).pipe(tap((atualizado) => this.setSession(atualizado, 'loja')));
}

uploadFotoCliente(id: number, fotoPerfil: string): Observable<Cliente> {
  return this.http.patch<Cliente>(
    `${API_CONFIG.baseURL}/clientes/${id}/foto`,
    { fotoPerfil }
  ).pipe(tap((atualizado) => this.setSession(atualizado, 'cliente')));
}

  getUserType(): TipoUsuario | null {
    const type = localStorage.getItem(USER_TYPE_KEY);
    return type === 'cliente' || type === 'loja' ? type : null;
  }

  isCliente(): boolean {
    return this.getUserType() === 'cliente';
  }

  isLoja(): boolean {
    return this.getUserType() === 'loja';
  }

  isAuthenticated(): boolean {
    return !!this.getCurrentUser();
  }

  getCurrentUser(): UsuarioLogado | null {
    return this.currentUserSubject.value;
  }

  getUsuarioId(): number | null {
    return this.currentUserSubject.value?.id ?? null;
  }
}
