import { Routes } from '@angular/router';

export const ADMIN_ROUTES: Routes = [
    {path: 'inicio', loadComponent: () => import('./views/Inicio/inicio/inicio').then(m => m.Inicio)},
    {path: 'eventos', loadComponent: () => import('./views/Eventos/eventos/eventos').then(m => m.Eventos)},
    {path: 'menu', loadComponent: () => import('./views/Menu/menu/menu').then(m => m.Menu)},
    {path: 'usuarios', loadComponent: () => import('./views/Usuarios/usuarios/usuarios').then(m => m.Usuarios)},
    {path: 'promociones', loadComponent: () => import('./views/Promociones/promociones/promociones').then(m => m.Promociones)},
    {path: 'puntos', loadComponent: () => import('./views/Puntos/puntos/puntos').then(m => m.Puntos)},
    {path: '', redirectTo: 'inicio', pathMatch: 'full' }
];