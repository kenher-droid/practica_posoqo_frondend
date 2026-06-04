import { Component, signal, computed } from '@angular/core';

interface PasosFidelidad {
  subtitulo: string;
  imagen: string;
}

@Component({
  selector: 'app-especialidades',
  standalone: true,
  imports: [],
  templateUrl: './especialidades.html',
  styleUrl: './especialidades.css',
})
export class Especialidades {
  // Guardamos el índice del paso activo (0, 1 o 2)
  pasoActual = signal<number>(0);

  // Definimos la información vinculada a cada paso del lado derecho
  private pasosData: PasosFidelidad[] = [
    { 
      subtitulo: 'Cada orden suma.', 
      imagen: '/assets/extras/alitas.png' 
    },
    { 
      subtitulo: '¡Suma en la app o local!', 
      imagen: '/assets/extras/cerveza_artesanal.png' 
    },
    { 
      subtitulo: 'Canjea tus premios.', 
      imagen: '/assets/extras/hamburguesa.png' 
    }
  ];

  // Devuelve la imagen correspondiente al paso actual
  imagenActiva = computed(() => this.pasosData[this.pasoActual()].imagen);

  // Devuelve el subtítulo correspondiente al paso actual
  subtituloActivo = computed(() => this.pasosData[this.pasoActual()].subtitulo);

  // Cambia el paso activo al hacer click
  cambiarPaso(indice: number): void {
    this.pasoActual.set(indice);
  }
}
