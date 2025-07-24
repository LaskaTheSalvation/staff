// src/components/AboutUs/VisiMisiSection.jsx
import React, { useState, useEffect } from "react";
import { PlusIcon, ChevronUpIcon, ChevronDownIcon } from "@heroicons/react/24/solid";

// Perbaikan jalur impor di sini:
// Jika VisiMisiSection.jsx berada di `src/components/AboutUs/`
// Maka VisiCard.jsx ada di `src/components/AboutUs/VisiMisi/components/`
// Jalur relatifnya harus seperti ini:
import VisiCard from "./components/VisiCard";
import MisiCard from "./components/MisiCard"; // Asumsi MisiCard juga di folder yang sama

const componentMap = {
  Visi: VisiCard, // Pastikan nama di componentMap sesuai
  Misi: MisiCard, // Pastikan nama di componentMap sesuai
};

const dropdownOptions = ["Visi", "Misi"]; // Sesuaikan dengan opsi yang Anda inginkan

const VisiMisiSection = () => {
  const [contents, setContents] = useState(() => {
    const saved = localStorage.getItem("visi_misi_contents"); // Ubah key localStorage
    return saved ? JSON.parse(saved) : [];
  });
  const [isExpanded, setIsExpanded] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    localStorage.setItem("visi_misi_contents", JSON.stringify(contents)); // Ubah key localStorage
  }, [contents]);

  const handleAddContent = (type) => {
    setContents((prev) => [...prev, { id: Date.now() + Math.random(), type }]);
    setShowDropdown(false);
  };

  const handleRemoveContent = (id) => {
    setContents((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <section className="mb-10">
      <div className="flex items-center gap-2 pl-3 mb-4">
        <h2 className="text-lg font-bold text-[var(--color-button-blue)] dark:text-white tracking-wide">
          VISI & MISI
        </h2>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            title="Tambah Konten"
            className="text-[var(--color-button-blue)] dark:text-white hover:text-[var(--color-accent)]"
          >
            <PlusIcon className="w-5 h-5" />
          </button>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            title="Sembunyikan / Tampilkan"
            className="text-[var(--color-button-blue)] dark:text-white hover:text-[var(--color-accent)]"
          >
            {isExpanded ? (
              <ChevronUpIcon className="w-5 h-5" />
            ) : (
              <ChevronDownIcon className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {showDropdown && (
        <div className="mb-4 bg-white dark:bg-[var(--color-sidebar)] border border-gray-200 dark:border-gray-700 rounded-lg p-3 w-fit shadow-md">
          {dropdownOptions.map((option) => (
            <button
              key={option}
              onClick={() => handleAddContent(option)}
              className="block w-full text-left text-sm text-[var(--color-sidebar)] dark:text-white hover:text-[var(--color-accent)] py-1 px-3"
            >
              + {option}
            </button>
          ))}
        </div>
      )}

      {isExpanded && (
        <>
          {contents.length === 0 ? (
            <div className="bg-white dark:bg-[var(--color-card-secondary)] border border-gray-200 dark:border-gray-700 rounded-lg p-6 text-sm text-center text-gray-500 dark:text-black">
              Belum ada konten Visi & Misi.
            </div>
          ) : (
            <div className="space-y-4">
              {contents.map((content) => {
                const Component = componentMap[content.type];
                if (!Component) return null;
                return (
                  <Component
                    key={content.id}
                    id={content.id}
                    onRemove={handleRemoveContent}
                  />
                );
              })}
            </div>
          )}
        </>
      )}
    </section>
  );
};

export default VisiMisiSection;