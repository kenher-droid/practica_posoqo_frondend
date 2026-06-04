import { Component, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RestauranteApiService, HistorialPuntosResponse, MenuResponse, PromocionMenuResponse } from '../../../../../core/services/restaurante-api.service';

interface TransaccionLocal {
  id: number;
  usuarioId: number;
  usuarioNombre: string;
  cantidad: number;
  tipo: 'suma' | 'resta';
  razon: string;
  fecha: Date;
}

interface UsuarioPuntos {
  id: number;
  nombre: string;
  telefono: string;
  puntos: number;
}

interface MenuItemPuntos {
  id: number;
  nombre: string;
  puntosPromocion: number;
}

@Component({
  selector: 'app-puntos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './puntos.html',
  styleUrl: './puntos.css',
})
export class Puntos implements OnInit {
  usuarios = signal<UsuarioPuntos[]>([]);

  transacciones = signal<TransaccionLocal[]>([]);
  searchTerm = signal('');
  selectedUser = signal<UsuarioPuntos | null>(null);
  showAddModal = signal(false);
  showDeleteModal = signal(false);
  showHistorial = signal(false);
  // Lista de items del menú que pueden tener puntos promocionales
  menuItems = signal<MenuItemPuntos[]>([]);

  // IDs de promociones seleccionadas para descontar
  selectedPromociones = signal<number[]>([]);
  promotionSearch = signal('');

  // IDs de promociones seleccionadas para añadir
  selectedAddPromociones = signal<number[]>([]);
  addPromotionSearch = signal('');

  usuariosFiltrados = computed(() => {
    const term = this.searchTerm().toLowerCase().trim();
    if (!term) {
      return this.usuarios();
    }
    return this.usuarios().filter(
      (u) => u.nombre.toLowerCase().includes(term) || u.telefono.includes(term)
    );
  });

  constructor(private readonly restauranteApi: RestauranteApiService) { }

  iniciales(nombre: string): string {
    return nombre.trim().charAt(0).toUpperCase() || '?';
  }

  ngOnInit() {
    this.cargarClientes();
    this.cargarPromociones();
  }

  cargarClientes(): void {
    this.restauranteApi.listarClientes().subscribe({
      next: (clientes) => {
        this.usuarios.set(clientes.map((cliente) => ({
          id: cliente.id,
          nombre: cliente.nombre ?? `Cliente ${cliente.id}`,
          telefono: cliente.telefono ?? '',
          puntos: cliente.puntos
        })));
      }
    });
  }

  cargarPromociones(): void {
    this.restauranteApi.listarMenus().subscribe((menus) => {
      this.restauranteApi.listarPromociones().subscribe((promociones) => {
        this.menuItems.set(promociones.map((promocion) => ({
          id: promocion.id,
          nombre: this.nombreMenu(promocion, menus),
          puntosPromocion: promocion.puntos
        })));
      });
    });
  }

  private nombreMenu(promocion: PromocionMenuResponse, menus: MenuResponse[]): string {
    return menus.find((menu) => menu.id === promocion.id_menu)?.nombre ?? `Promocion ${promocion.id}`;
  }

  promocionesDisponibles() {
    const term = this.promotionSearch().trim().toLowerCase();
    return this.menuItems()
      .filter(m => m.puntosPromocion > 0)
      .filter(m => !term || m.nombre.toLowerCase().includes(term));
  }

  promocionesDisponiblesParaAgregar() {
    const term = this.addPromotionSearch().trim().toLowerCase();
    return this.menuItems()
      .filter(m => m.puntosPromocion > 0)
      .filter(m => !term || m.nombre.toLowerCase().includes(term));
  }

  onSearch(event: Event) {
    this.searchTerm.set((event.target as HTMLInputElement).value);
  }

  onPromotionSearch(event: Event) {
    this.promotionSearch.set((event.target as HTMLInputElement).value);
  }

  onAddPromotionSearch(event: Event) {
    this.addPromotionSearch.set((event.target as HTMLInputElement).value);
  }

  togglePromocion(id: number, checked: boolean) {
    this.selectedPromociones.update(prev => {
      if (checked) return [...prev, id];
      return prev.filter(x => x !== id);
    });
  }

  toggleAddPromocion(id: number, checked: boolean) {
    this.selectedAddPromociones.update(prev => {
      if (checked) return [...prev, id];
      return prev.filter(x => x !== id);
    });
  }

  totalSelectedPoints(): number {
    const ids = this.selectedPromociones();
    return ids.reduce((sum, id) => {
      const m = this.menuItems().find(mi => mi.id === id);
      return sum + (m ? m.puntosPromocion || 0 : 0);
    }, 0);
  }

  totalAddPoints(): number {
    const ids = this.selectedAddPromociones();
    return ids.reduce((sum, id) => {
      const m = this.menuItems().find(mi => mi.id === id);
      return sum + (m ? m.puntosPromocion || 0 : 0);
    }, 0);
  }

  openAdd(user: UsuarioPuntos) {
    this.selectedUser.set(user);
    this.selectedAddPromociones.set([]);
    this.addPromotionSearch.set('');
    this.showAddModal.set(true);
  }

  openDelete(user: UsuarioPuntos) {
    this.selectedUser.set(user);
    this.selectedPromociones.set([]);
    this.promotionSearch.set('');
    this.showDeleteModal.set(true);
  }

  openHistorial(user: UsuarioPuntos) {
    this.selectedUser.set(user);
    this.showHistorial.set(true);
    this.restauranteApi.historialCliente(user.id).subscribe({
      next: (historial) => {
        this.transacciones.set(historial.map((item) => this.mapHistorial(item, user.nombre)));
      }
    });
  }

  confirmAdd() {
    const user = this.selectedUser();
    if (!user) {
      this.close();
      return;
    }

    const total = this.totalAddPoints();
    if (total <= 0) {
      this.close();
      return;
    }

    const nombres = this.selectedAddPromociones().map(id => this.menuItems().find(m => m.id === id)?.nombre).filter(Boolean).join(', ');
    this.restauranteApi.sumarPuntos(user.id, total).subscribe({
      next: () => {
        user.puntos += total;
        this.registrarTransaccion(user.id, user.nombre, total, 'suma', `Promociones añadidas: ${nombres}`);
        this.close();
      }
    });
  }

  confirmDelete() {
    const user = this.selectedUser();
    if (!user) { this.close(); return; }
    const total = this.totalSelectedPoints();
    if (total <= 0) {
      this.close();
      return;
    }
    const nombres = this.selectedPromociones().map(id => this.menuItems().find(m => m.id === id)?.nombre).filter(Boolean).join(', ');
    const ids = this.selectedPromociones();
    let completadas = 0;
    ids.forEach((idPromocion) => {
      this.restauranteApi.canjearPuntos(user.id, idPromocion).subscribe({
        next: () => {
          completadas += 1;
          if (completadas === ids.length) {
            user.puntos = Math.max(0, user.puntos - total);
            this.registrarTransaccion(user.id, user.nombre, total, 'resta', `Canje promocion: ${nombres}`);
            this.close();
          }
        }
      });
    });
  }

  private mapHistorial(item: HistorialPuntosResponse, usuarioNombre: string): TransaccionLocal {
    return {
      id: item.id,
      usuarioId: item.id_cliente,
      usuarioNombre,
      cantidad: item.puntos,
      tipo: item.tipo === 'resta' || item.tipo === 'canje' ? 'resta' : 'suma',
      razon: item.descripcion ?? item.tipo,
      fecha: new Date(item.fecha)
    };
  }

  private registrarTransaccion(usuarioId: number, usuarioNombre: string, cantidad: number, tipo: 'suma' | 'resta', razon: string) {
    const nuevaTransaccion: TransaccionLocal = {
      id: Date.now(),
      usuarioId,
      usuarioNombre,
      cantidad,
      tipo,
      razon,
      fecha: new Date()
    };

    this.transacciones.update(trans => [nuevaTransaccion, ...trans]);
  }

  close() {
    this.showAddModal.set(false);
    this.showDeleteModal.set(false);
    this.showHistorial.set(false);
    this.selectedUser.set(null);
    this.selectedPromociones.set([]);
    this.selectedAddPromociones.set([]);
    this.promotionSearch.set('');
    this.addPromotionSearch.set('');
  }

  obtenerTransaccionesUsuario(usuarioId?: number): TransaccionLocal[] {
    if (!usuarioId) return [];
    return this.transacciones().filter(t => t.usuarioId === usuarioId);
  }
}
