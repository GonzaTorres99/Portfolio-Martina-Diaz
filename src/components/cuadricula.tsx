// src/components/cuadricula.tsx
import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { images, makeSlug } from "../data/albums";
import type { ImageItem } from "../data/albums";

/* ---------- LazyImage: carga cuando entra al viewport ---------- */
const LazyImage: React.FC<{
  src: string;
  alt: string;
  className?: string;
}> = ({ src, alt, className }) => {
  const imgRef = useRef<HTMLImageElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const img = imgRef.current;
    if (!img) return;

    if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setVisible(true);
              io.disconnect();
            }
          });
        },
        { rootMargin: "200px" } // precarga un poco antes de entrar
      );
      io.observe(img);
      return () => io.disconnect();
    } else {
      // fallback: cargar siempre
      setVisible(true);
    }
  }, []);

  const placeholder =
    "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='16' height='9'/>";

  return (
    <img
      ref={imgRef}
      src={visible ? src : placeholder}
      data-src={src}
      alt={alt}
      className={className}
      loading="lazy"
      decoding="async"
      style={{ willChange: "transform, opacity" }}
    />
  );
};

/* ---------- ImageCard optimizado (no animar flex/width) ---------- */
const ImageCard: React.FC<{ item: ImageItem }> = ({ item }) => {
  const [hovered, setHovered] = useState(false);
  const slug = makeSlug(item.alt);

  return (
    <Link
      to={`/albums/${slug}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      aria-label={`Ir al álbum ${item.alt}`}
      className="relative w-full h-full overflow-hidden rounded-sm group"
    >
      <div className="absolute inset-0">
        <LazyImage
          src={item.src}
          alt={item.alt}
          className={`w-full h-full object-cover object-center transform transition-transform duration-450 ${
            hovered ? "scale-110" : "scale-100"
          }`}
        />
      </div>

      <div
        className={`absolute inset-0 flex flex-col items-center justify-center text-center px-4 transition-opacity duration-300 ${
          hovered ? "opacity-100" : "opacity-0"
        }`}
        aria-hidden={!hovered}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <h3 className="relative z-10 text-white text-lg sm:text-xl md:text-2xl font-semibold tracking-wide">
          {item.alt}
        </h3>
        <button
          type="button"
          className="relative z-10 mt-3 inline-block px-4 py-2 text-sm md:text-base font-medium rounded-md bg-indigo-600 hover:bg-indigo-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-300"
        >
          Ir al álbum
        </button>
      </div>

      <div
        className={`absolute left-3 bottom-3 z-20 px-2 py-1 rounded-md bg-black/40 text-white text-xs font-medium transition-opacity duration-300 ${
          hovered ? "opacity-0" : "opacity-100"
        }`}
      >
        {item.alt}
      </div>
    </Link>
  );
};

/* ---------- Layout principal: grid para filas (4 columnas) ---------- */
const Cuadricula: React.FC = () => {
  const firstRow = images.slice(0, 4);
  const secondRow = images.slice(4, 8);

  return (
    <section className="h-screen w-full overflow-hidden" id="cuadricula">
      <div className="h-full flex flex-col">
        <div className="h-[10%] px-6 flex items-center justify-center">
          <h2 className="text-white text-3xl sm:text-4xl font-bold tracking-tight">Deporte</h2>
        </div>

        <div className="h-[40%] px-6">
          <div className="h-full grid grid-cols-2 md:grid-cols-4 gap-3 min-h-0">
            {firstRow.map((img) => (
              <ImageCard key={img.alt} item={img} />
            ))}
          </div>
        </div>

        <div className="h-[10%] px-6 flex items-center justify-center">
          <h2 className="text-white text-3xl sm:text-4xl font-bold tracking-tight">Contenido para Redes</h2>
        </div>

        <div className="h-[40%] px-6 pb-6">
          <div className="h-full grid grid-cols-2 md:grid-cols-4 gap-3 min-h-0">
            {secondRow.map((img) => (
              <ImageCard key={img.alt} item={img} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Cuadricula;
