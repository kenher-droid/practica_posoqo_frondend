import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { Bienvenida } from '../main/bienvenida/bienvenida';
import { Especialidades } from '../main/especialidades/especialidades';
import { Nosotros } from '../main/nosotros/nosotros';
import { Visitanos } from '../main/visitanos/visitanos';

@Component({
  selector: 'app-hero-banner',
  imports: [RouterLink, RouterOutlet, Bienvenida, Especialidades, Nosotros, Visitanos],
  templateUrl: './hero-banner.html',
  styleUrl: './hero-banner.css',
})
export class HeroBanner {}
