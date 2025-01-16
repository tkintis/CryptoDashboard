import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'dashboard',
        loadChildren: () => import('./features/coins/coins.routes').then((r) => r.coinsRoutes),
    },
    {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
    },
];
