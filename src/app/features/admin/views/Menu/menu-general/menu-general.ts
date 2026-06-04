import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RestauranteApiService, CategoriaResponse, MenuResponse, SubCategoriaResponse } from '../../../../../core/services/restaurante-api.service';

interface Comida {
  id: number;
  nombre: string;
  precio: number;
  subcategoria: string;
  estado: 'activo' | 'inactivo';
  imagen: string;
  categoria: string;
}

@Component({
  selector: 'app-menu-general',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './menu-general.html',
  styleUrl: './menu-general.css',
})
export class MenuGeneralComponent implements OnInit {
  comidas = signal<Comida[]>([]);
  private menusApi: MenuResponse[] = [];
  private categoriasApi: CategoriaResponse[] = [];
  private subcategoriasApi: SubCategoriaResponse[] = [];

  showModalAgregarComida = signal(false);
  showModalConfirmEliminar = signal(false);
  comidaParaEliminar = signal<Comida | null>(null);

  nuevoNombre = signal('');
  nuevoPrecio = signal('');
  nuevaSubcategoria = signal('Sub-categoría');
  nuevaCategoria = signal('Comidas');
  nuevaImagen = signal('');
  nuevaSubcategoriaId = signal<number | null>(null);

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
          this.comidas.set(menus.map((menu) => this.mapMenu(menu)));
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
      estado: menu.estado_activo ? 'activo' : 'inactivo',
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

  get subcategoriasDisponibles(): SubCategoriaResponse[] {
    return this.subcategoriasApi;
  }

  toggleEstado(id: number): void {
    const nuevas = [...this.comidas()];
    const indice = nuevas.findIndex((c) => c.id === id);
    if (indice >= 0) {
      nuevas[indice].estado =
        nuevas[indice].estado === 'activo' ? 'inactivo' : 'activo';
      const menuApi = this.menusApi.find((menu) => menu.id === id);
      if (!menuApi) {
        this.comidas.set(nuevas);
        return;
      }

      this.restauranteApi.actualizarMenu(id, {
        nombre: menuApi.nombre,
        descripcion: menuApi.descripcion,
        imagen_url: menuApi.imagen_url,
        precio: menuApi.precio,
        estado_activo: nuevas[indice].estado === 'activo',
        id_sub_categoria: menuApi.id_sub_categoria
      }).subscribe({
        next: (menu) => {
          this.menusApi = this.menusApi.map((item) => item.id === menu.id ? menu : item);
          this.comidas.set(nuevas);
        }
      });
    }
  }

  abrirModalAgregarComida(): void {
    this.nuevoNombre.set('');
    this.nuevoPrecio.set('');
    this.nuevaSubcategoria.set('Sub-categoría');
    this.nuevaSubcategoriaId.set(this.subcategoriasApi[0]?.id ?? null);
    this.nuevaCategoria.set(this.categorias[0] ?? 'Comidas');
    this.nuevaImagen.set('');
    this.showModalAgregarComida.set(true);
  }

  cerrarModalAgregarComida(): void {
    this.showModalAgregarComida.set(false);
  }

  onImagenSeleccionada(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;
    if (!file) {
      this.nuevaImagen.set('');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      this.nuevaImagen.set(reader.result as string);
    };
    reader.readAsDataURL(file);
  }

  confirmarAgregarComida(): void {
    const nombre = this.nuevoNombre().trim();
    const precio = parseInt(this.nuevoPrecio());
    if (!nombre || !precio || !this.nuevaCategoria()) {
      return;
    }

    const idSubCategoria = this.nuevaSubcategoriaId() ?? this.subcategoriasApi[0]?.id;
    if (!idSubCategoria) {
      return;
    }

    this.restauranteApi.crearMenu({
      nombre,
      descripcion: this.nuevaSubcategoria(),
      imagen_url: this.nuevaImagen() || `https://via.placeholder.com/300x300?text=${encodeURIComponent(nombre)}`,
      precio,
      estado_activo: true,
      id_sub_categoria: idSubCategoria
    }).subscribe({
      next: (menu) => {
        this.menusApi = [...this.menusApi, menu];
        this.comidas.set([...this.comidas(), this.mapMenu(menu)]);
        this.cerrarModalAgregarComida();
      }
    });
  }

  abrirModalConfirmEliminar(comida: Comida): void {
    this.comidaParaEliminar.set(comida);
    this.showModalConfirmEliminar.set(true);
  }

  cerrarModalConfirmEliminar(): void {
    this.comidaParaEliminar.set(null);
    this.showModalConfirmEliminar.set(false);
  }

  confirmarEliminarComida(): void {
    const comida = this.comidaParaEliminar();
    if (!comida) {
      return;
    }

    this.restauranteApi.eliminarMenu(comida.id).subscribe({
      next: () => {
        this.menusApi = this.menusApi.filter((menu) => menu.id !== comida.id);
        this.comidas.set(this.comidas().filter((c) => c.id !== comida.id));
        this.cerrarModalConfirmEliminar();
      }
    });
  }
}
