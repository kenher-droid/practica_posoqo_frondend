import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Header } from '../header/header';

@Component({
  selector: 'app-terms-and-conditions',
  standalone: true,
  imports: [CommonModule, Header],
  templateUrl: './terms-and-conditions.html',
  styleUrl: './terms-and-conditions.css',
})
export class TermsAndConditions implements OnInit {
  activeTab: string = 'terminos';

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Leer parámetro de query para establecer la pestaña inicial
    this.route.queryParams.subscribe(params => {
      if (params['tab']) {
        this.activeTab = params['tab'];
      }
    });
  }

  selectTab(tab: string): void {
    this.activeTab = tab;
  }

  goBack(): void {
    this.router.navigate(['/']);
  }

  // Datos de Términos y Condiciones
  terminosData = {
    title: 'Términos y Condiciones',
    sections: [
      {
        id: 'aceptacion',
        title: 'Aceptación de Términos',
        content: `Al acceder y utilizar los servicios de Cervecería Artesanal POSOQO, incluyendo nuestro restaurante, sitio web y aplicación móvil, 
                  usted acepta estar vinculado por estos términos y condiciones. Si no está de acuerdo con alguna parte de estos términos, 
                  por favor absténgase de utilizar nuestros servicios.`
      },
      {
        id: 'uso',
        title: 'Autorización de Uso',
        content: `Se le otorga una licencia limitada, no exclusiva y revocable para acceder y utilizar nuestros servicios únicamente para 
                  propósitos personales y no comerciales. No puede reproducir, distribuir o transmitir contenido sin nuestro consentimiento expreso.`
      },
      {
        id: 'responsabilidad',
        title: 'Responsabilidades del Usuario',
        content: `Usted es responsable de mantener la confidencialidad de su cuenta y contraseña. Además, acepta ser responsable de todas 
                  las actividades que ocurran bajo su cuenta. Debe informarnos inmediatamente de cualquier uso no autorizado de su cuenta.`
      },
      {
        id: 'limitacion',
        title: 'Limitación de Responsabilidad',
        content: `Cervecería Artesanal POSOQO no será responsable por daños indirectos, incidentales, especiales o consecuentes que resulten 
                  del uso o la imposibilidad de usar nuestros servicios, incluso si se ha advertido de la posibilidad de tales daños.`
      },
      {
        id: 'modificacion',
        title: 'Modificación de Servicios',
        content: `Nos reservamos el derecho de modificar o suspender nuestros servicios en cualquier momento, con o sin aviso previo. 
                  No seremos responsables ante usted o terceros por cualquier modificación o discontinuación de los servicios.`
      },
      {
        id: 'vinculante',
        title: 'Naturaleza Vinculante',
        content: `Estos términos y condiciones constituyen el acuerdo completo entre usted y Cervecería Artesanal POSOQO respecto a 
                  los servicios. Si alguna disposición es inválida, el resto permanecerá en vigencia.`
      }
    ]
  };

  // Datos de Política de Puntos
  puntosData = {
    title: 'Política de Puntos y Recompensas',
    sections: [
      {
        id: 'programa',
        title: '¿Qué es el Programa de Puntos?',
        content: `Nuestro programa de puntos de fidelización recompensa a nuestros clientes leales con puntos en cada compra. 
                  Estos puntos pueden ser canjeados por descuentos, comidas gratuitas y ofertas especiales en nuestro restaurante y cervecería.`
      },
      {
        id: 'acumulacion',
        title: 'Acumulación de Puntos',
        content: `Por cada nuevo sol (S/) gastado en nuestro establecimiento, acumula 1 punto. Los puntos se acumulan automáticamente 
                  en su cuenta cuando realiza pagos con su tarjeta de fidelización o cuando se registra con su correo electrónico.`
      },
      {
        id: 'canjes',
        title: 'Canjes y Recompensas',
        content: `Con 50 puntos: Obtén un descuento del 10% en tu próxima compra.
                  Con 100 puntos: Disfruta de una comida o bebida especial valorizada en S/ 50.
                  Con 150 puntos: Acceso a eventos exclusivos y degustaciones especiales.
                  Con 200 puntos: Vale de consumo de S/ 100 válido por 3 meses.`
      },
      {
        id: 'vigencia',
        title: 'Vigencia de Puntos',
        content: `Los puntos tienen una vigencia de 1 año desde su fecha de acumulación. Si no son utilizados dentro de este período, 
                  expirarán automáticamente. No somos responsables por puntos expirados. Notificaremos por correo electrónico con 30 días de anticipación.`
      },
      {
        id: 'cambios',
        title: 'Cambios en la Política de Puntos',
        content: `Nos reservamos el derecho de modificar esta política de puntos en cualquier momento. Los cambios serán comunicados 
                  con al menos 15 días de anticipación. Su uso continuado del programa implica aceptación de las nuevas condiciones.`
      },
      {
        id: 'cancelacion',
        title: 'Cancelación de Puntos',
        content: `Nos reservamos el derecho de cancelar puntos si detectamos actividad fraudulenta o violación de estos términos. 
                  Los puntos son intransferibles y no pueden ser vendidos ni cedidos a terceros.`
      }
    ]
  };

  // Datos de Política de Cookies
  cookiesData = {
    title: 'Política de Cookies',
    sections: [
      {
        id: 'definicion',
        title: '¿Qué son las Cookies?',
        content: `Las cookies son pequeños archivos de texto que se almacenan en su dispositivo cuando visita nuestro sitio web o aplicación. 
                  Estas no contienen virus ni descargan programas maliciosos. Las cookies ayudan a mejorar su experiencia de usuario.`
      },
      {
        id: 'tipos',
        title: 'Tipos de Cookies que Utilizamos',
        content: `Cookies Esenciales: Necesarias para el funcionamiento básico del sitio (autenticación, seguridad).
                  Cookies de Preferencia: Recuerdan sus preferencias de navegación e idioma.
                  Cookies Analíticas: Nos ayudan a entender cómo usa nuestro sitio para mejorarlo continuamente.
                  Cookies de Marketing: Utilizadas para mostrarle publicidad personalizada según su comportamiento.`
      },
      {
        id: 'control',
        title: 'Control de Cookies',
        content: `Puede controlar y eliminar cookies a través de la configuración de su navegador. Tenga en cuenta que deshabilitar 
                  cookies puede afectar la funcionalidad de nuestro sitio. La mayoría de navegadores permite configurar notificaciones 
                  cuando se reciben cookies nuevas.`
      },
      {
        id: 'terceros',
        title: 'Cookies de Terceros',
        content: `Utilizamos servicios de terceros como Google Analytics, Facebook Pixel y procesadores de pagos que pueden instalar 
                  sus propias cookies. No tenemos control total sobre estas cookies, pero trabajamos con ellas según se describe en esta política.`
      },
      {
        id: 'retencion',
        title: 'Retención de Datos de Cookies',
        content: `Las cookies de sesión se eliminan cuando cierra su navegador. Las cookies persistentes se retienen por períodos variables, 
                  normalmente entre 6 meses y 2 años. Puede solicitar la eliminación de sus datos en cualquier momento.`
      }
    ]
  };

  // Datos de Política de Privacidad
  privacidadData = {
    title: 'Política de Privacidad y Seguridad de Datos',
    sections: [
      {
        id: 'recopilacion',
        title: 'Información que Recopilamos',
        content: `Recopilamos información que usted proporciona voluntariamente, como nombre, correo electrónico, teléfono y dirección. 
                  También recopilamos automáticamente información sobre su navegación, ubicación (con su consentimiento) e historial de compras.`
      },
      {
        id: 'uso',
        title: 'Cómo Utilizamos su Información',
        content: `Utilizamos su información para procesar pedidos, gestionar su cuenta de fidelización, enviar promociones (si lo autoriza), 
                  mejorar nuestros servicios, prevenir fraude y cumplir con obligaciones legales.`
      },
      {
        id: 'proteccion',
        title: 'Protección de Datos',
        content: `Implementamos medidas de seguridad estándar como encriptación SSL, firewalls y autenticación de dos factores. 
                  Todos los datos se almacenan en servidores seguros. Sin embargo, ningún sistema es 100% seguro.`
      },
      {
        id: 'compartir',
        title: 'Compartición de Datos',
        content: `No vendemos sus datos a terceros. Solo compartimos información con proveedores de servicios necesarios (procesadores de pagos, 
                  empresas de mensajería) bajo acuerdos de confidencialidad. Podemos revelar información cuando sea requerido por ley.`
      },
      {
        id: 'derechos',
        title: 'Sus Derechos',
        content: `Tiene derecho a acceder, corregir y eliminar sus datos personales. Puede revocar el consentimiento para comunicaciones de 
                  marketing en cualquier momento. Para ejercer estos derechos, contáctenos a través de nuestros canales de atención.`
      },
      {
        id: 'contacto',
        title: 'Contacto para Privacidad',
        content: `Si tiene preguntas sobre nuestra política de privacidad, contáctenos en: 
                  Email: privacidad@posoqo.com
                  Teléfono: +51 066 128 252
                  Dirección: Plaza de Armas, Ayacucho, Perú`
      }
    ]
  };

  // Datos de Políticas Adicionales
  politicasData = {
    title: 'Políticas Adicionales de Seguridad',
    sections: [
      {
        id: 'seguridad-pago',
        title: 'Seguridad en Pagos Online',
        content: `Todos los pagos se procesan a través de plataformas certificadas con encriptación SSL de 256 bits. 
                  Nunca almacenamos números completos de tarjeta. Cumplimos con los estándares PCI DSS para proteger su información financiera.`
      },
      {
        id: 'fraude',
        title: 'Prevención de Fraude',
        content: `Contamos con sistemas de detección de fraude en tiempo real. Si detectamos actividad sospechosa, podemos:
                  - Verificar su identidad mediante un SMS o correo confirmación
                  - Suspender temporalmente su cuenta
                  - Requerir cambio de contraseña
                  Le notificaremos de cualquier acción que tomemos.`
      },
      {
        id: 'contrasena',
        title: 'Recomendaciones de Contraseña Segura',
        content: `Para proteger su cuenta, recomendamos:
                  - Utilizar una contraseña de al menos 8 caracteres
                  - Incluir mayúsculas, minúsculas, números y caracteres especiales
                  - No compartir su contraseña con nadie
                  - Cambiar su contraseña cada 3 meses
                  - No usar información personal en su contraseña`
      },
      {
        id: 'autenticacion',
        title: 'Autenticación de Dos Factores',
        content: `Ofrecemos autenticación de dos factores opcional para mayor seguridad. Cuando está habilitada, deberá proporcionar un código 
                  adicional además de su contraseña al iniciar sesión desde dispositivos nuevos.`
      },
      {
        id: 'dispositivos',
        title: 'Seguridad en Dispositivos Públicos',
        content: `Si accede a su cuenta desde un dispositivo público (ciber, bibliotecas, etc.):
                  - Asegúrese de cerrar sesión completamente
                  - Use conexiones seguras (VPN recomendada)
                  - No guarde su contraseña en el navegador
                  - Limpie el historial de navegación después`
      }
    ]
  };
}
