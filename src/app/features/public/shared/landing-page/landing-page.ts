import { Component } from '@angular/core';
import { Bienvenida } from '../sections/bienvenida/bienvenida';
import { Especialidades } from '../sections/especialidades/especialidades';
import { Nosotros } from '../sections/nosotros/nosotros';
import { Visitanos } from '../sections/visitanos/visitanos';

@Component({
  selector: 'app-landing-page',
  imports: [Bienvenida, Especialidades, Nosotros, Visitanos],
  templateUrl: './landing-page.html',
  styleUrl: './landing-page.css',
})

export class LandingPage {}