import { Routes } from '@angular/router';
import { AuthGuard } from './common/guards/auth-guard';

export const routes: Routes = [
    {path: 'add-server', loadComponent: () => import('./pages/add-server/add-server.component').then(mod => mod.AddServerComponent)},
    {
        path: 'user',
        children: [
            {path: 'favorite-servers', loadComponent: () => import('./pages/user/favorite-servers/favorite-servers.component').then(mod => mod.FavoriteServersComponent)},
            {path: 'my-servers', loadComponent: () => import('./pages/user/my-servers/my-servers.component').then(mod => mod.MyServersComponent)},
            {path: 'payments', loadComponent: () => import('./pages/user/payments/payments.component').then(mod => mod.PaymentsComponent)},
            {path: 'edit-server/:id', loadComponent: () => import('./pages/user/my-servers/edit-server/edit-server.component').then(mod => mod.EditServerComponent)},
        ],
        canActivate: [AuthGuard]
    },
    {path: 'server-info/:id', loadComponent: () => import('./pages/server-info/server-info.component').then(mod => mod.ServerInfoComponent)},
    {path: 'about-us', loadComponent: () => import('./pages/about-us/about-us.component').then(mod => mod.AboutUsComponent)},
    {
        path: 'admin-panel', 
        loadComponent: () => import('./pages/admin-panel/admin-panel.component').then(mod => mod.AdminPanelComponent),
        children: [
            {path: 'payments', loadComponent: () => import('./pages/admin-panel/payments/payments.component').then(mod => mod.PaymentsComponent)},
            {path: 'servers', loadComponent: () => import('./pages/admin-panel/servers/servers.component').then(mod => mod.ServersComponent)},
            {path: 'statistics', loadComponent: () => import('./pages/admin-panel/statistics/statistics.component').then(mod => mod.StatisticsComponent)},
            {path: 'users', loadComponent: () => import('./pages/admin-panel/users/users.component').then(mod => mod.UsersComponent)},
            { path: '', redirectTo: 'payments', pathMatch: 'full' }, // Дефолтный роут
        ],
    },

    // {path: 'faq', loadComponent: () => import('./faq/faq.component').then(mod => mod.FaqComponent)},

    {path: '**', loadComponent: () => import('./pages/main/main.component').then(mod => mod.MainComponent)},
];