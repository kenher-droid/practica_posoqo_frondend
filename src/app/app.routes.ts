import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/public/layout/public-layout').then(m => m.PublicLayout)
  },
  {
    path: 'admin',
    loadComponent: () => import('./features/admin/layout/admin-layout/admin-layout').then(m => m.AdminLayout),
    loadChildren: () => import('./features/admin/admin.routes').then(m => m.ADMIN_ROUTES)
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
