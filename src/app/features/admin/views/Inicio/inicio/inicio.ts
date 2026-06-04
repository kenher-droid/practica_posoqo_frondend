import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RestauranteApiService, ClienteConUsuarioResponse } from '../../../../../core/services/restaurante-api.service';

interface CumpleanosCliente {
  id: number;
  nombre: string;
  fecha_nacimiento: string;
  telefono: string;
  diasRestantes: number;
}

@Component({
  selector: 'app-inicio',
  imports: [CommonModule],
  templateUrl: './inicio.html',
  styleUrl: './inicio.css',
})
export class Inicio implements OnInit {
  totalClientes = signal(0);
  totalEventos = signal(0);
  totalMenus = signal(0);
  cumpleanosProximos = signal<CumpleanosCliente[]>([]);
  error = signal('');

  constructor(private readonly restauranteApi: RestauranteApiService) {}

  ngOnInit(): void {
    this.cargarResumen();
  }

  cargarResumen(): void {
    this.restauranteApi.listarClientes().subscribe({
      next: (clientes) => {
        this.totalClientes.set(clientes.length);
        this.calcularCumpleanosProximos(clientes);
      },
      error: () => this.error.set('No se pudo cargar el resumen.')
    });

    this.restauranteApi.listarEventos().subscribe({
      next: (eventos) => this.totalEventos.set(eventos.length),
      error: () => this.error.set('No se pudo cargar el resumen.')
    });

    this.restauranteApi.listarMenus().subscribe({
      next: (menus) => this.totalMenus.set(menus.length),
      error: () => this.error.set('No se pudo cargar el resumen.')
    });
  }

  calcularCumpleanosProximos(clientes: ClienteConUsuarioResponse[]): void {
    const hoy = new Date();
    const proximosCumpleanos: CumpleanosCliente[] = [];

    clientes.forEach((cliente) => {
      if (!cliente.fecha_nacimiento) return;

      const fechaNacimiento = new Date(cliente.fecha_nacimiento);
      const proximoCumpleanos = new Date(hoy.getFullYear(), fechaNacimiento.getMonth(), fechaNacimiento.getDate());

      // Si el cumpleaños ya pasó este año, calcular para el próximo año
      if (proximoCumpleanos < hoy) {
        proximoCumpleanos.setFullYear(hoy.getFullYear() + 1);
      }

      const diasRestantes = Math.ceil((proximoCumpleanos.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24));

      // Mostrar solo cumpleaños en los próximos 30 días
      if (diasRestantes <= 30 && diasRestantes >= 0) {
        proximosCumpleanos.push({
          id: cliente.id,
          nombre: cliente.nombre || 'Cliente',
          fecha_nacimiento: cliente.fecha_nacimiento,
          telefono: cliente.telefono || 'No registrado',
          diasRestantes
        });
      }
    });

    // Ordenar por días restantes (más cercano primero)
    proximosCumpleanos.sort((a, b) => a.diasRestantes - b.diasRestantes);
    this.cumpleanosProximos.set(proximosCumpleanos);
  }
}
