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
    { id: 1, nombre: 'arroz con pollo', imagen: 'assets/extras/alitas.png' },
    { id: 2, nombre: 'arroz con pollo', imagen: 'assets/extras/alitas.png' },
    { id: 3, nombre: 'arroz con pollo', imagen: 'assets/extras/alitas.png' },
    { id: 4, nombre: 'arroz con pollo', imagen: 'assets/extras/alitas.png' },
    { id: 5, nombre: 'arroz con pollo', imagen: 'assets/extras/alitas.png' },
    { id: 6, nombre: 'arroz con pollo', imagen: 'assets/extras/alitas.png' }
  ];
}