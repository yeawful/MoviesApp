import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [react()],
    optimizeDeps: {
        include: [
            'antd/es/locale/en_US',
            // Добавьте только используемые компоненты:
            'antd/es/button/style',
            'antd/es/card/style',
            'antd/es/menu/style',
            'antd/es/pagination/style',
            'antd/es/rate/style',
            'antd/es/spin/style',
            'antd/es/alert/style',
            'antd/es/tag/style',
            'antd/es/input/style'
        ],
    },
    build: {
        rollupOptions: {
            output: {
                manualChunks: {
                    antd: ['antd'],
                    lodash: ['lodash']
                }
            }
        }
    }
});
