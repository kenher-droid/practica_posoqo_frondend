import { Routes } from '@angular/router';
import { ADMIN_ROUTES } from './features/admin/admin.routes';
import { AUTH_ROUTES } from './features/auth/auth.routes';
import { USER_ROUTES } from './features/user/user.routes';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/public/layout/public-layout').then(m => m.PublicLayout)
  },
  {
    path: 'terminos-condiciones',
    loadComponent: () => import('./features/public/shared/terms-and-conditions').then(m => m.TermsAndConditions),
    data: { title: 'Términos y Condiciones' }
  },
  {
    path: 'eventos',
    loadComponent: () => import('./features/public/shared/events/eventos').then(m => m.Eventos),
    data: { title: 'Eventos' }
  },
  {
    path: 'admin',
    loadComponent: () => import('./features/admin/layout/admin-layout/admin-layout').then(m => m.AdminLayout),
    children: ADMIN_ROUTES
  },
  {
    path: 'auth',
    loadComponent: () => import('./features/auth/layout/auth-layout/auth-layout').then(m => m.AuthLayout),
    loadChildren: () => import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES)
  },
  {
    path: 'user',
    loadComponent: () => import('./features/user/layout/user-layout/user-layout').then(m => m.UserLayout),
    loadChildren: () => import('./features/user/user.routes').then(m => m.USER_ROUTES)
  }
];
