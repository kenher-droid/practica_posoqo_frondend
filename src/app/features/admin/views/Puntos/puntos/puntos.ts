import { Component, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RestauranteApiService, HistorialPuntosResponse } from '../../../../../core/services/restaurante-api.service';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

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
  precio: number;        // precio real a cobrar (ya con descuento si aplica)
  precioOriginal: number; // precio sin descuento
  tienePromocion: boolean;
  descuento: number;     // porcentaje de descuento (0-100)
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
  showConfigModal = signal(false);
  // Lista de items del menú que pueden tener puntos promocionales
  menuItems = signal<MenuItemPuntos[]>([]);

  // IDs de promociones seleccionadas para descontar
  selectedPromociones = signal<number[]>([]);
  promotionSearch = signal('');

  // Cantidades de platos seleccionados para canjear (id -> cantidad)
  cantidadesCanjear = signal<Map<number, number>>(new Map());

  // Cantidad de puntos a canjear (separada de cantidad de platos)
  puntosACanjear = signal<number>(0);

  // IDs de promociones seleccionadas para añadir
  selectedAddPromociones = signal<number[]>([]);
  addPromotionSearch = signal('');

  // Cantidades de platos seleccionados para añadir (id -> cantidad)
  cantidadesAdd = signal<Map<number, number>>(new Map());

  // Puntos manuales para añadir
  puntosManuales = signal(0);

  // Plato seleccionado para añadir puntos
  selectedPlato = signal<MenuItemPuntos | null>(null);

  // Configuración de puntos del backend
  valorParaObtener = signal(10);
  valorParaCanjear = signal(1);
  configSolesPorPunto = 10;
  configValorPunto = 1;

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

  calcularPuntos(precio: number): number {
    const regla = this.valorParaObtener();
    if (regla <= 0) {
      return 0;
    }
    return Math.floor(precio / regla);
  }

  cargarConfiguracionPuntos(): void {
    this.restauranteApi.obtenerConfiguracionPuntos().subscribe({
      next: (config) => {
        this.valorParaObtener.set(Number(config.soles_por_punto));
        this.valorParaCanjear.set(Number(config.valor_punto_soles));
      },
      error: () => {
        this.valorParaObtener.set(10);
        this.valorParaCanjear.set(1);
      }
    });
  }

  guardarConfiguracionPuntos(): void {
    this.restauranteApi.actualizarConfiguracionPuntos({
      soles_por_punto: this.configSolesPorPunto,
      valor_punto_soles: this.configValorPunto
    }).subscribe({
      next: (config) => {
        this.valorParaObtener.set(Number(config.soles_por_punto));
        this.valorParaCanjear.set(Number(config.valor_punto_soles));
        this.showConfigModal.set(false);
      },
      error: () => {
        // El error no es visible, solo cerramos silenciosamente en caso extremo
      }
    });
  }

  ngOnInit() {
    this.cargarClientes();
    this.cargarPromociones();
    this.cargarConfiguracionPuntos();
  }

  cargarClientes(): void {
    this.restauranteApi.listarClientes().subscribe({
      next: (clientes) => {
        this.usuarios.set(clientes.map((cliente) => ({
          id: cliente.id,
          nombre: cliente.nombre ?? `Cliente ${cliente.id}`,
          telefono: cliente.telefono ?? '',
          puntos: Number(cliente.puntos)
        })));
      }
    });
  }

  cargarPromociones(): void {
    forkJoin({
      menus: this.restauranteApi.listarMenus().pipe(catchError(() => of([]))),
      promociones: this.restauranteApi.listarPromociones().pipe(catchError(() => of([])))
    }).subscribe(({ menus, promociones }) => {
      // Filtramos solo los platos que estén marcados como activos en el backend
      const items = menus
        .filter(menu => menu.estado_activo)
        .map((menu) => {
          const promo = promociones.find(p => p.id_menu === menu.id);
          const precioOriginal = Number(menu.precio);
          const descuento = promo ? Number(promo.descuento) : 0;
          const precio = promo
            ? precioOriginal * (1 - descuento / 100)
            : precioOriginal;

          return {
            id: menu.id,
            nombre: menu.nombre,
            puntosPromocion: 0,
            precioOriginal,
            precio,
            tienePromocion: !!promo,
            descuento
          };
        });

      this.menuItems.set(items);
    });
  }

  promocionesDisponibles() {
    const term = this.promotionSearch().trim().toLowerCase();
    return this.menuItems()
      .filter(m => !term || m.nombre.toLowerCase().includes(term));
  }

  promocionesDisponiblesParaAgregar() {
    const term = this.addPromotionSearch().trim().toLowerCase();
    return this.menuItems()
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
    // Inicializar cantidad en 1 si se selecciona
    if (checked) {
      this.cantidadesCanjear.update(map => new Map(map).set(id, 1));
    } else {
      this.cantidadesCanjear.update(map => {
        const newMap = new Map(map);
        newMap.delete(id);
        return newMap;
      });
    }
  }

  actualizarCantidadCanjear(id: number, cantidad: number) {
    if (cantidad < 1) cantidad = 1;
    this.cantidadesCanjear.update(map => new Map(map).set(id, cantidad));
  }

  obtenerCantidadCanjear(id: number): number {
    return this.cantidadesCanjear().get(id) || 1;
  }

  toggleAddPromocion(id: number, checked: boolean) {
    this.selectedAddPromociones.update(prev => {
      if (checked) {
        return [...prev, id];
      }
      return prev.filter(x => x !== id);
    });
    // Inicializar cantidad en 1 si se selecciona
    if (checked) {
      this.cantidadesAdd.update(map => new Map(map).set(id, 1));
    } else {
      this.cantidadesAdd.update(map => {
        const newMap = new Map(map);
        newMap.delete(id);
        return newMap;
      });
    }
    // Recalcular puntos totales de todos los platos seleccionados
    this.recalcularPuntosTotales();
  }

  actualizarCantidadAdd(id: number, cantidad: number) {
    if (cantidad < 1) cantidad = 1;
    this.cantidadesAdd.update(map => new Map(map).set(id, cantidad));
    this.recalcularPuntosTotales();
  }

  obtenerCantidadAdd(id: number): number {
    return this.cantidadesAdd().get(id) || 1;
  }

  totalSelectedPoints(): number {
    const ids = this.selectedPromociones();
    return ids.reduce((sum, id) => {
      const m = this.menuItems().find(mi => mi.id === id);
      const cantidad = this.obtenerCantidadCanjear(id);
      return sum + (m ? this.calcularPuntos(m.precio) * cantidad : 0);
    }, 0);
  }

  totalPrecioSeleccionado(): number {
    const ids = this.selectedPromociones();
    return ids.reduce((sum, id) => {
      const m = this.menuItems().find(mi => mi.id === id);
      const cantidad = this.obtenerCantidadCanjear(id);
      return sum + (m ? m.precio * cantidad : 0);
    }, 0);
  }

  totalConDescuento(): number {
    const totalPlatos = this.totalPrecioSeleccionado();
    const descuento = this.puntosACanjear() * this.valorParaCanjear();
    return Math.max(0, totalPlatos - descuento);
  }

  totalAddPoints(): number {
    const ids = this.selectedAddPromociones();
    return ids.reduce((sum, id) => {
      const m = this.menuItems().find(mi => mi.id === id);
      const cantidad = this.obtenerCantidadAdd(id);
      return sum + (m ? this.calcularPuntos(m.precio) * cantidad : 0);
    }, 0);
  }

  totalPrecioAdd(): number {
    const ids = this.selectedAddPromociones();
    return ids.reduce((sum, id) => {
      const m = this.menuItems().find(mi => mi.id === id);
      const cantidad = this.obtenerCantidadAdd(id);
      return sum + (m ? m.precio * cantidad : 0);
    }, 0);
  }

  totalCantidadAdd(): number {
    const ids = this.selectedAddPromociones();
    return ids.reduce((sum, id) => {
      return sum + this.obtenerCantidadAdd(id);
    }, 0);
  }

  recalcularPuntosTotales(): void {
    const total = this.totalAddPoints();
    this.puntosManuales.set(total);
  }

  openAdd(user: UsuarioPuntos) {
    this.selectedUser.set(user);
    this.selectedAddPromociones.set([]);
    this.cantidadesAdd.set(new Map());
    this.addPromotionSearch.set('');
    this.puntosManuales.set(0);
    this.selectedPlato.set(null);
    this.showAddModal.set(true);
  }

  openDelete(user: UsuarioPuntos) {
    this.selectedUser.set(user);
    this.selectedPromociones.set([]);
    this.cantidadesCanjear.set(new Map());
    this.promotionSearch.set('');
    // Por defecto, canjear todos los puntos disponibles
    this.puntosACanjear.set(user.puntos);
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

  openConfigModal() {
    this.configSolesPorPunto = this.valorParaObtener();
    this.configValorPunto = this.valorParaCanjear();
    this.showConfigModal.set(true);
  }

  decrementarPuntosACanjear() {
    this.puntosACanjear.set(Math.max(0, Math.floor(this.puntosACanjear()) - 1));
  }

  incrementarPuntosACanjear() {
    const user = this.selectedUser();
    const maxPuntos = user ? user.puntos : 0;
    const nuevoValor = Math.floor(this.puntosACanjear()) + 1;
    this.puntosACanjear.set(Math.min(maxPuntos, nuevoValor));
  }

  puntosACanjearEntero(): number {
    return Math.floor(this.puntosACanjear());
  }

  puedeIncrementarPuntos(): boolean {
    const user = this.selectedUser();
    if (!user) return false;
    return this.puntosACanjear() < user.puntos;
  }

  confirmAdd() {
    const user = this.selectedUser();
    if (!user) {
      this.close();
      return;
    }

    const totalPrecio = this.totalPrecioAdd();
    if (totalPrecio <= 0) {
      this.close();
      return;
    }

    const nombres = this.selectedAddPromociones().map(id => {
      const m = this.menuItems().find(mi => mi.id === id);
      const cantidad = this.obtenerCantidadAdd(id);
      return m ? `${m.nombre} (x${cantidad})` : '';
    }).filter(Boolean).join(', ');
    const razon = nombres ? `Compra: ${nombres}` : 'Compra manual';

    this.restauranteApi.sumarPuntosPorMonto({ id_cliente: user.id, monto_compra: totalPrecio }).subscribe({
      next: () => {
        this.registrarTransaccion(user.id, user.nombre, this.totalAddPoints(), 'suma', razon);
        this.cargarClientes();
        this.close();
      }
    });
  }

  confirmDelete() {
    const user = this.selectedUser();
    if (!user) { this.close(); return; }

    const puntosAUsar = this.puntosACanjear();
    if (puntosAUsar <= 0) {
      this.close();
      return;
    }

    const nombres = this.selectedPromociones().map(id => {
      const m = this.menuItems().find(mi => mi.id === id);
      const cantidad = this.obtenerCantidadCanjear(id);
      return m ? `${m.nombre} (x${cantidad})` : '';
    }).filter(Boolean).join(', ');
    const razon = nombres ? `Canje: ${nombres}` : 'Canje manual';

    this.restauranteApi.canjearPuntosPorMonto({
      id_cliente: user.id,
      puntos_a_canjear: puntosAUsar,
      usar_todos_puntos: false
    }).subscribe({
      next: () => {
        this.registrarTransaccion(user.id, user.nombre, puntosAUsar, 'resta', razon);
        this.cargarClientes();
        this.close();
      }
    });
  }

  private mapHistorial(item: HistorialPuntosResponse, usuarioNombre: string): TransaccionLocal {
    return {
      id: item.id,
      usuarioId: item.id_cliente,
      usuarioNombre,
      cantidad: Number(item.puntos),
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
    this.showConfigModal.set(false);
    this.selectedUser.set(null);
    this.selectedPromociones.set([]);
    this.cantidadesCanjear.set(new Map());
    this.selectedAddPromociones.set([]);
    this.cantidadesAdd.set(new Map());
    this.promotionSearch.set('');
    this.addPromotionSearch.set('');
    this.puntosManuales.set(0);
    this.selectedPlato.set(null);
    this.puntosACanjear.set(0);
  }

  obtenerTransaccionesUsuario(usuarioId?: number): TransaccionLocal[] {
    if (!usuarioId) return [];
    return this.transacciones().filter(t => t.usuarioId === usuarioId);
  }
}
