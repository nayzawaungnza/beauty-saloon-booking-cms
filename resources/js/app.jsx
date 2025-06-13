import React from 'react';
import { createInertiaApp } from '@inertiajs/react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import store from '@/store';
import GuestLayout from '@/Layouts/GuestLayout';
import AuthenticatedLayoutWrapper from '@/Layouts/AuthenticatedLayoutWrapper';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

// Import scss
import '@/assets/scss/theme.scss';
import '@/assets/css/layout-animations.css';

// Initialize Pusher and Echo
window.Pusher = Pusher;
window.Echo = new Echo({
    broadcaster: 'pusher',
    key: import.meta.env.VITE_PUSHER_APP_KEY,
    cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER,
    forceTLS: true,
    encrypted: true,
    authEndpoint: '/broadcasting/auth',
    auth: {
        headers: {
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
        },
    },
});

// Create a context for Echo to make it available throughout the app
export const EchoContext = React.createContext(null);

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
            'frontend/booking',
            'frontend/booking/confirmation'
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
                <EchoContext.Provider value={window.Echo}>
                    <App {...props} />
                </EchoContext.Provider>
            </Provider>
        );
    },
});