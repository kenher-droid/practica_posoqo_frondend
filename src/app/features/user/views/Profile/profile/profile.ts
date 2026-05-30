import { Component, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

interface TransaccionPuntos {
  id: number;
  tipo: 'suma' | 'resta';
  cantidad: number;
  razon: string;
  fecha: Date;
}

@Component({
  selector: 'app-profile',
  imports: [CommonModule, DatePipe],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile {
  stampGoal = 12;

  transacciones = signal<TransaccionPuntos[]>([
    {
      id: 1,
      tipo: 'suma',
      cantidad: 30,
      razon: 'Compra de Combo familiar',
      fecha: new Date('2026-05-28T15:20:00')
    },
    {
      id: 2,
      tipo: 'resta',
      cantidad: 18,
      razon: 'Canje por Refresco 1L',
      fecha: new Date('2026-05-29T13:40:00')
    }
  ]);

  pointsTotal(): number {
    return this.transacciones().reduce((sum, transaccion) => {
      return sum + (transaccion.tipo === 'suma' ? transaccion.cantidad : -transaccion.cantidad);
    }, 0);
  }

  filledStamps() {
    const count = Math.min(this.pointsTotal(), this.stampGoal);
    return Array.from({ length: count }, (_, i) => ({ id: i }));
  }

  emptyStamps() {
    const count = Math.max(this.stampGoal - this.pointsTotal(), 0);
    return Array.from({ length: count }, (_, i) => ({ id: i }));
  }

  extraPoints() {
    return Math.max(this.pointsTotal() - this.stampGoal, 0);
  }
}
