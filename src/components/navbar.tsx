// src/components/Navbar.tsx
import React from "react";
import logo from "../assets/images/MD.png";
import { Disclosure } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

const Navbar: React.FC = () => {
  return (
    <Disclosure as="nav" className="relative bg-gray-800">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
            <div className="relative flex h-16 items-center justify-between">
              {/* Mobile menu button */}
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-white/5 hover:text-white focus:outline-2 focus:outline-offset-1 focus:outline-indigo-500">
                  <span className="sr-only">Abrir menú</span>
                  {open ? (
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>

              {/* Logo + (placeholder for future nav) */}
              <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                <div className="flex shrink-0 items-center">
                  <a href="/" className="flex items-center">
                    {/* logo más grande y responsive */}
                    <img
                      src={logo}
                      alt="Martina Díaz"
                      className="h-12 sm:h-14 md:h-16 w-auto"
                    />
                  </a>
                </div>
                <div className="hidden sm:ml-6 sm:block" />
              </div>

              {/* Desktop buttons (right side) */}
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                <a
                  href="#cuadricula"
                  className="hidden sm:inline-flex items-center px-4 py-2 mr-3 text-sm font-medium rounded-md bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                >
                  Ver Álbumes
                </a>

                <a
                  href="#contact"
                  className="hidden sm:inline-flex items-center px-4 py-2 text-sm font-medium rounded-md border border-gray-300 text-gray-100 bg-white/6 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/10"
                >
                  Contacto
                </a>
              </div>
            </div>
          </div>

          {/* Mobile panel */}
          <Disclosure.Panel className="sm:hidden">
            <div className="space-y-1 px-2 pt-2 pb-3">
              <Disclosure.Button
                as="a"
                href="#cuadricula"
                className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-white/5 hover:text-white"
              >
                Ver Álbumes
              </Disclosure.Button>

              <Disclosure.Button
                as="a"
                href="#contact"
                className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-white/5 hover:text-white"
              >
                Contacto
              </Disclosure.Button>
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
};

export default Navbar;
