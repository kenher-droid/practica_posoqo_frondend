import { Routes } from '@angular/router';

export const USER_ROUTES: Routes = [
    {
        path: '',
        children: [
            {path: 'profile', loadComponent: () => import('./views/Profile/profile/profile').then(m => m.Profile)},
            {path: '', redirectTo: 'profile', pathMatch: 'full' }
        ]
    }
];