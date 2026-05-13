import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
// IMPORTANTE: El nombre de la clase debe ser ConsultarComponent
import { ConsultarComponent }   from './features/auth/consultar/consultar';
@Component({
  selector: 'app-root',
  standalone: true,
  // Agregamos ConsultarComponent a los imports para que puedas usar su etiqueta
  imports: [RouterOutlet, ConsultarComponent], 
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('posoqo_frondend');
}