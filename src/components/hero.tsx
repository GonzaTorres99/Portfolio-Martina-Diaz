// src/components/Hero.tsx
import React from "react";
import foto from '../assets/images/marti1.png';
import cv from '../assets/cv/CV Martina Díaz.pdf';
import logo from "../assets/images/MD.png";

const Hero: React.FC = () => {
  return (
    <section className="relative bg-gray-900">
      {/* Fondo degradado + logo decorativo (ahora visible en todos los tamaños) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
        {/* degradado general */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-gray-900 to-black opacity-85" />

        {/* Logo grande como elemento de fondo - visible en todos los tamaños.
            En pantallas grandes lo desplazamos ligeramente hacia el centro (right-1/4).
            Ajustamos tamaños según breakpoint para mantener buena composición. */}
        <img
          src={logo}
          alt=""
          aria-hidden="true"
          loading="lazy"
          className="
            absolute
            top-8
            right-4
            opacity-20
            w-[220px] sm:w-[320px] md:w-[420px] lg:w-[560px]
            h-auto
            lg:right-1/4 lg:top-12
          "
        />
      </div>

      {/* Contenido (sobre la capa de fondo) */}
      {/* Usamos flex-col en móvil (imagen arriba), y grid en lg para layout horizontal */}
      <div className="relative z-10 mx-auto max-w-7xl px-6 py-12">
        <div className="flex flex-col-reverse lg:grid lg:grid-cols-12 lg:items-center gap-8 w-full">
          {/* Right image (on mobile shows first because of flex-col-reverse) */}
          <div className="lg:col-span-5 flex items-center justify-center order-first lg:order-last">
            {/* Contenedor visual 'invisible' — sin sombra ni efecto hover */}
            <div className="relative rounded-xl overflow-hidden bg-transparent">
              <img
                src={foto}
                alt="Martina Díaz"
                className="object-contain max-h-[60vh] md:max-h-[72vh] lg:max-h-[80vh] w-auto"
                loading="lazy"
              />
            </div>
          </div>

          {/* Left content */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <h1 className="text-white font-extrabold leading-tight text-4xl sm:text-5xl md:text-6xl lg:text-[4.25rem]">
              Martina Díaz
            </h1>
            <h2 className="text-white font-extrabold leading-tight text-2xl sm:text-3xl md:text-4xl lg:text-[3rem] mt-2">
              Fotógrafa
            </h2>

            <p className="mt-6 text-gray-200 max-w-3xl text-base sm:text-lg md:text-xl leading-relaxed">
              Periodista y fotógrafa profesional especializada en eventos deportivos. Capturo la intensidad
              del juego, la emoción de las gradas y los momentos que cuentan historias. Trabajo con edición profesional y entrega optimizada para web
              y prensa.
            </p>

            {/* Botones */}
            <div className="mt-8 flex flex-wrap gap-3">
              {/* Ver Álbumes */}
              <a
                href="#cuadricula"
                className="inline-flex items-center justify-center px-6 py-3 text-base font-medium rounded-md bg-indigo-600 hover:bg-indigo-700 text-white shadow-md focus:outline-none focus:ring-4 focus:ring-indigo-300"
              >
                Ver Álbumes
                <svg
                  className="w-5 h-5 ml-2 -mr-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>

              {/* Contacto */}
              <a
                href="#contact"
                className="inline-flex items-center justify-center px-6 py-3 text-base font-medium rounded-md border border-gray-300 text-gray-100 bg-white/6 hover:bg-white/10 focus:outline-none focus:ring-4 focus:ring-white/10"
              >
                Contáctame
              </a>

              {/* Descargar CV */}
              <a
                href={cv}
                download="CV-Martina-Diaz.pdf"
                className="inline-flex items-center justify-center px-6 py-3 text-base font-medium rounded-md bg-teal-600 hover:bg-teal-700 text-white shadow-md focus:outline-none focus:ring-4 focus:ring-teal-300"
              >
                Descargar CV
                <svg
                  className="w-5 h-5 ml-2 -mr-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 3a1 1 0 011-1h4a1 1 0 110 2H5v12h10V4h-3a1 1 0 110-2h4a1 1 0 011 1v14a2 2 0 01-2 2H5a2 2 0 01-2-2V3zm7 0a1 1 0 00-1 1v6.586L7.707 8.293a1 1 0 00-1.414 1.414l3.999 4a1 1 0 001.416 0l4-4a1 1 0 00-1.414-1.414L11 10.586V4a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
            </div>

            {/* Puntos de confianza / servicios */}
            <div className="mt-8 flex flex-wrap items-center gap-6 text-gray-300">
              <span className="text-sm">📸 Cobertura en vivo</span>
              <span className="text-sm">🕒 Entrega rápida</span>
              <span className="text-sm">📰 Formatos para prensa</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
