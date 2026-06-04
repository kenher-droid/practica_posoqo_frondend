import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { API_ENDPOINTS } from '../config';

export interface PromocionPayload {
  puntos: number;
  descuento: number | string;
  id_menu: number;
}

export interface PromocionResponse extends PromocionPayload {
  id: number;
  descuento: string;
}

@Injectable({
  providedIn: 'root'
})
export class PromocionesService {
  constructor(private readonly api: ApiService) {}

  listPromociones(): Observable<PromocionResponse[]> {
    return this.api.get<PromocionResponse[]>(API_ENDPOINTS.promociones);
  }

  getPromocion(id: number): Observable<PromocionResponse> {
    return this.api.get<PromocionResponse>(`${API_ENDPOINTS.promociones}/${id}`);
  }

  createPromocion(payload: PromocionPayload): Observable<PromocionResponse> {
    return this.api.post<PromocionResponse>(API_ENDPOINTS.promociones, payload);
  }

  updatePromocion(id: number, payload: Partial<PromocionPayload>): Observable<PromocionResponse> {
    return this.api.put<PromocionResponse>(`${API_ENDPOINTS.promociones}/${id}`, payload);
  }

  deletePromocion(id: number): Observable<void> {
    return this.api.delete<void>(`${API_ENDPOINTS.promociones}/${id}`);
  }
}
