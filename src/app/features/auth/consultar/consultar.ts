import { Component, OnInit, Inject, PLATFORM_ID, HostListener } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

// IMPORTACIÓN DE TUS OTROS COMPONENTES
import { RegistroComponent } from '../registro/registro';
import { RecuperarComponent } from '../recuperar/recuperar';
import { Inicio } from '../../user/inicio/inicio';

@Component({
  selector: 'app-consultar',
  standalone: true,
  imports: [CommonModule, FormsModule, RegistroComponent, RecuperarComponent, Inicio],
  templateUrl: './consultar.html',
  styleUrl: './consultar.css'
})
export class ConsultarComponent implements OnInit {
  
  nombreUsuario: string = 'Invitado';
  seccion: string = 'login'; // Controla la vista actual
  
  usuario = {
    numero: '', 
    password: ''
  };

  mostrarPassword = false;

  // --- LÓGICA PARA EL BOTÓN ATRÁS ---
  @HostListener('window:popstate', ['$event'])
  onPopState(event: any) {
    if (this.seccion !== 'login') {
      this.manejarVueltaALogin();
      window.history.pushState(null, '', window.location.href);
    }
  }

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router 
  ) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      window.history.pushState(null, '', window.location.href);

      const datos = localStorage.getItem('usuario');
      if (datos) {
        try {
          const usuarioObj = JSON.parse(datos);
          if (usuarioObj && usuarioObj.nombre) {
            this.nombreUsuario = usuarioObj.nombre.split(' ')[0];
          }
        } catch (error) {
          console.error("Error al procesar datos de sesión", error);
        }
      }
    }
  }

  // FUNCIÓN CRÍTICA: Limpia los inputs para que no se queden guardados
  limpiarFormulario() {
    this.usuario = {
      numero: '',
      password: ''
    };
    this.mostrarPassword = false;
  }

  // Se ejecuta cuando el usuario regresa desde cualquier otra sección
  manejarVueltaALogin() {
    this.limpiarFormulario();
    this.seccion = 'login';
  }

  iniciarSesion() {
    if (isPlatformBrowser(this.platformId)) {
      const datosGuardados = localStorage.getItem('usuario');

      if (!datosGuardados) {
        alert('No se encontró ninguna cuenta registrada.');
        return;
      }

      const usuarioRegistrado = JSON.parse(datosGuardados);

      if (
        this.usuario.numero === usuarioRegistrado.telefono && 
        this.usuario.password === usuarioRegistrado.password
      ) {
        alert('Sesión iniciada correctamente. Bienvenido ' + usuarioRegistrado.nombre);
        this.nombreUsuario = usuarioRegistrado.nombre.split(' ')[0];
        
        this.seccion = 'inicio'; 
        window.history.pushState(null, '', window.location.href);
        
      } else {
        alert('Usuario o contraseña incorrectos');
      }
    }
  }

  togglePassword() {
    this.mostrarPassword = !this.mostrarPassword;
  }

  irRegistro() {
    this.limpiarFormulario(); // Limpiar antes de ir a registro
    this.seccion = 'registro';
    window.history.pushState(null, '', window.location.href);
  }

  irRecuperar() {
    this.limpiarFormulario(); // Limpiar antes de ir a recuperar
    this.seccion = 'recuperar';
    window.history.pushState(null, '', window.location.href);
  }

  realizarConsulta() {
    console.log('Realizando búsqueda para el usuario:', this.nombreUsuario);
  }
}