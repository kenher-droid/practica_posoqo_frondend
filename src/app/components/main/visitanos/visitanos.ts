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
mapaUrl = 'https://www.google.com/maps/place/Cervecer%C3%ADa+Artesanal+POSOQO%2F+Restaurante/@-13.1609153,-74.2261923,53m/data=!3m1!1e3!4m21!1m14!4m13!1m4!2m2!1d-74.2061816!2d-13.1732302!4e1!1m6!1m2!1s0x91127df97f2c218f:0x76ef074fb4bddcda!2sCervecer%C3%ADa+Artesanal+POSOQO%2F+Restaurante,+Plaza+de+Armas,+Portal+Independencia+N%C2%BA65,+Jr.+Argentina+Mz.+Y+Lt.+05,+Ayacucho+05001!2m2!1d-74.2259403!2d-13.1610465!3e0!3m5!1s0x91127df97f2c218f:0x76ef074fb4bddcda!8m2!3d-13.1610465!4d-74.2259403!16s%2Fg%2F11rj42hx9z?entry=ttu&g_ep=EgoyMDI2MDQyMC4wIKXMDSoASAFQAw%3D%3D';

abrirMapa() {
  window.open(this.mapaUrl, '_blank');
}
}