import '../css/app.css';

import { ScreenProvider } from '@/Providers/ScreenProvider';
import { Toaster } from '@/components/ui/sonner';
import { createInertiaApp } from '@inertiajs/react';
import { configureEcho } from '@laravel/echo-react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { initializeTheme } from './hooks/use-appearance';

configureEcho({
    broadcaster: 'pusher',
});

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    resolve: (name) => resolvePageComponent(`./pages/${name}.tsx`, import.meta.glob('./pages/**/*.tsx')),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
            <ScreenProvider baseWidth={window.innerWidth} baseHeight={window.innerHeight}>
                <App {...props} />
                <Toaster position="top-center" />
            </ScreenProvider>,
        );
    },
    progress: {
        color: '#7c3aed',
    },
});

// This will set light / dark mode on load...
initializeTheme();
