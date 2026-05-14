import { Component } from '@angular/core';

@Component({
  selector: 'app-bienvenida',
  imports: [],
  templateUrl: './bienvenida.html',
  styleUrl: './bienvenida.css',
})
export class Bienvenida {

  irASeccion() {
    // Scroll to the next section (nosotros)
    const nosotrosSection = document.querySelector('.hero_color');
    if (nosotrosSection) {
      nosotrosSection.scrollIntoView({ behavior: 'smooth' });
    }
  }
}