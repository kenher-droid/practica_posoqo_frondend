import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-padding',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './padding.html',
  styleUrl: './padding.css',
})
export class Padding {

  // 🔥 URL de Google Maps (tu dirección exacta)
mapaUrl = encodeURI('https://www.google.com/maps/search/?api=1&query=Plaza de Armas, Portal Independencia Nº65, Jr. Argentina Mz. Y Lt. 05, Ayacucho 05001');
  // 🔥 Función para abrir el mapa
  abrirMapa() {
    window.open(this.mapaUrl, '_blank');
  }

  // Datos de Ubicación con el nuevo icono
  ubicacion = {
    icono: '',
    lineas: [
      'Parque Sucre',
      'Av. los olivos',
      'Huamanga-Ayacucho'
    ]
  };

  contactos = [
    { etiqueta: 'Celular 1', valor: '+51 912 345 678' },
    { etiqueta: 'Celular 2', valor: '+51 912 144 141' },
    { etiqueta: 'Correo', valor: 'emailexample@gmail.com' }
  ];

  informacion = [
    { nombre: 'Terminos y condiciones', ruta: '/terminos' },
    { nombre: 'Politicas de reservas', ruta: '/reservas' },
    { nombre: 'Libro de reclamaciones', ruta: '/reclamos' }
  ];

  sobreNosotros = [
    { nombre: 'Quienes somos', ruta: '/nosotros' },
    { nombre: 'Cartas', ruta: '/cartas' }
  ];

  eventoLink = { nombre: 'eventos', ruta: '/eventos' };
  // 🔥 Redes sociales
redes = {
  instagram: 'https://www.instagram.com/posoqocervezaayacuchana/',
  facebook: 'https://www.facebook.com/posoqo/?locale=es_LA'
};

abrirLink(url: string) {
  window.open(url, '_blank');
}
}