import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'generate',
        loadComponent: () =>
            import('./components/data-generation/data-generation.component')
                .then(m => m.DataGenerationComponent)
    },
    {
        path: 'process',
        loadComponent: () =>
            import('./components/data-processing/data-processing.component')
                .then(m => m.DataProcessingComponent)
    },
    {
        path: 'upload',
        loadComponent: () =>
            import('./components/data-upload/data-upload.component')
                .then(m => m.DataUploadComponent)
    },
    {
        path: '',
        redirectTo: 'generate',
        pathMatch: 'full'
    }
];