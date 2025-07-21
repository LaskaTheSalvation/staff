import React, { useState } from "react";
import {
  PlusIcon,
  ChevronUpIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/solid";

const BannerSection = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);

  const dropdownOptions = ["Upload Banner", "Title", "Text", "Button Link"];

  return (
    <section className="mb-6">
      {/* Header + Icons */}
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-base sm:text-lg font-bold text-white tracking-wide">
          BANNER CONTENT
        </h2>
        <div className="flex items-center gap-2 relative">
          {/* Plus Icon */}
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="bg-[var(--color-button-blue)] text-white p-1.5 rounded-md hover:opacity-80"
            title="Tambah Konten"
          >
            <PlusIcon className="w-5 h-5" />
          </button>
          {/* Chevron Up/Down */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="bg-[var(--color-button-blue)] text-white p-1.5 rounded-md hover:opacity-80"
            title="Sembunyikan / Tampilkan"
          >
            {isExpanded ? (
              <ChevronUpIcon className="w-5 h-5" />
            ) : (
              <ChevronDownIcon className="w-5 h-5" />
            )}
          </button>

          {/* Dropdown */}
          {showDropdown && (
            <ul className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-[var(--color-sidebar)] border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg z-10">
              {dropdownOptions.map((option) => (
                <li
                  key={option}
                  className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-[var(--color-card-bg)] cursor-pointer text-sm text-gray-700 dark:text-[var(--color-text-light)]"
                >
                  {option}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Content */}
      {isExpanded && (
        <div className="bg-[var(--color-card-seccondary)] rounded-xl px-4 py-6 sm:px-6 shadow-md">
          <h3 className="text-sm font-semibold text-white mb-1">Banner</h3>
          <p className="text-xs text-white/80 mb-4">lorem ipsum wkwkwkwkwkwk</p>

          {/* Input File */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
            <input
              type="text"
              className="flex-1 px-4 py-2 rounded-l-md border border-gray-300 text-black bg-white"
              placeholder="pilih file..."
              readOnly
            />
            <button className="px-4 py-2 bg-[var(--color-button-blue)] text-white rounded-r-md">
              pilih file
            </button>
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <button className="px-6 py-2 rounded-full bg-[var(--color-button-blue)] text-white shadow">
              upload
            </button>
            <button className="px-6 py-2 rounded-full bg-[var(--color-button-blue)] text-white shadow">
              hapus
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default BannerSection;
`qaw1 Q 1`