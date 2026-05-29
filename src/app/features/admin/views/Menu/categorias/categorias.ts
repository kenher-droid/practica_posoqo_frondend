import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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
export class CategoriasComponent {
  categorias = signal<Categoria[]>([
    {
      id: 1,
      nombre: 'Bebidas',
      expandida: true,
      subCategorias: [
        { id: 1, nombre: 'Vinos' },
        { id: 2, nombre: 'Cervezas' },
        { id: 3, nombre: 'Batidos' },
        { id: 4, nombre: 'Chichas' },
        { id: 5, nombre: 'Vodka' },
      ],
    },
    {
      id: 2,
      nombre: 'Alimentos',
      expandida: true,
      subCategorias: [
        { id: 6, nombre: 'Hamburguesas' },
        { id: 7, nombre: 'Pizzas' },
        { id: 8, nombre: 'Aeropuerto' },
        { id: 9, nombre: 'Ceviches' },
      ],
    },
  ]);

  categoriaSeleccionada = signal<Categoria | null>(null);
  categoriaParaEliminar = signal<Categoria | null>(null);
  subCategoriaParaEliminar = signal<{ categoriaId: number; subcategoria: SubCategoria } | null>(null);

  showModalAgregarCategoria = signal(false);
  showModalAgregarSubcategoria = signal(false);
  showModalConfirmEliminarCategoria = signal(false);
  showModalConfirmEliminarSubcategoria = signal(false);

  nuevoNombre = signal('');
  nuevoSubNombre = signal('');

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

    const nuevaCategoria: Categoria = {
      id: Math.max(...this.categorias().map((c) => c.id), 0) + 1,
      nombre,
      expandida: true,
      subCategorias: [],
    };

    this.categorias.set([...this.categorias(), nuevaCategoria]);
    this.cerrarModalAgregarCategoria();
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
      const nuevaSubCategoria: SubCategoria = {
        id: Math.max(...nuevas[indice].subCategorias.map((s) => s.id), 0) + 1,
        nombre,
      };
      nuevas[indice].subCategorias = [...nuevas[indice].subCategorias, nuevaSubCategoria];
      this.categorias.set(nuevas);
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

    this.categorias.set(this.categorias().filter((c) => c.id !== categoria.id));
    this.cerrarModalEliminarCategoria();
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

    const nuevas = [...this.categorias()];
    const indice = nuevas.findIndex((c) => c.id === info.categoriaId);
    if (indice >= 0) {
      nuevas[indice].subCategorias = nuevas[indice].subCategorias.filter(
        (s) => s.id !== info.subcategoria.id
      );
      this.categorias.set(nuevas);
    }

    this.cerrarModalEliminarSubcategoria();
  }
}
