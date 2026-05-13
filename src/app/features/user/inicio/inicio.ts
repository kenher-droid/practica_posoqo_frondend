import { Component, OnInit, Inject, PLATFORM_ID, Output, EventEmitter } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './inicio.html',
  styleUrls: ['./inicio.css']
})
export class Inicio implements OnInit {
  @Output() cerrar = new EventEmitter<void>();
  nombreUsuario: string = 'Invitado';

  constructor(@Inject(PLATFORM_ID) private platformId: Object, private router: Router) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      const datos = localStorage.getItem('usuario');
      if (datos) {
        try {
          const usuarioObj = JSON.parse(datos);
          if (usuarioObj && usuarioObj.nombre) {
            this.nombreUsuario = usuarioObj.nombre.split(' ')[0];
          }
        } catch (error) { console.error("Error", error); }
      }
    }
  }

  irAWhatsApp() {
    const url = `https://wa.me/51930734075?text=Hola`;
    window.open(url, '_blank');
  }

  cerrarSesion() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('token');
      this.cerrar.emit(); // Regresa al login
    }
  }

  verEventos() { this.router.navigate(['/eventos']); }
  verCarta() { this.router.navigate(['/carta']); }
  volverInicio() { this.router.navigate(['/home']); }
}