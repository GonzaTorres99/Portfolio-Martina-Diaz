import React, { useEffect, useState, useCallback, useRef, useLayoutEffect } from "react";
import { useParams, Link } from "react-router-dom";

type ImgItem = { src: string; name: string };
type ImageModule = { default?: string };
// metadata can be either a string (txt/md) or an object (json)
type MetaModule = { default?: string | Record<string, unknown> };

// loaders for images
const modules = import.meta.glob('/src/albums/**/*.{jpg,jpeg,png,webp}') as Record<string, () => Promise<ImageModule>>;
// loaders for album metadata: meta.json, meta.txt or meta.md
const metaLoaders = import.meta.glob('/src/albums/**/meta.{json,txt,md}') as Record<string, () => Promise<MetaModule>>;

const Album: React.FC = () => {
    const { slug } = useParams<{ slug?: string }>();
    const [images, setImages] = useState<ImgItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [albumDescription, setAlbumDescription] = useState<string | null>(null);

    // slider state
    const [openIndex, setOpenIndex] = useState<number | null>(null);
    const modalRef = useRef<HTMLDivElement | null>(null);
    const touchStartX = useRef<number | null>(null);

    // ensure we start at top of the album when navigating here
    useLayoutEffect(() => {
        if (!slug) return;
        window.scrollTo({ top: 0, left: 0 });

        // history.scrollRestoration exists on browsers; cast to a narrower type to avoid `any`
        try {
            const h = history as unknown as { scrollRestoration?: 'auto' | 'manual' };
            if (typeof h.scrollRestoration !== 'undefined') {
                h.scrollRestoration = 'manual';
            }
        } catch (err) {
            // log but don't throw — some environments may restrict access to history props
            
            console.warn('No se pudo ajustar scrollRestoration:', err);
        }
    }, [slug]);

    useEffect(() => {
        if (!slug) return;
        setLoading(true);

        const matching = Object.entries(modules)
            .filter(([path]) => path.includes(`/albums/${slug}/`))
            .sort(([a], [b]) => a.localeCompare(b)); // orden por nombre de archivo

        Promise.all(
            matching.map(async ([path, loader]) => {
                const mod = await loader();
                const url = (mod && (mod.default ?? (mod as unknown as string))) as string;
                const filename = path.split('/').pop() ?? path;
                return { src: url, name: filename };
            })
        )
            .then((imgs) => setImages(imgs))
            .catch((err) => {
                
                console.error('Error cargando imágenes del álbum', err);
                setImages([]);
            })
            .finally(() => setLoading(false));

        // try to load album metadata (meta.json / meta.txt / meta.md)
        (async () => {
            try {
                const metaMatch = Object.entries(metaLoaders).find(([p]) => p.includes(`/albums/${slug}/`));
                if (!metaMatch) {
                    setAlbumDescription(null);
                    return;
                }
                const [, loader] = metaMatch;

                // loader should resolve to MetaModule (string for txt/md or object for json)
                const mod = (await loader()) as MetaModule | null;
                if (!mod) {
                    setAlbumDescription(null);
                    return;
                }

                // Use a narrow type guard instead of `any`.
                const value: string | Record<string, unknown> | null = typeof mod.default !== 'undefined' ? mod.default! : null;

                if (typeof value === 'string') {
                    // plain text or markdown: use the first non-empty line as short description
                    const firstLine = value.split(/\r?\n/).map((s) => s.trim()).find(Boolean) ?? null;
                    setAlbumDescription(firstLine);
                } else if (value && typeof value === 'object') {
                    // json: try common fields
                    const obj = value as Record<string, unknown>;
                    const descCandidate = obj.description ?? obj.desc ?? obj.summary ?? null;
                    setAlbumDescription(typeof descCandidate === 'string' ? descCandidate : null);
                } else {
                    setAlbumDescription(null);
                }
            } catch (err) {
                
                console.warn('No se pudo cargar metadata del álbum', err);
                setAlbumDescription(null);
            }
        })();
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

    if (!slug) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
                <p>Álbum inválido</p>
            </div>
        );
    }

    const humanTitle = slug.replace(/-/g, ' ');

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
                            {images.map((img, i) => (
                                <button
                                    key={img.name}
                                    onClick={() => setOpenIndex(i)}
                                    className="group block w-full rounded overflow-hidden focus:outline-none"
                                    aria-label={`Abrir imagen ${i + 1}`}
                                >
                                    <img
                                        src={img.src}
                                        alt={img.name}
                                        className="w-full h-48 object-cover transform group-hover:scale-105 transition"
                                        loading="lazy"
                                        decoding="async"
                                    />
                                    {/* small caption under thumbnail - show filename without extension */}
                                    <div className="mt-2 text-xs text-gray-300 text-left px-1 truncate">{img.name.replace(/\.[^.]+$/, '')}</div>
                                </button>
                            ))}
                        </div>

                        {/* modal / slider */}
                        {openIndex !== null && (
                            <div
                                ref={modalRef}
                                className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
                                onClick={() => setOpenIndex(null)}
                            >
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
                                        <img
                                            src={images[openIndex].src}
                                            alt={images[openIndex].name}
                                            className="max-h-[70vh] w-auto object-contain"
                                        />
                                        <div className="mt-2 text-sm text-center text-gray-300">{images[openIndex].name.replace(/\.[^.]+$/, '')}</div>
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
                                    <button
                                        onClick={() => setOpenIndex(null)}
                                        className="absolute right-4 top-4 text-white bg-black/40 hover:bg-black/30 rounded-full p-2"
                                        aria-label="Cerrar"
                                    >
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
