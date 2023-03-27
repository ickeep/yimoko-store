import * as path from 'path';

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
  publicDir: false,
  build: {
    sourcemap: !process.env.VITE_WATCH,
    target: process.env.VITE_WATCH ? 'modules' : 'es2015',
    lib: {
      formats: ['cjs', 'es', 'umd'],
      entry: path.resolve(__dirname, `src/library.ts`),
      name: `YimokoStore`,
      fileName: format => `yimoko-store.${format}.js`,
    },
    watch: process.env.VITE_WATCH ? { buildDelay: 100 } : null,
    outDir: path.resolve(__dirname, `dist`),
    rollupOptions: {
      external: [
        'react',
        'react-is',
        'react-dom',
        'lodash-es',
        'axios',
        '@formily/core',
        '@formily/reactive',
        '@formily/react',
        '@formily/reactive-react',
      ],
      output: {
        globals: {
          react: 'React',
          'react-is': 'ReactIs',
          'react-dom': 'ReactDOM',
          axios: 'axios',
          'lodash-es': '_',
          '@formily/core': 'Formily.Core',
          '@formily/reactive-react': 'Formily.ReactiveReact',
          '@formily/react': 'Formily.React',
          '@formily/reactive': 'Formily.Reactive',
        },
      },
    },
  },
  plugins: [
    react({ fastRefresh: process.env.NODE_ENV !== 'test', jsxRuntime: 'classic' }),
    dts({
      entryRoot: path.resolve(__dirname, `src`),
      outputDir: path.resolve(__dirname, `types`),
    }),
  ],
});

