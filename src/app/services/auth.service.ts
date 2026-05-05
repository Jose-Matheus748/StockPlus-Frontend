import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';

import { API_CONFIG } from '../config/api.config';

// =====================
// MODELOS
// =====================

export interface Cliente {
  id?: number;
  nome: string;
  email: string;
  cpfOuCnpj: string;
  senha: string;
}

export interface Loja {
  id?: number;
  nome: string;
  email: string;
  cpfOuCnpj: string;
  senha: string;
}

export interface LoginRequest {
  email: string;
  senha: string;
}

type UsuarioLogado = Cliente | Loja;
type TipoUsuario = 'cliente' | 'loja';

// =====================
// CONSTANTES
// =====================

const USER_KEY = 'currentUser';
const USER_TYPE_KEY = 'userType';

// =====================
// SERVICE
// =====================

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<UsuarioLogado | null>(
    this.getCurrentUserFromStorage()
  );

  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {}

  // =====================
  // LOGIN
  // =====================

  loginCliente(credentials: LoginRequest): Observable<Cliente> {
    return this.http
      .post<Cliente>(`${API_CONFIG.baseURL}/clientes/login`, credentials)
      .pipe(
        tap((cliente) => {
          this.setSession(cliente, 'cliente');
        })
      );
  }

  loginLoja(credentials: LoginRequest): Observable<Loja> {
    return this.http
      .post<Loja>(`${API_CONFIG.baseURL}/lojas/login`, credentials)
      .pipe(
        tap((loja) => {
          this.setSession(loja, 'loja');
        })
      );
  }

  // =====================
  // REGISTER
  // =====================

  registerCliente(cliente: Cliente): Observable<Cliente> {
    return this.http.post<Cliente>(
      `${API_CONFIG.baseURL}/clientes`,
      cliente
    );
  }

  registerLoja(loja: Loja): Observable<Loja> {
    return this.http.post<Loja>(
      `${API_CONFIG.baseURL}/lojas`,
      loja
    );
  }

  // =====================
  // SESSION
  // =====================

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

  // =====================
  // HELPERS
  // =====================

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
