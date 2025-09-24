// src/components/Album.tsx
import React, { useEffect, useState, useCallback, useRef } from "react";
import { useParams, Link } from "react-router-dom";

type ImgItem = { src: string; name: string };
type ImageModule = { default?: string };

/**
 * Tipado para los loaders que devuelve import.meta.glob en Vite:
 * cada loader es una función que resuelve a un módulo con { default?: string } (url)
 */
const modules = import.meta.glob("/src/albums/**/*.{jpg,jpeg,png,webp}") as Record<
    string,
    () => Promise<ImageModule>
>;

const Album: React.FC = () => {
    const { slug } = useParams<{ slug?: string }>();
    const [images, setImages] = useState<ImgItem[]>([]);
    const [loading, setLoading] = useState(true);

    // slider state
    const [openIndex, setOpenIndex] = useState<number | null>(null);
    const modalRef = useRef<HTMLDivElement | null>(null);
    const touchStartX = useRef<number | null>(null);

    useEffect(() => {
        if (!slug) return;
        setLoading(true);

        const matching = Object.entries(modules)
            .filter(([path]) => path.includes(`/albums/${slug}/`))
            .sort(([a], [b]) => a.localeCompare(b)); // orden por nombre de archivo

        Promise.all(
            matching.map(async ([path, loader]) => {
                // loader ya está tipado como () => Promise<{ default?: string }>
                const mod = await loader();
                // Vite usualmente devuelve { default: url }
                const url = (mod && (mod.default ?? (mod as unknown as string))) as string;
                const filename = path.split("/").pop() ?? path;
                return { src: url, name: filename };
            })
        )
            .then((imgs) => {
                setImages(imgs);
            })
            .catch((err) => {
                console.error("Error cargando imágenes del álbum", err);
                setImages([]);
            })
            .finally(() => setLoading(false));
    }, [slug]); // modules está fuera del componente, no es necesario ponerlo aquí

    // keyboard navigation while modal open
    const onKeyDown = useCallback(
        (e: KeyboardEvent) => {
            if (openIndex === null) return;
            if (e.key === "ArrowRight") {
                setOpenIndex((i) => (i === null ? null : Math.min(images.length - 1, i + 1)));
            } else if (e.key === "ArrowLeft") {
                setOpenIndex((i) => (i === null ? null : Math.max(0, i - 1)));
            } else if (e.key === "Escape") {
                setOpenIndex(null);
            }
        },
        [openIndex, images.length]
    );

    useEffect(() => {
        if (openIndex !== null) {
            window.addEventListener("keydown", onKeyDown);
            document.body.style.overflow = "hidden";
        } else {
            window.removeEventListener("keydown", onKeyDown);
            document.body.style.overflow = "";
        }
        return () => {
            window.removeEventListener("keydown", onKeyDown);
            document.body.style.overflow = "";
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

    return (
        <main className="min-h-screen bg-gray-900 text-white py-12">
            <div className="mx-auto max-w-6xl px-6">
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-3xl font-bold capitalize">{slug.replace(/-/g, " ")}</h1>
                    <Link to="/" className="text-sm text-gray-300 hover:underline">
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
                                        <div className="mt-3 text-center text-sm text-gray-300">{images[openIndex].name}</div>
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
