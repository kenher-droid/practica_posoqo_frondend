import { Component, OnInit, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RestauranteApiService } from '../../../../../core/services/restaurante-api.service';

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
export class Profile implements OnInit {
  stampGoal = 12;
  puntosCliente = signal(0);

  transacciones = signal<TransaccionPuntos[]>([]);

  constructor(private readonly restauranteApi: RestauranteApiService) {}

  ngOnInit(): void {
    this.restauranteApi.miCliente().subscribe({
      next: (cliente) => this.puntosCliente.set(cliente.puntos)
    });
    this.restauranteApi.miHistorial().subscribe({
      next: (historial) => {
        this.transacciones.set(historial.map((item) => ({
          id: item.id,
          tipo: item.tipo === 'resta' || item.tipo === 'canje' ? 'resta' : 'suma',
          cantidad: item.puntos,
          razon: item.descripcion ?? item.tipo,
          fecha: new Date(item.fecha)
        })));
      }
    });
  }

  pointsTotal(): number {
    return this.puntosCliente() || this.transacciones().reduce((sum, transaccion) => {
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

registrarMovimiento(tipo: 'suma' | 'resta', cantidad: number, razon: string) {

  if (tipo === 'resta' && cantidad > this.pointsTotal()) {
    console.warn("No hay puntos suficientes para realizar este canje");
    return; 
  }

  const nuevaTransaccion: TransaccionPuntos = {
    id: Date.now(),
    tipo,
    cantidad,
    razon,
    fecha: new Date() 
  };

  this.transacciones.update((listaActual) => [nuevaTransaccion, ...listaActual]);
}
}
