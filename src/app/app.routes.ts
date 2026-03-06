import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'generate',
        loadComponent: () =>
            import('./components/data-generation/data-generation.component')
                .then(m => m.DataGenerationComponent)
    }
];