import { Routes } from '@angular/router';

export const AUTH_ROUTES: Routes = [
    {
        path: '',
        children: [
            {path: 'login', loadComponent: () => import('./views/Login/login/login').then(m => m.Login)},
            {path: 'register', loadComponent: () => import('./views/Register/register/register').then(m => m.Register)},
            {path: '', redirectTo: 'login', pathMatch: 'full' }
        ]
    }
];