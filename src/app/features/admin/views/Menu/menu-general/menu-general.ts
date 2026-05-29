import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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
export class MenuGeneralComponent {
  comidas = signal<Comida[]>([
    {
      id: 1,
      nombre: 'Hamburguesa',
      precio: 23,
      subcategoria: 'Sub-categoría',
      estado: 'activo',
      imagen:
        'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&h=300&fit=crop',
      categoria: 'Comidas',
    },
    {
      id: 2,
      nombre: 'Ceviche',
      precio: 43,
      subcategoria: 'Sub-categoría',
      estado: 'activo',
      imagen:
        'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300&h=300&fit=crop',
      categoria: 'Comidas',
    },
    {
      id: 3,
      nombre: 'Aeropuerto',
      precio: 12,
      subcategoria: 'Sub-categoría',
      estado: 'activo',
      imagen:
        'https://images.unsplash.com/photo-1584622614875-e72bc58d0a41?w=300&h=300&fit=crop',
      categoria: 'Comidas',
    },
    {
      id: 4,
      nombre: 'Pizza con piña',
      precio: 233,
      subcategoria: 'Sub-categoría',
      estado: 'activo',
      imagen:
        'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=300&h=300&fit=crop',
      categoria: 'Comidas',
    },
    {
      id: 5,
      nombre: 'Pilsen',
      precio: 5,
      subcategoria: 'Sub-categoría',
      estado: 'activo',
      imagen:
        'https://images.unsplash.com/photo-1608270861620-7911c3b76701?w=300&h=300&fit=crop',
      categoria: 'Bebidas',
    },
    {
      id: 6,
      nombre: 'Corona',
      precio: 12,
      subcategoria: 'Sub-categoría',
      estado: 'activo',
      imagen:
        'https://images.unsplash.com/photo-1608891546618-8f7c56f1d93e?w=300&h=300&fit=crop',
      categoria: 'Bebidas',
    },
    {
      id: 7,
      nombre: 'Red label',
      precio: 90,
      subcategoria: 'Sub-categoría',
      estado: 'activo',
      imagen:
        'https://images.unsplash.com/photo-1609958910323-8b762bf26ffd?w=300&h=300&fit=crop',
      categoria: 'Bebidas',
    },
    {
      id: 8,
      nombre: 'Chicha',
      precio: 5,
      subcategoria: 'Sub-categoría',
      estado: 'activo',
      imagen:
        'https://images.unsplash.com/photo-1595521624779-5b7b534fad86?w=300&h=300&fit=crop',
      categoria: 'Bebidas',
    },
    {
      id: 9,
      nombre: 'Batido de mango',
      precio: 14,
      subcategoria: 'Sub-categoría',
      estado: 'activo',
      imagen:
        'https://images.unsplash.com/photo-1590080876614-70f7fbd47d32?w=300&h=300&fit=crop',
      categoria: 'Bebidas',
    },
  ]);

  showModalAgregarComida = signal(false);
  showModalConfirmEliminar = signal(false);
  comidaParaEliminar = signal<Comida | null>(null);

  nuevoNombre = signal('');
  nuevoPrecio = signal('');
  nuevaSubcategoria = signal('Sub-categoría');
  nuevaCategoria = signal('Comidas');

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

  toggleEstado(id: number): void {
    const nuevas = [...this.comidas()];
    const indice = nuevas.findIndex((c) => c.id === id);
    if (indice >= 0) {
      nuevas[indice].estado =
        nuevas[indice].estado === 'activo' ? 'inactivo' : 'activo';
      this.comidas.set(nuevas);
    }
  }

  abrirModalAgregarComida(): void {
    this.nuevoNombre.set('');
    this.nuevoPrecio.set('');
    this.nuevaSubcategoria.set('Sub-categoría');
    this.nuevaCategoria.set(this.categorias[0] ?? 'Comidas');
    this.showModalAgregarComida.set(true);
  }

  cerrarModalAgregarComida(): void {
    this.showModalAgregarComida.set(false);
  }

  confirmarAgregarComida(): void {
    const nombre = this.nuevoNombre().trim();
    const precio = parseInt(this.nuevoPrecio());
    if (!nombre || !precio || !this.nuevaCategoria()) {
      return;
    }

    const nuevaComida: Comida = {
      id: Math.max(...this.comidas().map((c) => c.id), 0) + 1,
      nombre,
      precio,
      subcategoria: this.nuevaSubcategoria(),
      estado: 'activo',
      imagen: `https://via.placeholder.com/300x300?text=${encodeURIComponent(nombre)}`,
      categoria: this.nuevaCategoria(),
    };

    this.comidas.set([...this.comidas(), nuevaComida]);
    this.cerrarModalAgregarComida();
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

    this.comidas.set(this.comidas().filter((c) => c.id !== comida.id));
    this.cerrarModalConfirmEliminar();
  }
}
