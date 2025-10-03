// src/components/Hero.tsx
import React from "react";
import foto from '../assets/images/marti1.png';
import cv from '../assets/cv/CV Martina Díaz.pdf';
import logo from "../assets/images/MD.png";

const Hero: React.FC = () => {
  return (
    // minHeight = 100vh - navbar (h-16 = 4rem)
    <section
      className="relative bg-gray-900"
      style={{ minHeight: "calc(100vh - 4rem)" }}
    >
      {/* Fondo degradado + logo decorativo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-gray-900 to-black opacity-85" />

        <img
          src={logo}
          alt=""
          aria-hidden="true"
          loading="lazy"
          className="absolute top-8 right-4 opacity-20 w-[220px] sm:w-[320px] md:w-[420px] lg:w-[560px] h-auto lg:left-[70%] lg:right-auto lg:top-20"
        />
      </div>

      {/* Contenido: relleno vertical para ajustar visual (más espacio arriba en lg),
          además empujamos contenido hacia abajo en lg con translate-y-6 */}
      <div className="relative z-10 mx-auto max-w-7xl px-6 pt-12 pb-8 h-full flex items-center lg:pt-20 lg:pb-0">
        {/* flex column on mobile (image first), row on lg (image to the right)
            y transform para desplazar un poco hacia abajo en lg */}
        <div className="w-full flex flex-col lg:flex-row lg:items-center gap-8 h-full transform lg:translate-y-6">
          {/* Imagen: aparece primero en DOM (stack arriba en mobile), en lg va a la derecha */}
          <div className="w-full lg:w-5/12 flex items-center justify-center order-first lg:order-last h-full">
            <div className="relative rounded-xl overflow-hidden bg-transparent self-center">
              <img
                src={foto}
                alt="Martina Díaz"
                className="object-contain max-h-[60vh] md:max-h-[72vh] lg:max-h-[80vh] w-auto"
                loading="lazy"
              />
            </div>
          </div>

          {/* Texto */}
          <div className="w-full lg:w-7/12 flex flex-col justify-center h-full">
            <h1 className="text-white font-extrabold leading-tight text-4xl sm:text-5xl md:text-6xl lg:text-[4.25rem]">
              Martina Díaz
            </h1>
            <h2 className="text-white font-extrabold leading-tight text-2xl sm:text-3xl md:text-4xl lg:text-[3rem] mt-2">
              Fotografía
            </h2>

            <p className="mt-6 text-gray-200 max-w-3xl text-base sm:text-lg md:text-xl leading-relaxed">
              Soy comunicadora social, periodista y fotógrafa profesional, especializada en la cobertura de eventos deportivos. Mi búsqueda estética se concentra en capturar la intensidad del juego, la emoción de las gradas y los momentos que cuentan historias. Cuido estrictamente la calidad en mis producciones: trabajo con edición profesional y entrega optimizada para web y prensa.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#cuadricula"
                className="inline-flex items-center justify-center px-6 py-3 text-base font-medium rounded-md bg-indigo-600 hover:bg-indigo-700 text-white shadow-md focus:outline-none focus:ring-4 focus:ring-indigo-300"
              >
                Ver Álbumes
                <svg className="w-5 h-5 ml-2 -mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </a>

              <a
                href="#contact"
                className="inline-flex items-center justify-center px-6 py-3 text-base font-medium rounded-md border border-gray-300 text-gray-100 bg-white/6 hover:bg-white/10 focus:outline-none focus:ring-4 focus:ring-white/10"
              >
                Contáctame
              </a>

              <a
                href={cv}
                download="CV-Martina-Diaz.pdf"
                className="inline-flex items-center justify-center px-6 py-3 text-base font-medium rounded-md bg-teal-600 hover:bg-teal-700 text-white shadow-md focus:outline-none focus:ring-4 focus:ring-teal-300"
              >
                Descargar CV
                <svg className="w-5 h-5 ml-2 -mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M3 3a1 1 0 011-1h4a1 1 0 110 2H5v12h10V4h-3a1 1 0 110-2h4a1 1 0 011 1v14a2 2 0 01-2 2H5a2 2 0 01-2-2V3zm7 0a1 1 0 00-1 1v6.586L7.707 8.293a1 1 0 00-1.414 1.414l3.999 4a1 1 0 001.416 0l4-4a1 1 0 00-1.414-1.414L11 10.586V4a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </a>
            </div>

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
