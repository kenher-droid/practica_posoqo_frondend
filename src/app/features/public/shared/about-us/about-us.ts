import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-about-us',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './about-us.html',
  styleUrl: './about-us.css',
})
export class AboutUs {
  activeTab: string = 'mision';

  constructor(private router: Router) {}

  selectTab(tab: string): void {
    this.activeTab = tab;
  }

  goBack(): void {
    this.router.navigate(['/']);
  }

  // Datos de Misión
  misionData = {
    title: 'Nuestra Misión',
    content: `En Cervecería Artesanal POSOQO, nuestra misión es brindar experiencias gastronómicas excepcionales mediante cervezas artesanales de la más alta calidad, combinadas con una propuesta culinaria innovadora. Nos comprometemos a ser un espacio donde la tradición y la modernidad convergen, ofreciendo a nuestros clientes no solo bebidas y comidas de excelencia, sino también momentos memorables en compañía de amigos y familia.

Valoramos la autenticidad en cada aspecto de nuestro negocio: desde la selección de nuestros ingredientes hasta la atención personalizada que brindamos. Cada cerveza que elaboramos es resultado de dedicación, experiencia y pasión por el arte cervecero.`
  };

  // Datos de Visión
  visionData = {
    title: 'Nuestra Visión',
    content: `Aspiramos a posicionarnos como la cervecería artesanal más reconocida y admirada de la región, siendo referente en innovación y calidad. Queremos que POSOQO sea sinónimo de excelencia, inclusión y sostenibilidad.

Nuestro objetivo es expandir nuestro alcance manteniendo la esencia de nuestro trabajo artesanal, creando nuevas experiencias para nuestros clientes y contribuyendo positivamente al desarrollo de la comunidad local.`
  };

  // Datos de Valores
  valoresData = {
    title: 'Nuestros Valores',
    values: [
      {
        nombre: 'Autenticidad',
        descripcion: 'Trabajamos con transparencia en cada proceso, desde la producción hasta la atención al cliente.'
      },
      {
        nombre: 'Calidad',
        descripcion: 'No comprometemos la calidad. Cada producto refleja nuestro compromiso con la excelencia.'
      },
      {
        nombre: 'Innovación',
        descripcion: 'Constantemente buscamos nuevas formas de mejorar nuestras ofertas y experiencias.'
      },
      {
        nombre: 'Comunidad',
        descripcion: 'Creemos en el poder de la comunidad y nos comprometemos a ser un espacio inclusivo para todos.'
      },
      {
        nombre: 'Sostenibilidad',
        descripcion: 'Operamos considerando el impacto ambiental y social de nuestras acciones.'
      },
      {
        nombre: 'Pasión',
        descripcion: 'La pasión por lo que hacemos es el motor que nos impulsa cada día.'
      }
    ]
  };

  // Datos de Historia
  historiaData = {
    title: 'Nuestra Historia',
    milestones: [
      {
        year: '2018',
        evento: 'Fundación',
        descripcion: 'POSOQO nace como un sueño de emprendedores apasionados por la cerveza artesanal en Ayacucho.'
      },
      {
        year: '2019',
        evento: 'Primera Cerveza',
        descripcion: 'Lanzamos nuestra primera cerveza artesanal, marcando el inicio de un viaje extraordinario.'
      },
      {
        year: '2020',
        evento: 'Expansión',
        descripcion: 'A pesar de los desafíos, expandimos nuestro menú y mejoramos nuestras instalaciones.'
      },
      {
        year: '2022',
        evento: 'Reconocimiento',
        descripcion: 'Recibimos reconocimiento local y regional por nuestras contribuciones al sector de cervecería artesanal.'
      },
      {
        year: '2023',
        evento: 'Innovación Digital',
        descripcion: 'Lanzamos nuestra plataforma digital y programa de fidelización de clientes.'
      },
      {
        year: '2024-2025',
        evento: 'Crecimiento Continuo',
        descripcion: 'Continuamos innovando, expandiendo nuestro alcance y fortaleciendo nuestra comunidad.'
      }
    ]
  };

  // Datos de Equipo
  equipoData = {
    title: 'Nuestro Equipo',
    descripcion: 'Contamos con un equipo apasionado y dedicado de profesionales en diferentes áreas:',
    areas: [
      {
        nombre: 'Equipo de Producción',
        descripcion: 'Maestros cerveceros con experiencia internacional que garantizan la calidad de cada lote.'
      },
      {
        nombre: 'Equipo Culinario',
        descripcion: 'Chefs innovadores que crean propuestas gastronómicas que complementan nuestras cervezas.'
      },
      {
        nombre: 'Equipo de Servicio',
        descripcion: 'Personal atento y capacitado que garantiza una experiencia inolvidable para cada cliente.'
      },
      {
        nombre: 'Equipo Administrativo',
        descripcion: 'Profesionales comprometidos con la eficiencia y el crecimiento sostenible de la empresa.'
      }
    ]
  };

  // Datos de Contacto
  contactoData = {
    title: 'Contáctanos',
    direccion: 'Plaza de Armas, Portal Independencia Nº65, Ayacucho 05001, Perú',
    telefonos: ['+51 912 345 678', '+51 912 144 141'],
    correo: 'info@posoqo.com',
    horario: 'Abierto de lunes a domingo de 10:00 AM a 11:00 PM'
  };
}
