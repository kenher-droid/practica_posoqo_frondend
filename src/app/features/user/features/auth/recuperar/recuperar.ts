import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { Router } from '@angular/router';

@Component({
  selector: 'app-recuperar',
  standalone: true,
  imports: [CommonModule, FormsModule], 
  templateUrl: './recuperar.html',
  styleUrl: './recuperar.css'
})
export class RecuperarComponent {
  @Output() volver = new EventEmitter<void>();

  contactoUsuario: string = '';
  nuevaPassword: string = ''; 
  pasoDos: boolean = false;   
  mostrarPassword: boolean = false; 

  constructor(private router: Router) {}

  togglePassword() { this.mostrarPassword = !this.mostrarPassword; }

  enviarCodigo() {
    const registro = localStorage.getItem('usuario');
    if (!this.contactoUsuario.trim()) { alert('Ingresa contacto'); return; }
    if (registro) {
      const datos = JSON.parse(registro);
      if (this.contactoUsuario === datos.telefono) {
        alert(`¡Validación exitosa!`);
        this.pasoDos = true; 
      } else { alert('No coincide'); }
    } else { alert('No hay cuenta'); }
  }

  cambiarPassword() {
    if (this.nuevaPassword.length < 4) { alert('Mínimo 4 caracteres'); return; }
    const registro = localStorage.getItem('usuario');
    if (registro) {
      let datos = JSON.parse(registro);
      datos.password = this.nuevaPassword; 
      localStorage.setItem('usuario', JSON.stringify(datos)); 
      alert('Contraseña actualizada');
      this.volver.emit(); // Regresa al login
    }
  }

  volverLogin() { this.volver.emit(); }
}