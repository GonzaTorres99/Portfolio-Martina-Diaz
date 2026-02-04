// src/components/Cuadricula.tsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { images, makeSlug } from "../data/albums";
import type { ImageItem } from "../data/albums";

/* ---------- Image with native lazy + fade-in ---------- */
const FadeImage: React.FC<{ src: string; alt: string; className?: string }> = ({ src, alt, className }) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      onLoad={() => setLoaded(true)}
      className={`${className ?? ""} transition-opacity duration-500 ease-in-out ${loaded ? "opacity-100" : "opacity-0"}`}
      style={{ willChange: "opacity, transform" }}
    />
  );
};

/* ---------- ImageCard ---------- */
const ImageCard: React.FC<{ item: ImageItem; url?: string }> = ({ item, url }) => {
  const [hovered, setHovered] = useState(false);
  const slug = makeSlug(item.alt);

  return (
    <Link
      to={url ? "#" : `/albums/${slug}`}
      onClick={(e) => {
        if (url) {
          e.preventDefault();
          window.open(url, "_blank", "noopener,noreferrer");
        }
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      aria-label={`Ir al álbum ${item.alt}`}
      className="relative w-full h-full overflow-hidden rounded-sm group block"
    >
      {/* imagen */}
      <div className="absolute inset-0">
        <FadeImage
          src={item.src}
          alt={item.alt}
          className={`w-full h-full object-cover object-center transform transition-transform duration-500 ${hovered ? "scale-105" : "scale-100"}`}
        />
      </div>

      {/* overlay */}
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

      {/* etiqueta */}
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

/* ---------- Layout principal ---------- */
const Cuadricula: React.FC = () => {
  const firstRow = images.slice(0, 5);
  const secondRow = images.slice(5, 9);
  const thirdRow = [images[9]]; // Usa la imagen de Videos

  return (
    <section className="w-full bg-transparent" id="cuadricula">
      <div className="mx-auto max-w-7xl px-6 py-16">
        {/* Título superior */}
        <div className="mb-6 flex items-center justify-center">
          <h2 className="text-white text-3xl sm:text-4xl font-bold tracking-tight">Deporte</h2>
        </div>

        {/* DESCRIPCIÓN / PUNTEO */}
        <div className="mx-auto max-w-4xl mb-10">
          <p className="text-gray-200 mb-4">
            Esta sección reúne mi trabajo especializado en fotografía deportiva aplicada al básquet. Incluye cuatro álbumes temáticos:
          </p>
        </div>

        {/* Primera fila */}
        <div className="mb-12">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {firstRow.map((img) => (
              <div key={img.alt} className="h-48 md:h-56 w-full relative min-h-0">
                <ImageCard item={img} />
              </div>
            ))}
          </div>
        </div>

        {/* Título intermedio */}
        <div className="mb-6 flex items-center justify-center">
          <h2 className="text-white text-3xl sm:text-4xl font-bold tracking-tight">Contenido para Redes</h2>
        </div>

        {/* DESCRIPCIÓN / PUNTEO NUEVO */}
        <div className="mx-auto max-w-4xl mb-10">
          <p className="text-gray-200 mb-4">
            Esta sección reúne mi trabajo en fotografía social, organizada en cuatro líneas de servicio especializadas:
          </p>
        </div>

        {/* Segunda fila */}
        <div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {secondRow.map((img) => (
              <div key={img.alt} className="h-48 md:h-56 w-full relative min-h-0">
                <ImageCard item={img} />
              </div>
            ))}
          </div>
        </div>

        {/* Título de Videos */}
        <div className="mb-6 mt-16 flex items-center justify-center">
          <h2 className="text-white text-3xl sm:text-4xl font-bold tracking-tight">Videos</h2>
        </div>

        {/* DESCRIPCIÓN VIDEOS */}
        <div className="mx-auto max-w-4xl mb-10">
          <p className="text-gray-200 mb-4">
            Explora mi trabajo en videografía y contenido audiovisual. Una colección curada de momentos capturados en movimiento.
          </p>
        </div>

        {/* Tercera fila - Solo un elemento */}
        <div className="flex justify-center">
          <div className="w-full sm:w-1/2 md:w-1/4">
            {thirdRow.map((img) => (
              <div key={img.alt} className="h-48 md:h-56 w-full relative min-h-0">
                <ImageCard item={img} url="https://drive.google.com/drive/folders/1V4BLv9ms8i3A4JB6ST6GJ1QNifVQZI2f?" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Cuadricula;
