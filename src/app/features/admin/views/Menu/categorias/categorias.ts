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
  nuevoNombre = signal('');
  nuevoSubNombre = signal('');

  toggleExpandir(index: number): void {
    const nuevas = [...this.categorias()];
    nuevas[index].expandida = !nuevas[index].expandida;
    this.categorias.set(nuevas);
  }

  anadirCategoria(): void {
    if (this.nuevoNombre().trim()) {
      const nuevaCategoria: Categoria = {
        id: Math.max(...this.categorias().map((c) => c.id), 0) + 1,
        nombre: this.nuevoNombre(),
        expandida: true,
        subCategorias: [],
      };
      this.categorias.set([...this.categorias(), nuevaCategoria]);
      this.nuevoNombre.set('');
    }
  }

  anadirSubCategoria(categoria: Categoria): void {
    if (this.nuevoSubNombre().trim()) {
      const nuevas = [...this.categorias()];
      const indice = nuevas.findIndex((c) => c.id === categoria.id);

      if (indice >= 0) {
        const nuevaSubCategoria: SubCategoria = {
          id: Math.max(
            ...nuevas[indice].subCategorias.map((s) => s.id),
            0
          ) + 1,
          nombre: this.nuevoSubNombre(),
        };
        nuevas[indice].subCategorias.push(nuevaSubCategoria);
        this.categorias.set(nuevas);
        this.nuevoSubNombre.set('');
      }
    }
  }

  eliminarSubCategoria(categoriaId: number, subCategoriaId: number): void {
    const nuevas = [...this.categorias()];
    const indice = nuevas.findIndex((c) => c.id === categoriaId);

    if (indice >= 0) {
      nuevas[indice].subCategorias = nuevas[indice].subCategorias.filter(
        (s) => s.id !== subCategoriaId
      );
      this.categorias.set(nuevas);
    }
  }

  eliminarCategoria(id: number): void {
    this.categorias.set(
      this.categorias().filter((c) => c.id !== id)
    );
  }
}
