import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RestauranteApiService, MenuResponse, CategoriaResponse, SubCategoriaResponse } from '../../../../core/services/restaurante-api.service';
import { Header } from '../header/header';

@Component({
  selector: 'app-carta-digital',
  standalone: true,
  imports: [CommonModule, Header],
  templateUrl: './carta-digital.html',
  styleUrl: './carta-digital.css',
})
export class CartaDigital implements OnInit {
  menus = signal<MenuResponse[]>([]);
  menusFiltrados = signal<MenuResponse[]>([]);
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
    this.restauranteApi.listarMenus().subscribe({
      next: (menus: MenuResponse[]) => {
        const menusActivos = menus.filter((menu: MenuResponse) => menu.estado_activo);
        this.menus.set(menusActivos);
        this.menusFiltrados.set(menusActivos);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('No se pudieron cargar los menús.');
        this.loading.set(false);
      }
    });

    this.restauranteApi.listarCategorias().subscribe({
      next: (cats) => this.categorias.set(cats),
      error: () => console.error('Error al cargar categorías')
    });

    this.restauranteApi.listarSubcategorias().subscribe({
      next: (subs) => this.subcategorias.set(subs),
      error: () => console.error('Error al cargar subcategorías')
    });
  }

  filtrarPorCategoria(categoriaId: number): void {
    this.categoriaSeleccionada.set(categoriaId);
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
