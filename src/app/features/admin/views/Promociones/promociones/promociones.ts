import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  RestauranteApiService,
  CategoriaResponse,
  MenuResponse,
  PromocionMenuResponse,
  SubCategoriaResponse,
} from '../../../../../core/services/restaurante-api.service';

interface ComidaMenu {
  id: number;
  nombre: string;
  imagen: string;
  categoria: string;
  subcategoria: string;
  estado: string;
  precio: number;
}

interface PromocionVista {
  id: number;
  id_menu: number;
  nombre: string;
  imagen: string;
  categoria: string;
  subcategoria: string;
  estado: string;
  precioActual: number;
  descuentoPorcentaje: number;
  precioConDescuento: number;
  puntosAsignados: number;
}

@Component({
  selector: 'app-promociones',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './promociones.html',
  styleUrl: './promociones.css',
})
export class Promociones implements OnInit {
  promociones = signal<PromocionVista[]>([]);
  menusDisponibles = signal<ComidaMenu[]>([]);
  cargando = signal(true);
  error = signal<string | null>(null);

  showModalBuscar = signal(false);
  showModalDetalles = signal(false);
  busquedaComida = signal('');
  promocionSeleccionada = signal<PromocionVista | null>(null);
  menuSeleccionadoId = signal<number | null>(null);

  nuevaPromocion = signal({
    nombre: '',
    imagen: '',
    categoria: '',
    subcategoria: '',
    estado: 'Activo',
    precioActual: 0,
    descuentoPorcentaje: 10,
    puntosAsignados: 0,
  });

  comidasFiltradas = computed(() => {
    const busqueda = this.busquedaComida().toLowerCase().trim();
    const idsConPromo = new Set(this.promociones().map((p) => p.id_menu));
    const disponibles = this.menusDisponibles().filter((m) => !idsConPromo.has(m.id));

    if (!busqueda) {
      return disponibles;
    }

    return disponibles.filter(
      (c) =>
        c.nombre.toLowerCase().includes(busqueda) ||
        c.categoria.toLowerCase().includes(busqueda) ||
        c.subcategoria.toLowerCase().includes(busqueda)
    );
  });

  private menusApi: MenuResponse[] = [];
  private categoriasApi: CategoriaResponse[] = [];
  private subcategoriasApi: SubCategoriaResponse[] = [];
  private promocionesApi: PromocionMenuResponse[] = [];

  constructor(private readonly restauranteApi: RestauranteApiService) {}

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos(): void {
    this.cargando.set(true);
    this.error.set(null);

    this.restauranteApi.listarCategorias().subscribe({
      next: (categorias) => {
        this.categoriasApi = categorias;
        this.restauranteApi.listarSubcategorias().subscribe({
          next: (subcategorias) => {
            this.subcategoriasApi = subcategorias;
            this.restauranteApi.listarMenus().subscribe({
              next: (menus) => {
                this.menusApi = menus;
                this.menusDisponibles.set(menus.map((m) => this.mapMenu(m)));
                this.restauranteApi.listarPromociones().subscribe({
                  next: (promos) => {
                    this.promocionesApi = promos;
                    this.promociones.set(promos.map((p) => this.mapPromocion(p)));
                    this.cargando.set(false);
                  },
                  error: () => this.fallarCarga('No se pudieron cargar las promociones'),
                });
              },
              error: () => this.fallarCarga('No se pudo cargar el menú'),
            });
          },
          error: () => this.fallarCarga('No se pudieron cargar las subcategorías'),
        });
      },
      error: () => this.fallarCarga('No se pudieron cargar las categorías'),
    });
  }

  private fallarCarga(mensaje: string): void {
    this.error.set(mensaje);
    this.cargando.set(false);
  }

  private mapMenu(menu: MenuResponse): ComidaMenu {
    const subcategoria = this.subcategoriasApi.find((s) => s.id === menu.id_sub_categoria);
    const categoria = this.categoriasApi.find((c) => c.id === subcategoria?.id_categoria);

    return {
      id: menu.id,
      nombre: menu.nombre,
      imagen: menu.imagen_url,
      categoria: categoria?.nombre ?? 'Sin categoría',
      subcategoria: subcategoria?.nombre ?? 'Sin subcategoría',
      estado: menu.estado_activo ? 'Activo' : 'Inactivo',
      precio: Number(menu.precio),
    };
  }

  private mapPromocion(promo: PromocionMenuResponse): PromocionVista {
    const menu = this.menusApi.find((m) => m.id === promo.id_menu);
    const comida = menu ? this.mapMenu(menu) : null;
    const precioActual = comida?.precio ?? 0;
    const descuentoPorcentaje = Number(promo.descuento);

    return {
      id: promo.id,
      id_menu: promo.id_menu,
      nombre: comida?.nombre ?? `Menú #${promo.id_menu}`,
      imagen: comida?.imagen ?? '',
      categoria: comida?.categoria ?? '',
      subcategoria: comida?.subcategoria ?? '',
      estado: comida?.estado ?? '',
      precioActual,
      descuentoPorcentaje,
      precioConDescuento: this.calcularPrecioConDescuento(precioActual, descuentoPorcentaje),
      puntosAsignados: promo.puntos,
    };
  }

  calcularPrecioConDescuento(precio: number, porcentaje: number): number {
    const pct = Math.min(100, Math.max(0, porcentaje));
    return Math.round(precio * (1 - pct / 100) * 100) / 100;
  }

  abrirModalBuscar(): void {
    this.showModalBuscar.set(true);
  }

  cerrarModalBuscar(): void {
    this.showModalBuscar.set(false);
    this.busquedaComida.set('');
  }

  seleccionarComida(comida: ComidaMenu): void {
    this.menuSeleccionadoId.set(comida.id);
    this.promocionSeleccionada.set(null);
    this.nuevaPromocion.set({
      nombre: comida.nombre,
      imagen: comida.imagen,
      categoria: comida.categoria,
      subcategoria: comida.subcategoria,
      estado: comida.estado,
      precioActual: comida.precio,
      descuentoPorcentaje: 10,
      puntosAsignados: 0,
    });
    this.cerrarModalBuscar();
    this.showModalDetalles.set(true);
  }

  abrirModalDetalles(): void {
    this.showModalDetalles.set(true);
  }

  cerrarModalDetalles(): void {
    this.showModalDetalles.set(false);
    this.promocionSeleccionada.set(null);
    this.menuSeleccionadoId.set(null);
    this.nuevaPromocion.set({
      nombre: '',
      imagen: '',
      categoria: '',
      subcategoria: '',
      estado: 'Activo',
      precioActual: 0,
      descuentoPorcentaje: 10,
      puntosAsignados: 0,
    });
  }

  guardarPromocion(): void {
    const promo = this.nuevaPromocion();
    const idMenu = this.promocionSeleccionada()?.id_menu ?? this.menuSeleccionadoId();

    if (
      !idMenu ||
      promo.puntosAsignados <= 0 ||
      promo.descuentoPorcentaje <= 0 ||
      promo.descuentoPorcentaje > 100
    ) {
      return;
    }

    const payload = {
      puntos: promo.puntosAsignados,
      descuento: promo.descuentoPorcentaje,
      id_menu: idMenu,
    };

    const editando = this.promocionSeleccionada();

    if (editando) {
      this.restauranteApi.actualizarPromocion(editando.id, payload).subscribe({
        next: (resp) => {
          this.promocionesApi = this.promocionesApi.map((p) => (p.id === resp.id ? resp : p));
          this.promociones.set(this.promocionesApi.map((p) => this.mapPromocion(p)));
          this.cerrarModalDetalles();
        },
        error: () => this.error.set('No se pudo actualizar la promoción'),
      });
      return;
    }

    this.restauranteApi.crearPromocion(payload).subscribe({
      next: (resp) => {
        this.promocionesApi = [...this.promocionesApi, resp];
        this.promociones.set(this.promocionesApi.map((p) => this.mapPromocion(p)));
        this.cerrarModalDetalles();
      },
      error: () => this.error.set('No se pudo crear la promoción'),
    });
  }

  editarPromocion(id: number): void {
    const promo = this.promociones().find((p) => p.id === id);
    if (!promo) {
      return;
    }

    this.promocionSeleccionada.set(promo);
    this.menuSeleccionadoId.set(promo.id_menu);
    this.nuevaPromocion.set({
      nombre: promo.nombre,
      imagen: promo.imagen,
      categoria: promo.categoria,
      subcategoria: promo.subcategoria,
      estado: promo.estado,
      precioActual: promo.precioActual,
      descuentoPorcentaje: promo.descuentoPorcentaje,
      puntosAsignados: promo.puntosAsignados,
    });
    this.showModalDetalles.set(true);
  }

  eliminarPromocion(id: number): void {
    if (!confirm('¿Eliminar esta promoción?')) {
      return;
    }

    this.restauranteApi.eliminarPromocion(id).subscribe({
      next: () => {
        this.promocionesApi = this.promocionesApi.filter((p) => p.id !== id);
        this.promociones.set(this.promocionesApi.map((p) => this.mapPromocion(p)));
      },
      error: () => this.error.set('No se pudo eliminar la promoción'),
    });
  }
}
