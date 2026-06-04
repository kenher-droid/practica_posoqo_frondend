import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RestauranteApiService, CategoriaResponse, MenuResponse, SubCategoriaResponse } from '../../../../../core/services/restaurante-api.service';

interface Comida {
  id: number;
  nombre: string;
  precio: number;
  subcategoria: string;
  imagen: string;
  categoria: string;
}

@Component({
  selector: 'app-menus-inactivos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './menus-inactivos.html',
  styleUrl: './menus-inactivos.css',
})
export class MenusInactivosComponent implements OnInit {
  comidas = signal<Comida[]>([]);
  private menusApi: MenuResponse[] = [];
  private categoriasApi: CategoriaResponse[] = [];
  private subcategoriasApi: SubCategoriaResponse[] = [];

  constructor(private readonly restauranteApi: RestauranteApiService) {}

  ngOnInit(): void {
    this.cargarMenu();
  }

  cargarMenu(): void {
    this.restauranteApi.listarCategorias().subscribe((categorias) => {
      this.categoriasApi = categorias;
      this.restauranteApi.listarSubcategorias().subscribe((subcategorias) => {
        this.subcategoriasApi = subcategorias;
        this.restauranteApi.listarMenus().subscribe((menus) => {
          this.menusApi = menus;
          this.comidas.set(menus.filter((menu) => !menu.estado_activo).map((menu) => this.mapMenu(menu)));
        });
      });
    });
  }

  private mapMenu(menu: MenuResponse): Comida {
    const subcategoria = this.subcategoriasApi.find((item) => item.id === menu.id_sub_categoria);
    const categoria = this.categoriasApi.find((item) => item.id === subcategoria?.id_categoria);
    return {
      id: menu.id,
      nombre: menu.nombre,
      precio: Number(menu.precio),
      subcategoria: subcategoria?.nombre ?? 'Sin subcategoria',
      imagen: menu.imagen_url,
      categoria: categoria?.nombre ?? 'Sin categoria'
    };
  }

  get comidasPorCategoria(): { [key: string]: Comida[] } {
    const agrupadas: { [key: string]: Comida[] } = {};
    this.comidas().forEach((comida) => {
      if (!agrupadas[comida.categoria]) {
        agrupadas[comida.categoria] = [];
      }
      agrupadas[comida.categoria].push(comida);
    });
    return agrupadas;
  }

  get categorias(): string[] {
    return Object.keys(this.comidasPorCategoria);
  }

  activarComida(id: number): void {
    const menuApi = this.menusApi.find((menu) => menu.id === id);
    if (!menuApi) {
      return;
    }

    this.restauranteApi.actualizarMenu(id, {
      nombre: menuApi.nombre,
      descripcion: menuApi.descripcion,
      imagen_url: menuApi.imagen_url,
      precio: menuApi.precio,
      estado_activo: true,
      id_sub_categoria: menuApi.id_sub_categoria
    }).subscribe({
      next: () => this.comidas.set(this.comidas().filter((comida) => comida.id !== id))
    });
  }

  eliminarComida(id: number): void {
    this.restauranteApi.eliminarMenu(id).subscribe({
      next: () => this.comidas.set(this.comidas().filter((c) => c.id !== id))
    });
  }
}
