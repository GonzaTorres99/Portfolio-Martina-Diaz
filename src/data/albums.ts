// src/data/albums.ts
import foto from "../assets/images/6.png";
import foto2 from "../assets/images/15.png";
import foto3 from "../assets/images/PM-Campus.jpg";
import foto4 from "../assets/images/22.png";
import foto5 from "../assets/images/Portada Futbol.jpg";
import foto6 from "../assets/images/1.png";
import foto7 from "../assets/images/PM-Naturaleza.jpg";
import foto8 from "../assets/images/PM-Producto.jpg";
import foto9 from "../assets/images/PM-Teatro1.jpg";
import foto10 from "../assets/images/Portada Videos.jpg";

export type ImageItem = { src: string; alt: string };

export const images: ImageItem[] = [
  { src: foto, alt: "Basquet" },
  { src: foto2, alt: "Campeonatos" },
  { src: foto3, alt: "Campus" },
  { src: foto4, alt: "MediaDay" },
  { src: foto5, alt: "Futbol" },
  { src: foto6, alt: "Eventos" },
  { src: foto7, alt: "Naturaleza" },
  { src: foto8, alt: "Fotoproducto" },
  { src: foto9, alt: "Teatro" },
  { src: foto10, alt: "Videos" },
];

export const makeSlug = (text: string) =>
  encodeURIComponent(
    text
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "")
  );
