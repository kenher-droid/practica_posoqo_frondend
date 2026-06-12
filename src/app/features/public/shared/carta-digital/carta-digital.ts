import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RestauranteApiService, MenuResponse, CategoriaResponse, SubCategoriaResponse, PromocionMenuResponse } from '../../../../core/services/restaurante-api.service';
import { Header } from '../header/header';

interface MenuConPromocion extends MenuResponse {
  precioConDescuento: number | null;
  descuentoPct: number | null;
}

@Component({
  selector: 'app-carta-digital',
  standalone: true,
  imports: [CommonModule, Header],
  templateUrl: './carta-digital.html',
  styleUrl: './carta-digital.css',
})
export class CartaDigital implements OnInit {
  menus = signal<MenuConPromocion[]>([]);
  menusFiltrados = signal<MenuConPromocion[]>([]);
  categorias = signal<CategoriaResponse[]>([]);
  subcategorias = signal<SubCategoriaResponse[]>([]);
  categoriaSeleccionada = signal<number>(0);
  subcategoriaSeleccionada = signal<number>(0);
  loading = signal(true);
  error = signal('');

  constructor(private readonly restauranteApi: RestauranteApiService) {}

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos(): void {
    this.restauranteApi.listarCategorias().subscribe({
      next: (cats) => this.categorias.set(cats),
      error: () => console.error('Error al cargar categorías')
    });

    this.restauranteApi.listarSubcategorias().subscribe({
      next: (subs) => this.subcategorias.set(subs),
      error: () => console.error('Error al cargar subcategorías')
    });

    // Cargamos menús y promociones juntos para cruzar los datos
    this.restauranteApi.listarMenus().subscribe({
      next: (menus: MenuResponse[]) => {
        this.restauranteApi.listarPromociones().subscribe({
          next: (promociones: PromocionMenuResponse[]) => {
            const menusActivos: MenuConPromocion[] = menus
              .filter(m => m.estado_activo)
              .map(m => {
                const promo = promociones.find(p => p.id_menu === m.id);
                const descuentoPct = promo ? Number(promo.descuento) : null;
                const precioConDescuento = descuentoPct !== null
                  ? Number(m.precio) * (1 - descuentoPct / 100)
                  : null;
                return { ...m, precioConDescuento, descuentoPct };
              });
            this.menus.set(menusActivos);
            this.menusFiltrados.set(menusActivos);
            this.loading.set(false);
          },
          error: () => {
            // Si falla promociones, mostramos igual sin descuentos
            const menusActivos: MenuConPromocion[] = menus
              .filter(m => m.estado_activo)
              .map(m => ({ ...m, precioConDescuento: null, descuentoPct: null }));
            this.menus.set(menusActivos);
            this.menusFiltrados.set(menusActivos);
            this.loading.set(false);
          }
        });
      },
      error: () => {
        this.error.set('No se pudieron cargar los menús.');
        this.loading.set(false);
      }
    });
  }

  get subcategoriasFiltradas(): SubCategoriaResponse[] {
    const catId = this.categoriaSeleccionada();
    if (!catId) return this.subcategorias();
    return this.subcategorias().filter(s => s.id_categoria === catId);
  }

  filtrarPorCategoria(categoriaId: number): void {
    this.categoriaSeleccionada.set(categoriaId);
    this.subcategoriaSeleccionada.set(0);
    this.aplicarFiltros();
  }

  filtrarPorSubcategoria(subcategoriaId: number): void {
    this.subcategoriaSeleccionada.set(subcategoriaId);
    this.aplicarFiltros();
  }

  aplicarFiltros(): void {
    let filtrados = this.menus();

    if (this.categoriaSeleccionada()) {
      filtrados = filtrados.filter((menu) => {
        const subcat = this.subcategorias().find(s => s.id === menu.id_sub_categoria);
        return subcat && subcat.id_categoria === this.categoriaSeleccionada();
      });
    }

    if (this.subcategoriaSeleccionada()) {
      filtrados = filtrados.filter((menu) => menu.id_sub_categoria === this.subcategoriaSeleccionada());
    }

    this.menusFiltrados.set(filtrados);
  }

  limpiarFiltros(): void {
    this.categoriaSeleccionada.set(0);
    this.subcategoriaSeleccionada.set(0);
    this.menusFiltrados.set(this.menus());
  }

  obtenerNombreSubcategoria(id: number): string {
    const subcat = this.subcategorias().find(s => s.id === id);
    return subcat ? subcat.nombre : '';
  }
}
