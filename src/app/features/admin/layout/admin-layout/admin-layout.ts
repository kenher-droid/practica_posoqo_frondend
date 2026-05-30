import { Component } from '@angular/core';
import { RouterModule, Router } from "@angular/router";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './admin-layout.html',
  styleUrl: './admin-layout.css',
})
export class AdminLayout {
  constructor(private router: Router) {}

  logout(): void {
    // TODO: Limpiar sesión y tokens
    console.log('Cerrando sesión...');
    this.router.navigate(['/auth/login']);
  }
}
