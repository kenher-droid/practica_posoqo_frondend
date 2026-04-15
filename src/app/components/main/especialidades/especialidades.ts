import { Component, input, signal, computed } from '@angular/core';

export interface CarouselItem {
  title: string;
  image: string;
}

@Component({
  selector: 'app-especialidades',
  standalone: true, // Asegúrate de tenerlo si no usas NgModules
  imports: [],
  templateUrl: './especialidades.html',
  styleUrl: './especialidades.css',
})
export class Especialidades {
  items = input<CarouselItem[]>([
    { title: 'Pollo a la braza', image: 'https://picsum.photos/id/102/800/600' },
    { title: 'Cervezas', image: 'https://picsum.photos/id/225/800/600' },
    { title: 'Hamburguesas', image: 'https://picsum.photos/id/493/800/600' },
    { title: 'Pizzas', image: 'https://picsum.photos/id/292/800/600' },
    { title: 'Postres', image: 'https://picsum.photos/id/102/800/600' }
  ]);

  currentIndex = signal(0);

  private readonly CARD_WIDTH = 400; 
  private readonly GAP = 24;

  maxScroll = computed(() => {
    // Si quieres que siempre se detenga mostrando las últimas 3 cartas:
    return Math.max(0, this.items().length - 1);
  });

  // 2. Cálculo en PIXELES para evitar deformaciones:
  // Usamos el ancho de la carta + el espacio entre ellas (gap)
  transform = computed(() => {
    const offset = this.currentIndex() * (this.CARD_WIDTH + this.GAP);
    return `translateX(-${offset}px)`;
  });

  // ... dentro de la clase Especialidades

  next() {
    this.currentIndex.update(idx => {
      // Si llegamos al final del scroll, volvemos a la primera carta (0)
      if (idx >= this.maxScroll()) {
        return 0;
      }
      return idx + 1;
    });
  }

  prev() {
    this.currentIndex.update(idx => {
      // Si estamos en la primera y damos atrás, vamos a la última posición de scroll
      if (idx <= 0) {
        return this.maxScroll();
      }
      return idx - 1;
    });
  }

  goTo(idx: number) {
    // Si el usuario hace clic en un punto muy lejano, 
    // lo limitamos al scroll máximo permitido
    const target = idx > this.maxScroll() ? this.maxScroll() : idx;
    this.currentIndex.set(target);
  }
}