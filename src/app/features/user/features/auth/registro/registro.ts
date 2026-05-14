import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './registro.html',
  styleUrls: ['./registro.css']
})
export class RegistroComponent {
  @Output() volver = new EventEmitter<void>(); // Canal para volver al login

  constructor(private router: Router) {}

  mostrarPassword = false;
  usuario = { nombre: '', fecha: '', telefono: '', password: '' };

  togglePassword() { this.mostrarPassword = !this.mostrarPassword; }

  soloNumeros(event: KeyboardEvent) {
    const charCode = event.key;
    if (!/^\d$/.test(charCode)) { event.preventDefault(); }
  }

  formatearFecha(event: any) {
    let value = event.target.value.replace(/\D/g, ''); 
    if (value.length > 8) { value = value.substring(0, 8); }
    let result = '';
    if (value.length <= 2) { result = value; } 
    else if (value.length <= 4) { result = value.substring(0, 2) + '/' + value.substring(2); } 
    else { result = value.substring(0, 2) + '/' + value.substring(2, 4) + '/' + value.substring(4, 8); }
    this.usuario.fecha = result;
  }

  validarContacto(valor: string): boolean {
    const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const regexTelefono = /^[0-9]{7,15}$/; 
    return regexCorreo.test(valor) || regexTelefono.test(valor);
  }

  crearCuenta() {
    if (this.usuario.nombre.trim() === '' || this.usuario.fecha.trim() === '' || 
        this.usuario.telefono.trim() === '' || this.usuario.password.trim() === '') {
      alert('Por favor, completa todos los campos');
      return;
    }
    if (this.usuario.fecha.length !== 10) { alert('Formato DD/MM/AAAA'); return; }
    if (!this.validarContacto(this.usuario.telefono)) { alert('Contacto inválido'); return; }

    localStorage.setItem('usuario', JSON.stringify(this.usuario));
    alert('Cuenta creada correctamente');
    this.volver.emit(); // Regresa al componente Consultar
  }
}