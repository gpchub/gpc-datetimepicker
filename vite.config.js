import { defineConfig } from 'vite';

export default defineConfig(({ command }) => ({
    root: command === 'serve' ? '.' : undefined, // dev uses root, build uses default
    build: {
        lib: {
            entry: 'src/index.js',
            name: 'GDatetimepicker',
            fileName: (format) => `gpc-datetimepicker.${format}.js`,
        },
        outDir: 'dist',
        emptyOutDir: true,
        rollupOptions: {
            external: [],
            output: {
                globals: {},
            },
        },
        minify: 'esbuild',
    },
}));