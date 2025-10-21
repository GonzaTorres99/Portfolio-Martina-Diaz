// scripts/optimize-albums.js
// Ejecutar: node scripts/optimize-albums.js
// Diseñado para proyectos con "type": "module" en package.json

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';
import fg from 'fast-glob';

(async () => {
  try {
    // __dirname equivalente en ESM
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    const ROOT = path.join(__dirname, '..');
    const ALBUMS_DIR = path.join(ROOT, 'src', 'albums');

    // Configuración
    const SIZES = [400, 800, 1200];
    const FORMATS = ['avif', 'webp']; // si AVIF da problemas, cambia a ['webp']
    const PLACEHOLDER_WIDTH = 20;

    // Buscar imágenes originales (png/jpg/jpeg)
    const imagePaths = await fg(['**/*.{png,jpg,jpeg}'], { cwd: ALBUMS_DIR, absolute: true, suppressErrors: true });

    if (!imagePaths || imagePaths.length === 0) {
      console.log('No se encontraron imágenes en src/albums. Revisa la ruta y vuelve a ejecutar.');
      return;
    }

    for (const imgPath of imagePaths) {
      const relPath = path.relative(ALBUMS_DIR, imgPath);
      const dir = path.dirname(imgPath);
      const baseName = path.basename(imgPath).replace(/\.[^.]+$/, '');
      const outDir = path.join(dir, 'optimized');

      await fs.mkdir(outDir, { recursive: true });

      // Generar variantes por tamaño y formato
      for (const size of SIZES) {
        for (const fmt of FORMATS) {
          const outName = `${baseName}-${size}.${fmt}`;
          const outPath = path.join(outDir, outName);
          try {
            // si ya existe, skip
            await fs.stat(outPath).catch(async () => {
              await sharp(imgPath)
                .resize({ width: size, withoutEnlargement: true })
                .toFormat(fmt, { quality: 80 })
                .toFile(outPath);
            });
          } catch (err) {
            console.error(`Error generando ${outPath}:`, err.message || err);
          }
        }
      }

      // Generar placeholder tiny (webp base64) -> archivo .placeholder.txt
      const placeholderPath = path.join(outDir, `${baseName}.placeholder.txt`);
      try {
        await fs.stat(placeholderPath).catch(async () => {
          const buf = await sharp(imgPath)
            .resize({ width: PLACEHOLDER_WIDTH })
            .toFormat('webp', { quality: 50 })
            .toBuffer();
          const dataUri = `data:image/webp;base64,${buf.toString('base64')}`;
          await fs.writeFile(placeholderPath, dataUri, 'utf8');
        });
      } catch (err) {
        console.error(`Error generando placeholder ${placeholderPath}:`, err.message || err);
      }

      console.log('Optimizado:', relPath);
    }

    console.log('Proceso terminado. Revisa src/albums/*/optimized/');
  } catch (err) {
    console.error('Error general:', err);
  }
})();
