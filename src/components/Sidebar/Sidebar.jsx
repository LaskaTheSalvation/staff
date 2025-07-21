import React from "react";
import { Link, useLocation } from "react-router-dom";
import { XMarkIcon } from "@heroicons/react/24/outline";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();

  const navItems = [
    { label: "HOME", path: "/" },
    { label: "ABOUT US", path: "/about-us" },
    { label: "MEDIA", path: "/media" },
    { label: "SERVICE", path: "/service" },
    { label: "CONTACT", path: "/contact" },
    { label: "HALAMAN", path: "/halaman" },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 z-30 md:hidden transition-opacity duration-300 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={toggleSidebar}
      />

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 sm:w-72 z-40 
        bg-[var(--color-sidebar)] text-white 
        px-6 py-8 sm:px-8 sm:py-10 flex flex-col justify-between 
        transform transition-transform duration-300
        ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        <div>
          {/* Close Button */}
          <div className="md:hidden flex justify-end mb-6">
            <button onClick={toggleSidebar} aria-label="Tutup Sidebar">
              <XMarkIcon className="w-6 h-6 text-white dark:text-[var(--color-accent)]" />
            </button>
          </div>

          {/* Profile Info */}
          <div className="flex items-center gap-4 mb-12">
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-accent rounded-full" />
            <div>
              <div className="text-sm sm:text-lg font-bold font-heading text-white dark:text-accent">
                NAMA STAFF
              </div>
              <div className="text-xs text-white/80 dark:text-white/60">SKAJaksj@gmail.com</div>
            </div>
          </div>

          {/* Menu Items */}
          <nav>
            <ul className="flex flex-col gap-3">
              {navItems.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    onClick={toggleSidebar}
                    className={`block py-2.5 sm:py-3 pl-4 sm:pl-6 pr-4 rounded-full font-medium tracking-wide transition-all
                      ${
                        location.pathname === item.path
                          ? "bg-light text-[var(--color-sidebar)] dark:bg-[var(--color-button-blue)] dark:text-[var(--color-text-light)] font-semibold pointer-events-none"
                          : "text-[var(--color-text-light)] hover:text-white"
                      }`}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Logout */}
        <button
          className="mt-6 w-full py-2 rounded-full 
           bg-[var(--color-button-blue)] 
           text-[var(--color-text-light)] 
           transition-none"
        >
          LOGOUT
        </button>
      </aside>
    </>
  );
};

export default Sidebar;
