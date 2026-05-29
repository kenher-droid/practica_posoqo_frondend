import { Component, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Promocion {
  id: number;
  nombre: string;
  imagen: string;
  categoria: string;
  subcategoria: string;
  estado: string;
  precioActual: number;
  precioPromocion: number;
  puntosAsignados: number;
}

@Component({
  selector: 'app-promociones',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './promociones.html',
  styleUrl: './promociones.css'
})
export class Promociones {
  comidas = [
    {
      id: 1,
      nombre: 'Hamburguesa Vegana',
      imagen: '/assets/backgrounds/background_1.avif',
      categoria: 'Platos Principales',
      subcategoria: 'Hamburguesas'
    },
    {
      id: 2,
      nombre: 'Pizza Margarita',
      imagen: '/assets/backgrounds/background_2.avif',
      categoria: 'Platos Principales',
      subcategoria: 'Pizzas'
    },
    {
      id: 3,
      nombre: 'Ensalada César',
      imagen: '/assets/backgrounds/background_1.avif',
      categoria: 'Entradas',
      subcategoria: 'Ensaladas'
    }
  ];

  promociones = signal<Promocion[]>([
    {
      id: 1,
      nombre: 'Hamburguesa Vegana',
      imagen: '/assets/backgrounds/background_1.avif',
      categoria: 'Platos Principales',
      subcategoria: 'Hamburguesas',
      estado: 'Activo',
      precioActual: 45000,
      precioPromocion: 35000,
      puntosAsignados: 100
    }
  ]);

  showModalBuscar = signal(false);
  showModalDetalles = signal(false);
  busquedaComida = signal('');
  comidasFiltradas = signal(this.comidas);
  promocionSeleccionada = signal<Promocion | null>(null);
  nuevaPromocion = signal<Partial<Promocion>>({
    nombre: '',
    imagen: '',
    categoria: '',
    subcategoria: '',
    estado: 'Activo',
    precioActual: 0,
    precioPromocion: 0,
    puntosAsignados: 0
  });

  constructor() {
    effect(() => {
      const busqueda = this.busquedaComida().toLowerCase();
      if (busqueda.length === 0) {
        this.comidasFiltradas.set(this.comidas);
      } else {
        const filtradas = this.comidas.filter(c =>
          c.nombre.toLowerCase().includes(busqueda) ||
          c.categoria.toLowerCase().includes(busqueda) ||
          c.subcategoria.toLowerCase().includes(busqueda)
        );
        this.comidasFiltradas.set(filtradas);
      }
    });
  }

  abrirModalBuscar() {
    this.showModalBuscar.set(true);
  }

  cerrarModalBuscar() {
    this.showModalBuscar.set(false);
    this.busquedaComida.set('');
  }

  seleccionarComida(comida: any) {
    this.nuevaPromocion.update(p => ({
      ...p,
      nombre: comida.nombre,
      imagen: comida.imagen,
      categoria: comida.categoria,
      subcategoria: comida.subcategoria
    }));
    this.cerrarModalBuscar();
    this.abrirModalDetalles();
  }

  abrirModalDetalles() {
    this.showModalDetalles.set(true);
  }

  cerrarModalDetalles() {
    this.showModalDetalles.set(false);
    this.nuevaPromocion.set({
      nombre: '',
      imagen: '',
      categoria: '',
      subcategoria: '',
      estado: 'Activo',
      precioActual: 0,
      precioPromocion: 0,
      puntosAsignados: 0
    });
  }

  guardarPromocion() {
    const promo = this.nuevaPromocion();
    if (promo.nombre) {
      const newPromo: Promocion = {
        id: Date.now(),
        nombre: promo.nombre || '',
        imagen: promo.imagen || '',
        categoria: promo.categoria || '',
        subcategoria: promo.subcategoria || '',
        estado: promo.estado || 'Activo',
        precioActual: promo.precioActual || 0,
        precioPromocion: promo.precioPromocion || 0,
        puntosAsignados: promo.puntosAsignados || 0
      };
      this.promociones.update(promos => [...promos, newPromo]);
      this.cerrarModalDetalles();
    }
  }

  editarPromocion(id: number) {
    const promo = this.promociones().find(p => p.id === id);
    if (promo) {
      this.promocionSeleccionada.set(promo);
      this.nuevaPromocion.set({ ...promo });
      this.abrirModalDetalles();
    }
  }

  eliminarPromocion(id: number) {
    this.promociones.update(promos => promos.filter(p => p.id !== id));
  }
}
