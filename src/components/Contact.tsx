import React, { useState } from "react";
import foto from "../assets/images/MartinaDiazPH-15.jpg";

const contacts = [
  {
    id: "instagram",
    label: "Instagram",
    href: "https://www.instagram.com/martinadiazph/",
    handle: "@martinadiazph",
    aria: "Abrir Instagram",
  },
  {
    id: "tiktok",
    label: "TikTok",
    href: "https://www.tiktok.com/@martinadiazph?is_from_webapp=1&sender_device=pc",
    handle: "@martinadiazph",
    aria: "Abrir TikTok",
  },
  {
    id: "mail",
    label: "Email",
    href: "mailto:martidiazfotos@gmail.com",
    handle: "martidiazfotos@gmail.com",
    aria: "Enviar email",
  },
];

const Icon: React.FC<{ name: string }> = ({ name }) => {
  switch (name) {
    case "instagram":
      return (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" aria-hidden>
          <rect
            x="3"
            y="3"
            width="18"
            height="18"
            rx="5"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <path
            d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M17.5 6.5h.01"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "tiktok":
      return (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M9 8v8a4 4 0 1 0 4-4V6h3"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "mail":
      return (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M3 8.5v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M3 8.5l8.5 6L20 8.5"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    default:
      return null;
  }
};

const Contact: React.FC = () => {
  const [copied, setCopied] = useState<string | null>(null);

  const handleCopy = async (text: string, id: string) => {
    if (!navigator.clipboard) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(id);
      setTimeout(() => setCopied(null), 1600);
    } catch {
      // fallback: nothing
    }
  };

  return (
    <section className="w-full py-12" id="contact">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          {/* Imagen */}
          <div className="md:col-span-1 flex items-center justify-center">
            <div className="w-56 h-56 rounded-xl overflow-hidden shadow-2xl ring-1 ring-white/10">
              <img
                src={foto}
                alt="Martina Díaz"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Lista de contacto */}
          <div className="md:col-span-2">
            <h2 className="text-white text-3xl sm:text-4xl font-bold mb-3">
              Contacto
            </h2>
            <p className="text-gray-300 mb-6 max-w-2xl">
              Si querés contratar una cobertura, pedir material para prensa,
              podés comunicarte por cualquiera de estos medios.
            </p>

            <ul className="space-y-3 max-w-md">
              {contacts.map((c) => (
                <li
                  key={c.id}
                  className="flex items-center justify-between bg-white/3 rounded-md p-3"
                >
                  <div className="flex items-center gap-3">
                    <span className="p-2 rounded-md bg-white/5 text-white">
                      <Icon name={c.id} />
                    </span>
                    <div>
                      <div className="text-white font-medium">{c.label}</div>
                      <div className="text-gray-300 text-sm">{c.handle}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Abrir solo si NO es mail */}
                    {c.id !== "mail" && (
                      <a
                        href={c.href}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md bg-indigo-600 hover:bg-indigo-700 text-white"
                      >
                        Abrir
                      </a>
                    )}

                    {/* Copiar solo para mail */}
                    {c.id === "mail" && (
                      <button
                        type="button"
                        onClick={() => handleCopy(c.handle, c.id)}
                        className="inline-flex items-center px-3 py-1.5 text-sm rounded-md bg-white/5 text-white"
                        aria-label={`Copiar ${c.label}`}
                      >
                        {copied === c.id ? "Copiado" : "Copiar"}
                      </button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
