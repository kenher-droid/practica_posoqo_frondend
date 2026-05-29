import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { API_BASE_URL } from '../config';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = API_BASE_URL;

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

  get<T>(path: string, params?: Record<string, string | number | boolean>, headers?: HttpHeaders) {
    return this.http.get<T>(`${this.baseUrl}${path}`, {
      params: this.buildParams(params),
      headers
    });
  }

  post<T>(path: string, body: unknown, headers?: HttpHeaders) {
    return this.http.post<T>(`${this.baseUrl}${path}`, body, { headers });
  }

  put<T>(path: string, body: unknown, headers?: HttpHeaders) {
    return this.http.put<T>(`${this.baseUrl}${path}`, body, { headers });
  }

  delete<T>(path: string, params?: Record<string, string | number | boolean>, headers?: HttpHeaders) {
    return this.http.delete<T>(`${this.baseUrl}${path}`, {
      params: this.buildParams(params),
      headers
    });
  }
}
