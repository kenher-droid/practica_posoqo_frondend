import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface ApiTransaccion {
  id: number;
  usuarioId: number;
  cantidad: number;
  tipo: 'suma' | 'resta';
  razon: string;
  fecha: string;
}

@Injectable({ providedIn: 'root' })
export class PuntosService {
  private base = 'http://localhost:3000/api/puntos';

  constructor(private http: HttpClient) {}

  agregarPuntos(usuarioId: number, cantidad: number, razon: string): Observable<ApiTransaccion> {
    return this.http.post<ApiTransaccion>(`${this.base}/agregar`, { usuarioId, cantidad, razon });
  }

  quitarPuntos(usuarioId: number, cantidad: number, razon: string): Observable<ApiTransaccion> {
    return this.http.post<ApiTransaccion>(`${this.base}/quitar`, { usuarioId, cantidad, razon });
  }

  obtenerHistorial(usuarioId: number): Observable<ApiTransaccion[]> {
    return this.http.get<ApiTransaccion[]>(`${this.base}/historial/${usuarioId}`);
  }
}
