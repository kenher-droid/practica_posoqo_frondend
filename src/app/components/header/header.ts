import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [RouterModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  menu = [
    { nombre: 'Inicio', ruta: '#' },
    { nombre: 'Productos', ruta: '#' },
    { nombre: 'Servicios', ruta: '#' },
    { nombre: 'Contacto', ruta: '#' }
  ];
}
