import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'en', // Default redirect with language
        pathMatch: 'full',
    },
    {
        path: ':lang', // Home page with lang at the end
        loadComponent: () =>
            import('./components/home-page/home-page/home-page.component').then(
                (c) => c.HomePageComponent
            ),
    },
    {
        path: 'services/:routeName/:id/:lang', // Service route with dynamic name, id, and lang at the end
        loadComponent: () =>
            import('./components/services/services/services.component').then(
                (r) => r.ServicesComponent
            ),
    },
    {
        path: 'contact/:lang', // Contact page with lang at the end
        loadComponent: () =>
            import('./components/contact/contact.component').then(
                (c) => c.ContactComponent
            ),
    },
    {
        path: 'about/:lang', // About page with lang at the end
        loadComponent: () =>
            import('./components/about/about/about.component').then(
                (c) => c.AboutComponent
            ),
    },
    {
        path: 'about-inner/:lang', // About-inner page with lang at the end
        loadComponent: () =>
            import('./components/about/about-inner/about-inner.component').then(
                (c) => c.AboutInnerComponent
            ),
    },
    {
        path: 'success-cases/:lang', // Success cases overview with lang at the end
        loadComponent: () =>
            import(
                './components/success-cases/succes-cases/succes-cases.component'
            ).then((c) => c.SuccesCasesComponent),
    },
    {
        path: 'success-case/:id/:lang', // Specific success case with lang at the end
        loadComponent: () =>
            import(
                './components/success-cases/success-case/success-case.component'
            ).then((c) => c.SuccessCaseComponent),
    },
    {
        path: '**',
        redirectTo: 'en', // Default wildcard route to the home page with language
        pathMatch: 'full',
    },
];
