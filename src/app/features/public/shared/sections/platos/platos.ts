import { Component } from '@angular/core';

interface Plato {
  id: number;
  nombre: string;
  imagen: string;
}

@Component({
  selector: 'app-platos',
  standalone: true,
  imports: [],
  templateUrl: './platos.html',
  styleUrl: './platos.css',
})
export class Platos {
  // Array de datos con las rutas tal como lo solicitaste
  listaPlatos: Plato[] = [
    { id: 1, nombre: 'Arroz con pollo', imagen: 'assets/extras/alitas.webp' },
    { id: 2, nombre: 'Alitas', imagen: 'assets/extras/alas.webp' },
    { id: 3, nombre: 'Pequeños', imagen: 'assets/extras/queso.webp' },
    { id: 4, nombre: 'Cervez Artesanal', imagen: 'assets/extras/chela.webp' },
    { id: 5, nombre: 'Hamburguesa', imagen: 'assets/extras/hambur.webp' },
    { id: 6, nombre: 'Caldo de gallina', imagen: 'assets/extras/caldogallina.webp' }
  ];
}