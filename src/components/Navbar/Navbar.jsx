import React, { useState, useEffect, useRef } from "react";
import { Bars3Icon, Cog6ToothIcon } from "@heroicons/react/24/outline";

const Navbar = ({ toggleSidebar }) => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(
    localStorage.theme === "dark" ||
    (!("theme" in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches)
  );

  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.theme = "dark";
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.theme = "light";
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  return (
    <header className="bg-[var(--color-accent)] dark:bg-[var(--color-button-blue)] px-4 sm:px-6 py-4 flex justify-between items-center shadow-md z-10 w-full">
      {/* LEFT SIDE */}
      <div className="flex items-center gap-4">
        <button onClick={toggleSidebar} className="md:hidden">
          <Bars3Icon className="h-6 w-6 text-white dark:text-[var(--color-accent)]" />
        </button>
        <h1 className="text-base sm:text-lg md:text-xl font-semibold text-white dark:text-[var(--color-accent)] font-heading uppercase">
          Welcome, ...
        </h1>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex items-center gap-3 sm:gap-4">
        <input
          type="text"
          placeholder="Search"
          className="px-4 py-1.5 rounded-full text-sm w-36 sm:w-48 md:w-64 
                     bg-white text-[var(--color-button-blue)] placeholder-[#0B1D51] 
                     border border-white 
                     dark:bg-[var(--color-card-secondary)] dark:text-white dark:placeholder-white 
                     dark:border-transparent 
                     focus:outline-none"
        />

        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!isDropdownOpen)}
            className="p-2 rounded-full hover:bg-white/20 dark:hover:bg-white/10 transition"
            aria-label="Settings"
          >
            <Cog6ToothIcon className="w-6 h-6 text-white dark:text-[var(--color-text-light)]" />
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-44 bg-white dark:bg-[var(--color-button-blue)] rounded-lg shadow-lg z-50 py-3 px-4">
              <div className="flex items-center justify-between text-sm font-medium text-black dark:text-white">
                <span>Dark Mode</span>
                <button
                  onClick={toggleDarkMode}
                  className="relative w-10 h-5 bg-gray-300 dark:bg-gray-600 rounded-full transition"
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow-md transform transition ${
                      darkMode ? "translate-x-5" : ""
                    }`}
                  />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
