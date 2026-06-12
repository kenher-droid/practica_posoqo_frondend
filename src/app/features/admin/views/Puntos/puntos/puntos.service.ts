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

  agregarPuntosPorCompra(usuarioId: number, montoCompra: number, razon: string): Observable<ApiTransaccion> {
    return new Observable<ApiTransaccion>((observer) => {
      this.api.sumarPuntosPorMonto({ id_cliente: usuarioId, monto_compra: montoCompra }).subscribe({
        next: () => {
          observer.next({
            id: Date.now(),
            usuarioId,
            cantidad: montoCompra,
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

  canjearPuntos(usuarioId: number, puntos: number, razon: string): Observable<ApiTransaccion> {
    return new Observable<ApiTransaccion>((observer) => {
      this.api.canjearPuntosPorMonto({
        id_cliente: usuarioId,
        puntos_a_canjear: puntos,
        usar_todos_puntos: false
      }).subscribe({
        next: () => {
          observer.next({
            id: Date.now(),
            usuarioId,
            cantidad: puntos,
            tipo: 'resta',
            razon,
            fecha: new Date().toISOString()
          });
          observer.complete();
        },
        error: (error: unknown) => observer.error(error)
      });
    });
  }

  obtenerHistorial(usuarioId: number): Observable<ApiTransaccion[]> {
    return new Observable<ApiTransaccion[]>((observer) => {
      this.api.historialCliente(usuarioId).subscribe({
        next: (historial) => {
          observer.next(historial.map((item: HistorialPuntosResponse) => ({
            id: item.id,
            usuarioId: item.id_cliente,
            cantidad: Number(item.puntos),
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
