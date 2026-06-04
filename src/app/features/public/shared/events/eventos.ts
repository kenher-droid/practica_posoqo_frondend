import { Component, OnInit, signal } from '@angular/core';
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
}
