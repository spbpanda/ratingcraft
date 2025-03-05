import { Routes } from '@angular/router';

export const routes: Routes = [
    // {path: 'add-domain', loadComponent: () => import('./add-domain/add-domain.component').then(mod => mod.AddDomainComponent)},
    // {
    //     path: 'user', loadComponent: () => import('./user/user.component').then(mod => mod.UserComponent), canActivate: [AuthGuard],
    //     children: [
    //         {path: 'favorite-servers', loadComponent: () => import('./user/favorite-servers/favorite-servers.component').then(mod => mod.FavoriteServersComponent)},
    //         {path: 'my-servers', loadComponent: () => import('./user/my-servers/my-servers.component').then(mod => mod.MyServersComponent)},
    //         {path: 'personal-data', loadComponent: () => import('./user/personal-data/personal-data.component').then(mod => mod.PersonalDataComponent)},
    //         {path: 'payments', loadComponent: () => import('./user/payments/payments.component').then(mod => mod.PaymentsComponent)},
    //     ]

    // },
    // {path: 'auth/callback', loadComponent: () => import('./auth-callback/auth-callback.component').then(mod => mod.AuthCallbackComponent)},
    // {path: 'server-info/:id', loadComponent: () => import('./server-info/server-info.component').then(mod => mod.ServerInfoComponent)},
    {path: 'about-us', loadComponent: () => import('./pages/about-us/about-us.component').then(mod => mod.AboutUsComponent)},
    // {path: 'faq', loadComponent: () => import('./faq/faq.component').then(mod => mod.FaqComponent)},

    {path: '**', loadComponent: () => import('./pages/main/main.component').then(mod => mod.MainComponent)},
];