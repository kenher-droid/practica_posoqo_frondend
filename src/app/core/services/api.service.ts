import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { EMPTY, Observable } from 'rxjs';
import { API_BASE_URL } from '../config';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly http = inject(HttpClient);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly baseUrl = API_BASE_URL;
  private readonly tokenKey = 'posoqo_token';

  private buildParams(params?: Record<string, string | number | boolean>) {
    let httpParams = new HttpParams();
    if (!params) {
      return httpParams;
    }

    Object.entries(params).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        httpParams = httpParams.set(key, String(value));
      }
    });

    return httpParams;
  }

  private buildHeaders(headers?: HttpHeaders) {
    let nextHeaders = headers ?? new HttpHeaders();
    if (!isPlatformBrowser(this.platformId) || nextHeaders.has('Authorization')) {
      return nextHeaders;
    }

    const token = localStorage.getItem(this.tokenKey);
    if (token) {
      nextHeaders = nextHeaders.set('Authorization', `Bearer ${token}`);
    }

    return nextHeaders;
  }

  private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  get<T>(path: string, params?: Record<string, string | number | boolean>, headers?: HttpHeaders): Observable<T> {
    if (!this.isBrowser()) {
      return EMPTY;
    }

    return this.http.get<T>(`${this.baseUrl}${path}`, {
      params: this.buildParams(params),
      headers: this.buildHeaders(headers)
    });
  }

  post<T>(
    path: string,
    body: unknown,
    headers?: HttpHeaders,
    params?: Record<string, string | number | boolean>
  ): Observable<T> {
    if (!this.isBrowser()) {
      return EMPTY;
    }

    return this.http.post<T>(`${this.baseUrl}${path}`, body, {
      headers: this.buildHeaders(headers),
      params: this.buildParams(params)
    });
  }

  put<T>(path: string, body: unknown, headers?: HttpHeaders): Observable<T> {
    if (!this.isBrowser()) {
      return EMPTY;
    }

    return this.http.put<T>(`${this.baseUrl}${path}`, body, { headers: this.buildHeaders(headers) });
  }

  delete<T>(path: string, params?: Record<string, string | number | boolean>, headers?: HttpHeaders): Observable<T> {
    if (!this.isBrowser()) {
      return EMPTY;
    }

    return this.http.delete<T>(`${this.baseUrl}${path}`, {
      params: this.buildParams(params),
      headers: this.buildHeaders(headers)
    });
  }
}
