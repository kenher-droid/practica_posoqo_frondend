import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_ENDPOINTS } from '../config';
import { ApiService } from './api.service';

export interface UsuarioResponse {
  id: number;
  nombre: string;
  email?: string | null;
  telefono: string;
  id_rol: number;
}

export interface UsuarioCreate {
  nombre: string;
  email?: string | null;
  telefono: string;
  password: string;
  id_rol: number;
}

export interface ClienteConUsuarioResponse {
  id: number;
  fecha_nacimiento: string;
  puntos: number;
  id_usuario: number;
  nombre?: string | null;
  telefono?: string | null;
  email?: string | null;
}

export interface CategoriaResponse {
  id: number;
  nombre: string;
}

export interface SubCategoriaResponse {
  id: number;
  nombre: string;
  id_categoria: number;
}

export interface MenuResponse {
  id: number;
  nombre: string;
  descripcion: string;
  imagen_url: string;
  precio: string;
  estado_activo: boolean;
  id_sub_categoria: number;
}

export interface MenuCreate {
  nombre: string;
  descripcion: string;
  imagen_url: string;
  precio: number | string;
  estado_activo?: boolean;
  id_sub_categoria: number;
}

export interface EventoResponse {
  id: number;
  nombre: string;
  fecha: string;
  hora: string;
  lugar: string;
  imagen_url: string;
  descripcion: string;
}

export type EventoCreate = Omit<EventoResponse, 'id'>;

export interface PromocionMenuResponse {
  id: number;
  puntos: number;
  descuento: string;
  id_menu: number;
}

export interface PromocionMenuCreate {
  puntos: number;
  descuento: number | string;
  id_menu: number;
}

export interface HistorialPuntosResponse {
  id: number;
  id_cliente: number;
  tipo: string;
  puntos: number;
  descripcion?: string | null;
  fecha: string;
}

@Injectable({
  providedIn: 'root'
})
export class RestauranteApiService {
  constructor(private readonly api: ApiService) {}

  listarUsuarios(): Observable<UsuarioResponse[]> {
    return this.api.get<UsuarioResponse[]>(API_ENDPOINTS.usuarios);
  }

  miUsuario(): Observable<UsuarioResponse> {
    return this.api.get<UsuarioResponse>(API_ENDPOINTS.usuariosMe);
  }

  actualizarUsuario(id: number, payload: UsuarioCreate): Observable<UsuarioResponse> {
    return this.api.put<UsuarioResponse>(`${API_ENDPOINTS.usuarios}${id}`, payload);
  }

  eliminarUsuario(id: number): Observable<void> {
    return this.api.delete<void>(`${API_ENDPOINTS.usuarios}${id}`);
  }

  listarClientes(): Observable<ClienteConUsuarioResponse[]> {
    return this.api.get<ClienteConUsuarioResponse[]>(API_ENDPOINTS.clientes);
  }

  buscarClientes(q: string): Observable<ClienteConUsuarioResponse[]> {
    return this.api.get<ClienteConUsuarioResponse[]>(API_ENDPOINTS.buscarClientes, { q });
  }

  miCliente(): Observable<ClienteConUsuarioResponse> {
    return this.api.get<ClienteConUsuarioResponse>(API_ENDPOINTS.clientesMe);
  }

  sumarPuntos(id_cliente: number, puntos: number): Observable<void> {
    return this.api.post<void>(API_ENDPOINTS.sumarPuntos, null, undefined, { id_cliente, puntos });
  }

  canjearPuntos(id_cliente: number, id_promocion: number): Observable<void> {
    return this.api.post<void>(API_ENDPOINTS.canjearPuntos, { id_cliente, id_promocion });
  }

  historialCliente(idCliente: number): Observable<HistorialPuntosResponse[]> {
    return this.api.get<HistorialPuntosResponse[]>(`${API_ENDPOINTS.historialPuntos}/${idCliente}`);
  }

  miHistorial(): Observable<HistorialPuntosResponse[]> {
    return this.api.get<HistorialPuntosResponse[]>(API_ENDPOINTS.historialMe);
  }

  listarCategorias(): Observable<CategoriaResponse[]> {
    return this.api.get<CategoriaResponse[]>(API_ENDPOINTS.categorias);
  }

  crearCategoria(nombre: string): Observable<CategoriaResponse> {
    return this.api.post<CategoriaResponse>(API_ENDPOINTS.categorias, { nombre });
  }

  eliminarCategoria(id: number): Observable<void> {
    return this.api.delete<void>(`${API_ENDPOINTS.categorias}${id}`);
  }

  listarSubcategorias(): Observable<SubCategoriaResponse[]> {
    return this.api.get<SubCategoriaResponse[]>(API_ENDPOINTS.subcategorias);
  }

  crearSubcategoria(nombre: string, id_categoria: number): Observable<SubCategoriaResponse> {
    return this.api.post<SubCategoriaResponse>(API_ENDPOINTS.subcategorias, { nombre, id_categoria });
  }

  eliminarSubcategoria(id: number): Observable<void> {
    return this.api.delete<void>(`${API_ENDPOINTS.subcategorias}${id}`);
  }

  listarMenus(): Observable<MenuResponse[]> {
    return this.api.get<MenuResponse[]>(API_ENDPOINTS.menus);
  }

  crearMenu(payload: MenuCreate): Observable<MenuResponse> {
    return this.api.post<MenuResponse>(API_ENDPOINTS.menus, payload);
  }

  actualizarMenu(id: number, payload: MenuCreate): Observable<MenuResponse> {
    return this.api.put<MenuResponse>(`${API_ENDPOINTS.menus}${id}`, payload);
  }

  eliminarMenu(id: number): Observable<void> {
    return this.api.delete<void>(`${API_ENDPOINTS.menus}${id}`);
  }

  listarEventos(): Observable<EventoResponse[]> {
    return this.api.get<EventoResponse[]>(API_ENDPOINTS.eventos);
  }

  crearEvento(payload: EventoCreate): Observable<EventoResponse> {
    return this.api.post<EventoResponse>(API_ENDPOINTS.eventos, payload);
  }

  actualizarEvento(id: number, payload: EventoCreate): Observable<EventoResponse> {
    return this.api.put<EventoResponse>(`${API_ENDPOINTS.eventos}${id}`, payload);
  }

  eliminarEvento(id: number): Observable<void> {
    return this.api.delete<void>(`${API_ENDPOINTS.eventos}${id}`);
  }

  listarPromociones(): Observable<PromocionMenuResponse[]> {
    return this.api.get<PromocionMenuResponse[]>(API_ENDPOINTS.promociones);
  }

  crearPromocion(payload: PromocionMenuCreate): Observable<PromocionMenuResponse> {
    return this.api.post<PromocionMenuResponse>(API_ENDPOINTS.promociones, payload);
  }

  actualizarPromocion(id: number, payload: PromocionMenuCreate): Observable<PromocionMenuResponse> {
    return this.api.put<PromocionMenuResponse>(`${API_ENDPOINTS.promociones}${id}`, payload);
  }

  eliminarPromocion(id: number): Observable<void> {
    return this.api.delete<void>(`${API_ENDPOINTS.promociones}${id}`);
  }

  subirImagen(archivo: File): Observable<{ url?: string; imagen_url?: string; path?: string }> {
    const formData = new FormData();
    formData.append('archivo', archivo);
    return this.api.post<{ url?: string; imagen_url?: string; path?: string }>(API_ENDPOINTS.imagenesSubir, formData);
  }
}
