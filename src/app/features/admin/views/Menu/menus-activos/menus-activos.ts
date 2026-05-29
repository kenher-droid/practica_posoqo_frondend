import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Comida {
  id: number;
  nombre: string;
  precio: number;
  subcategoria: string;
  imagen: string;
  categoria: string;
}

@Component({
  selector: 'app-menus-activos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './menus-activos.html',
  styleUrl: './menus-activos.css',
})
export class MenusActivosComponent {
  comidas = signal<Comida[]>([
    {
      id: 1,
      nombre: 'Hamburguesa',
      precio: 23,
      subcategoria: 'Sub-categoría',
      imagen:
        'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&h=300&fit=crop',
      categoria: 'Comidas',
    },
    {
      id: 2,
      nombre: 'Ceviche',
      precio: 43,
      subcategoria: 'Sub-categoría',
      imagen:
        'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300&h=300&fit=crop',
      categoria: 'Comidas',
    },
    {
      id: 3,
      nombre: 'Aeropuerto',
      precio: 12,
      subcategoria: 'Sub-categoría',
      imagen:
        'https://images.unsplash.com/photo-1584622614875-e72bc58d0a41?w=300&h=300&fit=crop',
      categoria: 'Comidas',
    },
    {
      id: 4,
      nombre: 'Pizza con piña',
      precio: 233,
      subcategoria: 'Sub-categoría',
      imagen:
        'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=300&h=300&fit=crop',
      categoria: 'Comidas',
    },
    {
      id: 5,
      nombre: 'Pilsen',
      precio: 5,
      subcategoria: 'Sub-categoría',
      imagen:
        'https://images.unsplash.com/photo-1608270861620-7911c3b76701?w=300&h=300&fit=crop',
      categoria: 'Bebidas',
    },
    {
      id: 6,
      nombre: 'Corona',
      precio: 12,
      subcategoria: 'Sub-categoría',
      imagen:
        'https://images.unsplash.com/photo-1608891546618-8f7c56f1d93e?w=300&h=300&fit=crop',
      categoria: 'Bebidas',
    },
    {
      id: 7,
      nombre: 'Red label',
      precio: 90,
      subcategoria: 'Sub-categoría',
      imagen:
        'https://images.unsplash.com/photo-1609958910323-8b762bf26ffd?w=300&h=300&fit=crop',
      categoria: 'Bebidas',
    },
    {
      id: 8,
      nombre: 'Chicha',
      precio: 5,
      subcategoria: 'Sub-categoría',
      imagen:
        'https://images.unsplash.com/photo-1595521624779-5b7b534fad86?w=300&h=300&fit=crop',
      categoria: 'Bebidas',
    },
    {
      id: 9,
      nombre: 'Batido de mango',
      precio: 14,
      subcategoria: 'Sub-categoría',
      imagen:
        'https://images.unsplash.com/photo-1590080876614-70f7fbd47d32?w=300&h=300&fit=crop',
      categoria: 'Bebidas',
    },
  ]);

  showModalConfirmInhabilitar = signal(false);
  comidaParaInhabilitar = signal<Comida | null>(null);

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

  abrirModalInhabilitar(comida: Comida): void {
    this.comidaParaInhabilitar.set(comida);
    this.showModalConfirmInhabilitar.set(true);
  }

  cerrarModalInhabilitar(): void {
    this.comidaParaInhabilitar.set(null);
    this.showModalConfirmInhabilitar.set(false);
  }

  confirmarInhabilitarComida(): void {
    const comida = this.comidaParaInhabilitar();
    if (!comida) {
      return;
    }
    const nuevas = [...this.comidas()];
    const indice = nuevas.findIndex((c) => c.id === comida.id);
    if (indice >= 0) {
      nuevas.splice(indice, 1);
    }
    this.comidas.set(nuevas);
    this.cerrarModalInhabilitar();
  }
}
