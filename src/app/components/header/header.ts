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
    { nombre: 'Carta', ruta: '#' },
    { nombre: 'Eventos', ruta: '#' },
    { nombre: 'Otros', ruta: '#' },
    { nombre: 'Iniciar sesión', ruta: '#' }
  ];
}
