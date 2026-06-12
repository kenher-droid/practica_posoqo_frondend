import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  imports: [RouterModule, FormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  nombre = '';
  fechaNacimiento = '';
  email = '';
  telefono = '';
  password = '';
  loading = false;
  error = '';

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  submit(): void {
    this.error = '';
    if (!this.nombre.trim() || !this.fechaNacimiento || !this.telefono.trim() || !this.password) {
      this.error = 'Completa los campos obligatorios.';
      return;
    }

    // Validar que sea mayor o igual a 18 años
    const hoy = new Date();
    const nacimiento = new Date(this.fechaNacimiento);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }
    if (edad < 18) {
      this.error = 'Debes tener al menos 18 años para registrarte.';
      return;
    }

    this.loading = true;
    this.authService.register({
      nombre: this.nombre.trim(),
      fecha_nacimiento: this.fechaNacimiento,
      email: this.email.trim() || null,
      telefono: this.telefono.trim(),
      password: this.password
    }).subscribe({
      next: () => {
        this.loading = false;
        void this.router.navigate(['/auth/login']);
      },
      error: () => {
        this.loading = false;
        this.error = 'No se pudo crear la cuenta.';
      }
    });
  }
}
