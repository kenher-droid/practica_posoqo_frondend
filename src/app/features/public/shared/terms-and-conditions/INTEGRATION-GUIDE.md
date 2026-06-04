# Guía de Integración - Términos y Condiciones

## Opción 1: Agregar Ruta (Recomendado)

### En `app.routes.ts`:

```typescript
import { Routes } from '@angular/router';
import { TermsAndConditions } from '@app/features/public/shared/terms-and-conditions';
import { PublicLayout } from '@app/features/public/layout/public-layout.component';

export const routes: Routes = [
  {
    path: 'public',
    component: PublicLayout,
    children: [
      // ... otras rutas ...
      {
        path: 'terminos-condiciones',
        component: TermsAndConditions,
        data: { title: 'Términos y Condiciones' }
      }
    ]
  }
];
```

## Opción 2: Agregar Enlace en Footer

### Actualizar `footer.html`:

```html
<footer class="footer-container">
  <!-- Contenido existente -->
  
  <div class="footer-col">
    <h2 class="col-title">Información Legal</h2>
    <ul class="col-list">
      <li><a routerLink="/public/terminos-condiciones">Términos y Condiciones</a></li>
      <li><a routerLink="/public/terminos-condiciones">Política de Privacidad</a></li>
      <li><a routerLink="/public/terminos-condiciones">Política de Cookies</a></li>
      <li><a routerLink="/public/terminos-condiciones">Seguridad</a></li>
    </ul>
  </div>
</footer>
```

### Actualizar `footer.ts`:

```typescript
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterModule],  // Agregar RouterModule
  templateUrl: './footer.html',
  styleUrl: './footer.css',
})
export class Footer {
  // ... contenido existente ...
}
```

## Opción 3: Agregar Enlace en Header/Menú

### En `header.html`:

```html
<nav class="legal-links">
  <a routerLink="/public/terminos-condiciones" class="legal-link">
    Términos y Condiciones
  </a>
  <span class="separator">•</span>
  <a routerLink="/public/terminos-condiciones#privacidad" class="legal-link">
    Privacidad
  </a>
  <span class="separator">•</span>
  <a routerLink="/public/terminos-condiciones#seguridad" class="legal-link">
    Seguridad
  </a>
</nav>
```

## Opción 4: Mostrar en un Modal

### En tu componente:

```typescript
import { TermsAndConditions } from '@app/features/public/shared/terms-and-conditions';
import { MatDialog } from '@angular/material/dialog';

export class MyComponent {
  constructor(private dialog: MatDialog) {}

  openTermsDialog(): void {
    this.dialog.open(TermsAndConditions, {
      width: '90%',
      maxWidth: '1000px',
      height: 'auto'
    });
  }
}
```

## Importación del Componente

Asegúrate de importar el componente en los lugares necesarios:

```typescript
// En tu módulo o componente padre
import { TermsAndConditions } from '@app/features/public/shared/terms-and-conditions';

@Component({
  imports: [
    TermsAndConditions,
    CommonModule,
    RouterModule
    // ... otros imports
  ]
})
```

## Navegación por Secciones (Bonus)

Si quieres enlazar directamente a una sección específica:

```html
<!-- Enlace al componente -->
<a routerLink="/public/terminos-condiciones">
  Ver Términos
</a>

<!-- Enlace a una sección específica (requiere scroll manual) -->
<a routerLink="/public/terminos-condiciones" 
   (click)="selectTab('puntos')">
  Ver Política de Puntos
</a>
```

## Estilos Recomendados para Enlaces

```css
.legal-link {
  color: #d4a574;
  text-decoration: none;
  font-size: 0.9em;
  transition: color 0.3s ease;
}

.legal-link:hover {
  color: #8b6f47;
  text-decoration: underline;
}

.separator {
  color: #ccc;
  margin: 0 10px;
}
```

## Accesibilidad

Asegúrate de incluir:

```html
<a routerLink="/public/terminos-condiciones" 
   title="Leer términos y condiciones completos"
   aria-label="Términos y Condiciones">
  Términos y Condiciones
</a>
```

## Mobile-First

En dispositivos móviles, considera:

```html
<nav class="legal-nav-mobile">
  <a routerLink="/public/terminos-condiciones">T&C</a>
  <a routerLink="/public/terminos-condiciones">Privacidad</a>
  <a routerLink="/public/terminos-condiciones">Seguridad</a>
</nav>
```

```css
@media (max-width: 768px) {
  .legal-nav-mobile {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  
  .legal-nav-mobile a {
    font-size: 0.85em;
    padding: 8px;
  }
}
```

## Verificación

Después de integrar, verifica:

- ✅ El componente se carga sin errores
- ✅ Las pestañas funcionan correctamente
- ✅ Los estilos se aplican correctamente
- ✅ Es responsivo en todos los dispositivos
- ✅ Los enlaces funcionan
- ✅ La tabla de puntos se muestra correctamente
