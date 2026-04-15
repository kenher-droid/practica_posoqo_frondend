import { Component } from '@angular/core';

@Component({
  selector: 'app-bienvenida',
  imports: [],
  templateUrl: './bienvenida.html',
  styleUrl: './bienvenida.css',
})
export class Bienvenida {

  irASeccion() {
    // aquí luego pones la ruta que quieras
    console.log('Botón listo para redirigir');
  }
}