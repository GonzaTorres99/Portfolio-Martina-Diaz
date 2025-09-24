// Hero.tsx
import foto from '../assets/images/MartinaDiazPH-15.jpg';
import cv from '../assets/cv/CV Martina Díaz.pdf';

const Hero: React.FC = () => {
  return (
    <section className="relative h-[90vh] bg-gray-900">
      {/* Fondo degradado + SVG decorativo */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-gray-900 to-black opacity-85" />
        <svg
          className="absolute -right-28 top-10 hidden lg:block opacity-20"
          width="560"
          height="560"
          viewBox="0 0 560 560"
          fill="none"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="g1" x1="0" x2="1">
              <stop offset="0" stopColor="#06b6d4" stopOpacity="0.18" />
              <stop offset="1" stopColor="#7c3aed" stopOpacity="0.06" />
            </linearGradient>
          </defs>
          <circle cx="280" cy="280" r="280" fill="url(#g1)" />
        </svg>
      </div>

      {/* Contenido */}
      <div className="relative z-10 mx-auto max-w-7xl px-6 py-12 h-full flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center w-full h-full">
          {/* Left content */}
          <div className="lg:col-span-7 flex flex-col justify-center h-full">
            <h1 className="text-white font-extrabold leading-tight text-4xl sm:text-5xl md:text-6xl lg:text-[4.25rem]">
              Martina Díaz
            </h1>
             <h1 className="text-white font-extrabold leading-tight text-4xl sm:text-5xl md:text-6xl lg:text-[4.25rem]">
              Fotógrafa
            </h1>

            <p className="mt-6 text-gray-200 max-w-3xl text-base sm:text-lg md:text-xl lg:text-2xl leading-relaxed">
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
                download="CV-Martina-Diaz.pdf" // 👉 el nombre con el que se descarga
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

          {/* Right image */}
          <div className="lg:col-span-5 flex items-center justify-center h-4/5">
            <div className="w-full h-full max-h-[80vh] lg:max-h-[85vh] rounded-xl overflow-hidden shadow-2xl transform transition-transform duration-500 hover:scale-105">
              <img
                src={foto}
                alt="Martina Díaz, fotógrafa deportiva - ejemplo de retrato editorial"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
