import { Component, signal, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { Bienvenida } from '../sections/bienvenida/bienvenida';
import { Especialidades } from '../sections/especialidades/especialidades';
import { Nosotros } from '../sections/nosotros/nosotros';
import { Visitanos } from '../sections/visitanos/visitanos';
import { Platos } from '../sections/platos/platos';

@Component({
  selector: 'app-landing-page',
  imports: [CommonModule, Bienvenida, Especialidades, Nosotros, Visitanos, Platos],
  templateUrl: './landing-page.html',
  styleUrl: './landing-page.css',
})
export class LandingPage {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly router = inject(Router);

  mostrarModal = signal(this.verificarEdadConfirmada() ? false : true);

  private verificarEdadConfirmada(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      return sessionStorage.getItem('edadVerificada') === '1';
    }
    return false;
  }

  confirmarEdad(): void {
    if (isPlatformBrowser(this.platformId)) {
      sessionStorage.setItem('edadVerificada', '1');
    }
    this.mostrarModal.set(false);
  }

  rechazarEdad(): void {
    window.location.href = 'https://www.google.com';
  }
}
