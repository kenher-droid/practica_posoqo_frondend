import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RestauranteApiService, EventoResponse } from '../../../../core/services/restaurante-api.service';
import { Header } from '../header/header';

@Component({
  selector: 'app-eventos',
  standalone: true,
  imports: [CommonModule, Header],
  templateUrl: './eventos.html',
  styleUrls: ['./eventos.css']
})
export class Eventos implements OnInit {
  eventos = signal<EventoResponse[]>([]);
  loading = signal(true);
  error = signal('');
  indiceActual = signal(0);

  eventoActual = computed(() => {
    const lista = this.eventos();
    if (!lista.length) return null;
    return lista[this.indiceActual()];
  });

  constructor(private readonly restauranteApi: RestauranteApiService) {}

  ngOnInit(): void {
    this.cargarEventos();
  }

  cargarEventos(): void {
    this.restauranteApi.listarEventos().subscribe({
      next: (eventos: EventoResponse[]) => {
        this.eventos.set(eventos);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('No se pudieron cargar los eventos.');
        this.loading.set(false);
      }
    });
  }

  anterior(): void {
    const total = this.eventos().length;
    this.indiceActual.update(i => (i - 1 + total) % total);
  }

  siguiente(): void {
    const total = this.eventos().length;
    this.indiceActual.update(i => (i + 1) % total);
  }

  irA(index: number): void {
    this.indiceActual.set(index);
  }

  formatearFecha(fecha: string): string {
    const [anio, mes, dia] = fecha.split('-');
    const meses = ['enero','febrero','marzo','abril','mayo','junio',
                   'julio','agosto','septiembre','octubre','noviembre','diciembre'];
    return `${parseInt(dia)} de ${meses[parseInt(mes) - 1]}, ${anio}`;
  }

  formatearHora(hora: string): string {
    return hora.substring(0, 5) + ' hrs';
  }
}
