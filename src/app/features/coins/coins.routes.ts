import { Routes } from '@angular/router';

export const coinsRoutes: Routes = [
    {
        path: '',
        loadComponent: () => import('./components/dashboard/dashboard.component').then((c) => c.DashboardComponent),
    }
];
