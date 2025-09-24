import React from "react";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="relative min-h-screen bg-gray-900 text-white overflow-hidden">
      {/* Fondo degradado */}
      <div className="absolute inset-0 -z-10">
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
            <linearGradient id="layout-gradient" x1="0" x2="1">
              <stop offset="0" stopColor="#06b6d4" stopOpacity="0.18" />
              <stop offset="1" stopColor="#7c3aed" stopOpacity="0.06" />
            </linearGradient>
          </defs>
          <circle cx="280" cy="280" r="280" fill="url(#layout-gradient)" />
        </svg>
      </div>

      {/* Contenido de la página */}
      <main className="relative z-10">{children}</main>
    </div>
  );
};

export default Layout;
