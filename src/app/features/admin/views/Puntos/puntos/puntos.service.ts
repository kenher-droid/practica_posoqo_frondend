import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RestauranteApiService, HistorialPuntosResponse } from '../../../../../core/services/restaurante-api.service';

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
  constructor(private readonly api: RestauranteApiService) {}

  agregarPuntos(usuarioId: number, cantidad: number, razon: string): Observable<ApiTransaccion> {
    return new Observable<ApiTransaccion>((observer) => {
      this.api.sumarPuntos(usuarioId, cantidad).subscribe({
        next: () => {
          observer.next({
            id: Date.now(),
            usuarioId,
            cantidad,
            tipo: 'suma',
            razon,
            fecha: new Date().toISOString()
          });
          observer.complete();
        },
        error: (error: unknown) => observer.error(error)
      });
    });
  }

  quitarPuntos(usuarioId: number, cantidad: number, razon: string): Observable<ApiTransaccion> {
    return new Observable<ApiTransaccion>((observer) => {
      observer.error(new Error('FastAPI descuenta puntos mediante canje de promocion: usa canjearPuntos(idCliente, idPromocion).'));
    });
  }

  obtenerHistorial(usuarioId: number): Observable<ApiTransaccion[]> {
    return new Observable<ApiTransaccion[]>((observer) => {
      this.api.historialCliente(usuarioId).subscribe({
        next: (historial) => {
          observer.next(historial.map((item: HistorialPuntosResponse) => ({
            id: item.id,
            usuarioId: item.id_cliente,
            cantidad: item.puntos,
            tipo: item.tipo === 'resta' || item.tipo === 'canje' ? 'resta' : 'suma',
            razon: item.descripcion ?? item.tipo,
            fecha: item.fecha
          })));
          observer.complete();
        },
        error: (error: unknown) => observer.error(error)
      });
    });
  }
}
