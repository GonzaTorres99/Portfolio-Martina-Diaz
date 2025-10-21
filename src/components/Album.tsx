// src/components/Album.tsx
import React, { useEffect, useState, useCallback, useRef, useLayoutEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

type ImgItem = { key: string; src: string; name: string };
type Variant = { src: string; w: number };

// glob imports (eager) — Vite resolverá a URLs/string en build time
const optimizedModules = import.meta.glob('/src/albums/**/optimized/*.{webp,avif,txt}', { eager: true }) as Record<string, { default: string }>;
const originalModules = import.meta.glob('/src/albums/**/*.{jpg,jpeg,png,webp,avif}', { eager: true }) as Record<string, { default: string }>;
// metadata loaders (eager) — puede resolver json (obj) o txt/md (string)
const metaModules = import.meta.glob('/src/albums/**/meta.{json,txt,md}', { eager: true }) as Record<
  string,
  { default: string | Record<string, unknown> }
>;

const Album: React.FC = () => {
  const { slug } = useParams<{ slug?: string }>();
  const [images, setImages] = useState<ImgItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [albumDescription, setAlbumDescription] = useState<string | null>(null);

  // slider state
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const modalRef = useRef<HTMLDivElement | null>(null);
  const touchStartX = useRef<number | null>(null);

  // helper: human title
  const humanTitle = slug ? slug.replace(/-/g, ' ') : '';

  useLayoutEffect(() => {
    if (!slug) return;
    window.scrollTo({ top: 0, left: 0 });
    try {
      const h = history as unknown as { scrollRestoration?: 'auto' | 'manual' };
      if (typeof h.scrollRestoration !== 'undefined') {
        h.scrollRestoration = 'manual';
      }
    } catch (err) {
      console.warn('No se pudo ajustar scrollRestoration:', err);
    }
  }, [slug]);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);

    try {
      // Build list of originals for the album
      const matching = Object.entries(originalModules)
        .filter(([path]) => path.includes(`/albums/${slug}/`))
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([path, mod]) => ({ key: path, src: mod.default, name: path.split('/').pop() ?? path }));

      setImages(matching);
    } catch (err) {
      console.error('Error cargando imágenes del álbum', err);
      setImages([]);
    } finally {
      setLoading(false);
    }

    // cargar metadata (meta.json / meta.txt / meta.md) si existe
    try {
      const metaEntry = Object.entries(metaModules).find(([p]) => p.includes(`/albums/${slug}/`));
      if (!metaEntry) {
        setAlbumDescription(null);
      } else {
        const [, mod] = metaEntry;
        const value = mod && typeof mod.default !== 'undefined' ? mod.default : null;

        if (typeof value === 'string') {
          // txt/md: tomar la primera línea no vacía como descripción corta
          const firstLine = value
            .split(/\r?\n/)
            .map((s: string) => s.trim())
            .find(Boolean) ?? null;
          setAlbumDescription(firstLine);
        } else if (value && typeof value === 'object') {
          // json: buscar campos comunes
          const obj = value as Record<string, unknown>;
          const descCandidate = obj.description ?? obj.desc ?? obj.summary ?? obj.title ?? null;
          setAlbumDescription(typeof descCandidate === 'string' ? descCandidate : null);
        } else {
          setAlbumDescription(null);
        }
      }
    } catch (err) {
      console.warn('No se pudo cargar metadata del álbum', err);
      setAlbumDescription(null);
    }
  }, [slug]);

  // keyboard navigation while modal open
  const onKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (openIndex === null) return;
      if (e.key === 'ArrowRight') {
        setOpenIndex((i) => (i === null ? null : Math.min(images.length - 1, i + 1)));
      } else if (e.key === 'ArrowLeft') {
        setOpenIndex((i) => (i === null ? null : Math.max(0, i - 1)));
      } else if (e.key === 'Escape') {
        setOpenIndex(null);
      }
    },
    [openIndex, images.length]
  );

  useEffect(() => {
    if (openIndex !== null) {
      window.addEventListener('keydown', onKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      window.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    }
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [openIndex, onKeyDown]);

  // touch handlers for swipe
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches?.[0]?.clientX ?? null;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const endX = e.changedTouches?.[0]?.clientX ?? null;
    if (endX === null) return;
    const diff = endX - (touchStartX.current ?? 0);
    if (Math.abs(diff) < 40) return;
    if (diff < 0) {
      // swipe left => next
      setOpenIndex((i) => (i === null ? null : Math.min(images.length - 1, i + 1)));
    } else {
      // swipe right => prev
      setOpenIndex((i) => (i === null ? null : Math.max(0, i - 1)));
    }
    touchStartX.current = null;
  };

  // --- helpers to resolve optimized variants for an original image key ---
  function variantsFor(originalKey: string) {
    // originalKey e.g. '/src/albums/mi-album/imagen.png'
    const dirname = originalKey.substring(0, originalKey.lastIndexOf('/'));
    const filename = originalKey.substring(originalKey.lastIndexOf('/') + 1).replace(/\.[^.]+$/, '');
    const optimizedDir = `${dirname}/optimized/`;

    const found = Object.entries(optimizedModules).filter(([k]) => k.startsWith(optimizedDir));

    const avif: Variant[] = [];
    const webp: Variant[] = [];
    let placeholder: string | null = null;

    for (const [k, mod] of found) {
      const basename = k.split('/').pop() ?? k;
      // placeholder file: <name>.placeholder.txt
      if (basename === `${filename}.placeholder.txt`) {
        // module.default should be the dataURI string
        placeholder = String(mod.default);
        continue;
      }

      // variant files: <name>-<size>.<ext>
      const match = basename.match(new RegExp(`^${escapeRegExp(filename)}-(\\d+)\\.(webp|avif)$`));
      if (match) {
        const w = Number(match[1]);
        const ext = match[2];
        const src = mod.default;
        if (ext === 'avif') avif.push({ src, w });
        else if (ext === 'webp') webp.push({ src, w });
      }
    }

    // sort by width asc
    avif.sort((a, b) => a.w - b.w);
    webp.sort((a, b) => a.w - b.w);

    // fallback: original image url (from originalModules)
    const fallback = (originalModules[originalKey] && (originalModules[originalKey].default)) || '';

    return { avif, webp, fallback, placeholder };
  }

  // safe escape for regex
  function escapeRegExp(s: string) {
    return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  if (!slug) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <p>Álbum inválido</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-900 text-white py-12">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold capitalize">{humanTitle}</h1>
            {/* album description under title */}
            {albumDescription ? (
              <p className="mt-1 text-sm text-gray-300 max-w-2xl">{albumDescription}</p>
            ) : (
              <p className="mt-1 text-sm text-gray-400">{images.length > 0 ? `${images.length} foto${images.length > 1 ? 's' : ''}` : 'Sin fotos'}</p>
            )}
          </div>

          <Link to="/" className="text-sm text-gray-300 hover:underline self-start sm:self-auto">
            Volver
          </Link>
        </div>

        {loading ? (
          <div className="py-20 text-center text-gray-300">Cargando álbum...</div>
        ) : images.length === 0 ? (
          <div className="py-20 text-center text-gray-300">No se encontraron fotos en este álbum.</div>
        ) : (
          <>
            {/* grid de miniaturas */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {images.map((img, i) => {
                const v = variantsFor(img.key);
                const srcSetAvif = v.avif.map((x) => `${x.src} ${x.w}w`).join(', ');
                const srcSetWebp = v.webp.map((x) => `${x.src} ${x.w}w`).join(', ');
                const thumbSrc = v.webp[0]?.src ?? v.fallback;

                return (
                  <button
                    key={img.name}
                    onClick={() => setOpenIndex(i)}
                    className="group block w-full rounded overflow-hidden focus:outline-none"
                    aria-label={`Abrir imagen ${i + 1}`}
                  >
                    <div
                      className="w-full h-48 bg-center bg-cover relative"
                      style={{
                        backgroundImage: v.placeholder ? `url(${v.placeholder})` : undefined,
                      }}
                    >
                      <picture>
                        {srcSetAvif && <source type="image/avif" srcSet={srcSetAvif} sizes="(max-width: 640px) 33vw, (max-width: 1024px) 25vw, 200px" />}
                        {srcSetWebp && <source type="image/webp" srcSet={srcSetWebp} sizes="(max-width: 640px) 33vw, (max-width: 1024px) 25vw, 200px" />}
                        <img
                          src={thumbSrc}
                          alt={img.name}
                          loading="lazy"
                          decoding="async"
                          className="w-full h-48 object-cover transition-transform transform group-hover:scale-105"
                          style={{
                            backgroundColor: 'rgba(0,0,0,0.25)',
                          }}
                        />
                      </picture>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* modal / slider */}
            {openIndex !== null && (
              <div ref={modalRef} className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4" onClick={() => setOpenIndex(null)}>
                <div
                  className="relative max-w-[1200px] w-full h-full md:h-[80vh] flex items-center"
                  onClick={(e) => e.stopPropagation()}
                  onTouchStart={onTouchStart}
                  onTouchEnd={onTouchEnd}
                >
                  {/* Prev */}
                  <button
                    onClick={() => setOpenIndex((i) => (i === null ? null : Math.max(0, i - 1)))}
                    className="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 text-white bg-black/40 hover:bg-black/30 rounded-full p-2"
                    aria-label="Anterior"
                  >
                    ‹
                  </button>

                  {/* Image */}
                  <div className="mx-auto max-h-full overflow-hidden rounded">
                    {(() => {
                      const current = images[openIndex];
                      const v = variantsFor(current.key);
                      const largeSrc = v.avif[v.avif.length - 1]?.src ?? v.webp[v.webp.length - 1]?.src ?? v.fallback;
                      return (
                        <>
                          <img src={largeSrc} alt={current.name} className="max-h-[70vh] w-auto object-contain" />
                          <div className="mt-2 text-sm text-center text-gray-300">{current.name.replace(/\.[^.]+$/, '')}</div>
                        </>
                      );
                    })()}
                  </div>

                  {/* Next */}
                  <button
                    onClick={() => setOpenIndex((i) => (i === null ? null : Math.min(images.length - 1, i + 1)))}
                    className="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 text-white bg-black/40 hover:bg-black/30 rounded-full p-2"
                    aria-label="Siguiente"
                  >
                    ›
                  </button>

                  {/* Close */}
                  <button onClick={() => setOpenIndex(null)} className="absolute right-4 top-4 text-white bg-black/40 hover:bg-black/30 rounded-full p-2" aria-label="Cerrar">
                    ✕
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
};

export default Album;
