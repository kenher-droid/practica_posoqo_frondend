import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { switchMap } from 'rxjs';
import { AuthService } from '../../../../../core/services/auth.service';
import { RestauranteApiService } from '../../../../../core/services/restaurante-api.service';

@Component({
  selector: 'app-login',
  imports: [RouterModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  telefono = '';
  password = '';
  loading = false;
  error = '';

  constructor(
    private readonly authService: AuthService,
    private readonly restauranteApi: RestauranteApiService,
    private readonly router: Router
  ) {}

  submit(): void {
    this.error = '';
    if (!this.telefono.trim() || !this.password) {
      this.error = 'Ingresa tu telefono y contrasena.';
      return;
    }

    this.loading = true;
    this.authService.login({ telefono: this.telefono.trim(), password: this.password }).pipe(
      switchMap(() => this.restauranteApi.miUsuario())
    ).subscribe({
      next: (usuario) => {
        this.loading = false;
        const destino = usuario.id_rol === 3 ? '/user/profile' : '/admin/inicio';
        void this.router.navigate([destino]);
      },
      error: (err) => {
        console.error('Error en login:', err);
        this.loading = false;
        this.error = 'No se pudo iniciar sesion. Revisa tus datos.';
      }
    });
  }
}
