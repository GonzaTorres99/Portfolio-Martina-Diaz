// eslint.config.mjs
import eslintPlugin from 'vite-plugin-eslint';

export default {
  plugins: [
    eslintPlugin({
      cache: true,
      fix: true,
      include: ['src/**/*.ts', 'src/**/*.tsx']
    })
  ]
};