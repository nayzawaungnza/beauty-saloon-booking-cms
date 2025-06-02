import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [
        laravel({
            input: 'resources/js/app.jsx',
            refresh: true,
        }),
        react(),
    ],
    optimizeDeps: {
        include: ['@ckeditor/ckeditor5-react', 'ckeditor5-build-classic']
    },
    build: {
        rollupOptions: {
            external: [],
            output: {
                manualChunks: {
                    ckeditor: ['@ckeditor/ckeditor5-react', 'ckeditor5-build-classic']
                }
            }
        }
    }
});
