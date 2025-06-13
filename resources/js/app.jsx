import React from 'react';
import { createInertiaApp } from '@inertiajs/react';
import { createRoot } from 'react-dom/client';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { Provider } from 'react-redux';
import store from '@/store';
import GuestLayout from '@/Layouts/GuestLayout';
import AuthenticatedLayoutWrapper from '@/Layouts/AuthenticatedLayoutWrapper';

// Import scss
import '@/assets/scss/theme.scss';
import '@/assets/css/layout-animations.css'
// Activating fake backend
// import fakeBackend from './helpers/AuthType/fakeBackend';
// fakeBackend();

createInertiaApp({
    title: (title) => `${title} - ${import.meta.env.VITE_APP_NAME || 'App'}`,
    resolve: (name) => {
        const pages = import.meta.glob('./Pages/**/*.jsx', { eager: true });
        let page = pages[`./Pages/${name}.jsx`];

        if (!page) {
            throw new Error(`Page component not found: ${name}. Looked for ./Pages/${name}.jsx`);
        }

        const normalizedName = name.replace(/\//g, '/').toLowerCase();
        const publicPages = [
            'welcome',
            'frontend/home',
            'auth/login',
            'auth/register',
            'auth/forgotpassword',
            'auth/resetpassword',
            'backend/auth/login',
            'backend/auth/register',
            'frontend/booking'
        ];

        page.default.layout = page.default.layout || (
            publicPages.includes(normalizedName)
                ? (pageContent) => <GuestLayout>{pageContent}</GuestLayout>
                : (pageContent) => <AuthenticatedLayoutWrapper>{pageContent}</AuthenticatedLayoutWrapper>
        );

        return page;
    },
    setup({ el, App, props }) {
        const root = createRoot(el);
        root.render(
            <Provider store={store}>
                <App {...props} />
            </Provider>
        );
    },
});