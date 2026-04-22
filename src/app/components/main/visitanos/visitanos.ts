import { Component } from '@angular/core';

@Component({
  selector: 'app-visitanos',
  standalone: true, // Asegúrate de tener esto si usas Angular moderno
  imports: [],
  templateUrl: './visitanos.html',
  styleUrl: './visitanos.css',
})
export class Visitanos {
  
  // URL configurada para navegar hacia Jr. José María Arguedas, Ayacucho
  // El parámetro 'dir' activa el modo "Cómo llegar" desde la ubicación del usuario
  
// Esta URL activa la navegación GPS desde el usuario hasta el restaurante
mapaUrl = 'https://www.google.com/maps/dir/?api=1&destination=Plaza+de+Armas+Portal+Independencia+65+Ayacucho+05001';

abrirMapa() {
  window.open(this.mapaUrl, '_blank');
}
}