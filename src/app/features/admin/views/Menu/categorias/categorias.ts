import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RestauranteApiService } from '../../../../../core/services/restaurante-api.service';

interface SubCategoria {
  id: number;
  nombre: string;
}

interface Categoria {
  id: number;
  nombre: string;
  expandida: boolean;
  subCategorias: SubCategoria[];
}

@Component({
  selector: 'app-categorias',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './categorias.html',
  styleUrl: './categorias.css',
})
export class CategoriasComponent implements OnInit {
  categorias = signal<Categoria[]>([]);
  error = signal('');

  categoriaSeleccionada = signal<Categoria | null>(null);
  categoriaParaEliminar = signal<Categoria | null>(null);
  subCategoriaParaEliminar = signal<{ categoriaId: number; subcategoria: SubCategoria } | null>(null);

  showModalAgregarCategoria = signal(false);
  showModalAgregarSubcategoria = signal(false);
  showModalConfirmEliminarCategoria = signal(false);
  showModalConfirmEliminarSubcategoria = signal(false);

  nuevoNombre = signal('');
  nuevoSubNombre = signal('');

  constructor(private readonly restauranteApi: RestauranteApiService) {}

  ngOnInit(): void {
    this.cargarCategorias();
  }

  cargarCategorias(): void {
    this.restauranteApi.listarCategorias().subscribe({
      next: (categorias) => {
        this.restauranteApi.listarSubcategorias().subscribe({
          next: (subcategorias) => {
            this.categorias.set(categorias.map((categoria) => ({
              id: categoria.id,
              nombre: categoria.nombre,
              expandida: true,
              subCategorias: subcategorias
                .filter((subcategoria) => subcategoria.id_categoria === categoria.id)
                .map((subcategoria) => ({
                  id: subcategoria.id,
                  nombre: subcategoria.nombre
                }))
            })));
          },
          error: () => this.error.set('No se pudieron cargar las subcategorias.')
        });
      },
      error: () => this.error.set('No se pudieron cargar las categorias.')
    });
  }

  toggleExpandir(index: number): void {
    const nuevas = [...this.categorias()];
    nuevas[index].expandida = !nuevas[index].expandida;
    this.categorias.set(nuevas);
  }

  abrirModalAgregarCategoria(): void {
    this.nuevoNombre.set('');
    this.showModalAgregarCategoria.set(true);
  }

  cerrarModalAgregarCategoria(): void {
    this.nuevoNombre.set('');
    this.showModalAgregarCategoria.set(false);
  }

  confirmarAgregarCategoria(): void {
    const nombre = this.nuevoNombre().trim();
    if (!nombre) {
      return;
    }

    this.restauranteApi.crearCategoria(nombre).subscribe({
      next: (categoria) => {
        this.categorias.set([...this.categorias(), {
          id: categoria.id,
          nombre: categoria.nombre,
          expandida: true,
          subCategorias: []
        }]);
        this.cerrarModalAgregarCategoria();
      },
      error: () => this.error.set('No se pudo crear la categoria.')
    });
  }

  abrirModalAgregarSubcategoria(categoria: Categoria): void {
    this.categoriaSeleccionada.set(categoria);
    this.nuevoSubNombre.set('');
    this.showModalAgregarSubcategoria.set(true);
  }

  cerrarModalAgregarSubcategoria(): void {
    this.nuevoSubNombre.set('');
    this.categoriaSeleccionada.set(null);
    this.showModalAgregarSubcategoria.set(false);
  }

  confirmarAgregarSubcategoria(): void {
    const nombre = this.nuevoSubNombre().trim();
    const categoria = this.categoriaSeleccionada();
    if (!nombre || !categoria) {
      return;
    }

    const nuevas = [...this.categorias()];
    const indice = nuevas.findIndex((c) => c.id === categoria.id);

    if (indice >= 0) {
      this.restauranteApi.crearSubcategoria(nombre, categoria.id).subscribe({
        next: (subcategoria) => {
          nuevas[indice].subCategorias = [...nuevas[indice].subCategorias, {
            id: subcategoria.id,
            nombre: subcategoria.nombre
          }];
          this.categorias.set(nuevas);
          this.cerrarModalAgregarSubcategoria();
        },
        error: () => this.error.set('No se pudo crear la subcategoria.')
      });
      return;
    }

    this.cerrarModalAgregarSubcategoria();
  }

  abrirModalEliminarCategoria(categoria: Categoria): void {
    this.categoriaParaEliminar.set(categoria);
    this.showModalConfirmEliminarCategoria.set(true);
  }

  cerrarModalEliminarCategoria(): void {
    this.categoriaParaEliminar.set(null);
    this.showModalConfirmEliminarCategoria.set(false);
  }

  confirmarEliminarCategoria(): void {
    const categoria = this.categoriaParaEliminar();
    if (!categoria) {
      return;
    }

    this.restauranteApi.eliminarCategoria(categoria.id).subscribe({
      next: () => {
        this.categorias.set(this.categorias().filter((c) => c.id !== categoria.id));
        this.cerrarModalEliminarCategoria();
      },
      error: () => this.error.set('No se pudo eliminar la categoria.')
    });
  }

  abrirModalEliminarSubcategoria(categoria: Categoria, subcategoria: SubCategoria): void {
    this.subCategoriaParaEliminar.set({ categoriaId: categoria.id, subcategoria });
    this.showModalConfirmEliminarSubcategoria.set(true);
  }

  cerrarModalEliminarSubcategoria(): void {
    this.subCategoriaParaEliminar.set(null);
    this.showModalConfirmEliminarSubcategoria.set(false);
  }

  confirmarEliminarSubcategoria(): void {
    const info = this.subCategoriaParaEliminar();
    if (!info) {
      return;
    }

    this.restauranteApi.eliminarSubcategoria(info.subcategoria.id).subscribe({
      next: () => {
        const nuevas = [...this.categorias()];
        const indice = nuevas.findIndex((c) => c.id === info.categoriaId);
        if (indice >= 0) {
          nuevas[indice].subCategorias = nuevas[indice].subCategorias.filter(
            (s) => s.id !== info.subcategoria.id
          );
          this.categorias.set(nuevas);
        }
        this.cerrarModalEliminarSubcategoria();
      },
      error: () => this.error.set('No se pudo eliminar la subcategoria.')
    });
  }
}
