import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RestauranteApiService } from '../../../../../core/services/restaurante-api.service';

interface UsuarioVista {
  id: number;
  nombre: string;
  apellidos: string;
  telefono: string;
  gmail: string;
  contrasena: string;
  puntos: number;
  fecha_nacimiento: string;
  id_rol: number;
}

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './usuarios.html',
  styleUrl: './usuarios.css',
})
export class Usuarios implements OnInit {
  usuarios = signal<UsuarioVista[]>([]);
  error = signal('');

  constructor(private readonly restauranteApi: RestauranteApiService) {}

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  cargarUsuarios(): void {
    this.restauranteApi.listarClientes().subscribe({
      next: (clientes) => {
        this.usuarios.set(clientes.map((cliente) => ({
          id: cliente.id,
          nombre: cliente.nombre ?? '',
          apellidos: '',
          telefono: cliente.telefono ?? '',
          gmail: cliente.email ?? '',
          contrasena: '',
          puntos: Number(cliente.puntos),
          fecha_nacimiento: cliente.fecha_nacimiento,
          id_rol: 3
        })));
      },
      error: () => this.error.set('No se pudieron cargar los usuarios.')
    });
  }
}
