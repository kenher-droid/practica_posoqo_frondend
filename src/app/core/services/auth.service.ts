import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { API_ENDPOINTS } from '../config';
import { ApiService } from './api.service';

export interface LoginPayload {
  telefono: string;
  password: string;
}

export interface RegisterPayload {
  nombre: string;
  email?: string | null;
  telefono: string;
  password: string;
  fecha_nacimiento: string;
}

export interface AuthResponse {
  access_token?: string;
  token?: string;
  token_type?: string;
  usuario?: unknown;
  user?: unknown;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly api = inject(ApiService);
  private readonly router = inject(Router);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly tokenKey = 'posoqo_token';

  login(payload: LoginPayload): Observable<AuthResponse> {
    return this.api.post<AuthResponse>(API_ENDPOINTS.login, payload).pipe(
      tap((response) => this.saveToken(response.access_token ?? response.token ?? null))
    );
  }

  register(payload: RegisterPayload): Observable<AuthResponse> {
    return this.api.post<AuthResponse>(API_ENDPOINTS.register, payload);
  }

  getToken(): string | null {
    if (!isPlatformBrowser(this.platformId)) {
      return null;
    }

    return localStorage.getItem(this.tokenKey);
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(this.tokenKey);
    }
    void this.router.navigate(['/auth/login']);
  }

  private saveToken(token: string | null): void {
    if (!token || !isPlatformBrowser(this.platformId)) {
      return;
    }

    localStorage.setItem(this.tokenKey, token);
  }
}
