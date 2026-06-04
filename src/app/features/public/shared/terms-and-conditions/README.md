# Componente de Términos y Condiciones 📋

## Descripción

Componente standalone de Angular que proporciona una interfaz completa y responsiva para mostrar:

- **Términos y Condiciones** - Política general de uso de servicios
- **Política de Puntos** - Sistema de recompensas y fidelización
- **Política de Cookies** - Información sobre el uso de cookies
- **Privacidad y Seguridad de Datos** - Protección de información personal
- **Medidas de Seguridad** - Consejos y políticas de seguridad adicionales

## Características

✅ Interfaz con pestañas (tabs) interactivas  
✅ Diseño responsivo (móvil, tablet, desktop)  
✅ Contenido contextualizado para cervecería/restaurante  
✅ Tabla de canjes de puntos  
✅ Consejos de seguridad destacados  
✅ Estilos modernos con paleta de colores de POSOQO  
✅ Componente standalone (sin dependencias de módulos)  

## Estructura de Archivos

```
src/app/features/public/shared/terms-and-conditions/
├── terms-and-conditions.ts       # Componente principal
├── terms-and-conditions.html     # Template
├── terms-and-conditions.css      # Estilos
├── index.ts                      # Exportación
└── README.md                     # Este archivo
```

## Instalación y Uso

### 1. Importar el Componente

En el archivo donde quieras usar el componente (por ejemplo, en `public-layout.ts` o en un archivo de rutas):

```typescript
import { TermsAndConditions } from '@app/features/public/shared/terms-and-conditions';

@Component({
  selector: 'app-public-layout',
  standalone: true,
  imports: [TermsAndConditions, RouterModule, CommonModule],
  template: `
    <app-header></app-header>
    <app-terms-and-conditions></app-terms-and-conditions>
    <app-footer></app-footer>
  `
})
export class PublicLayout {}
```

### 2. Agregar Ruta (Recomendado)

En tu archivo `app.routes.ts` o `public.routes.ts`:

```typescript
import { TermsAndConditions } from '@app/features/public/shared/terms-and-conditions';

export const publicRoutes: Routes = [
  // ... otras rutas
  {
    path: 'terminos-condiciones',
    component: TermsAndConditions,
    data: { title: 'Términos y Condiciones - POSOQO' }
  },
  // O como layout
  {
    path: 'legal',
    component: PublicLayout,
    children: [
      {
        path: 'terminos',
        component: TermsAndConditions
      }
    ]
  }
];
```

### 3. Agregar Enlace en Footer o Menú

```html
<a routerLink="/terminos-condiciones">Términos y Condiciones</a>
```

## Estructura del Componente

El componente utiliza una estructura de datos simple con secciones que incluyen:

- `activeTab`: Controla la pestaña activa
- `terminosData`: Datos de términos y condiciones
- `puntosData`: Datos de política de puntos
- `cookiesData`: Datos de cookies
- `privacidadData`: Datos de privacidad
- `politicasData`: Datos de seguridad adicional

## Personalización

### Cambiar Colores

Edita los colores en `terms-and-conditions.css`:

```css
/* Color principal (actualmente oro POSOQO) */
#d4a574  /* Cambiar este color */
```

### Actualizar Contenido

Todos los textos están en el archivo `.ts` en las variables de datos:

```typescript
terminosData = {
  title: 'Tu Título Aquí',
  sections: [
    {
      id: 'seccion-id',
      title: 'Título de Sección',
      content: 'Contenido aquí...'
    }
  ]
};
```

### Agregar Nuevas Secciones

1. Agrega un nuevo botón en `terms-and-conditions.html`:
```html
<button class="tab-btn" [class.active]="activeTab === 'nueva'"
        (click)="selectTab('nueva')">
  🆕 Nueva Sección
</button>
```

2. Agrega un nuevo `*ngIf` para el contenido:
```html
<div class="tab-content" *ngIf="activeTab === 'nueva'">
  <!-- contenido aquí -->
</div>
```

3. Agrega datos en el `.ts`:
```typescript
nuevaDatos = {
  title: 'Nueva Sección',
  sections: [...]
};
```

## Características Destacadas

### Tabla de Canjes de Puntos

Se muestra automáticamente en la pestaña de Puntos con los diferentes niveles de recompensa.

### Consejos de Seguridad

La pestaña de Seguridad incluye:
- Tips de autenticación segura
- Recomendaciones de contraseña
- Advertencias sobre dispositivos públicos
- Información de prevención de fraude

### Avisos Destacados

- **Cookies**: Aviso en fondo amarillo
- **Seguridad**: Lista de consejos en fondo verde

## Responsive Design

- **Desktop**: Layout completo con 5 pestañas
- **Tablet**: Pestañas adaptadas, contenido redimensionado
- **Móvil**: Pestañas apiladas, fuentes reducidas para óptima lectura

## Integraciones Recomendadas

1. **Con Footer**: Agregar enlace "Términos y Condiciones"
2. **Con Header**: Enlace en menú de información legal
3. **Con Routing**: Crear ruta dedicada `/legal/terminos`
4. **Con Auth**: Mostrar en proceso de registro

## Estado de Desarrollo

✅ Completado y funcional  
✅ Responsivo  
✅ Con contenido contextualizado para POSOQO  
✅ Listo para producción  

## Última Actualización

4 de junio de 2026

## Soporte

Para cambios o consultas sobre contenido, contactar con:
- **Email**: privacidad@posoqo.com
- **Teléfono**: +51 066 128 252
