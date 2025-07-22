import React from "react";
import {
  PlusIcon,
  ChevronUpIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/solid";
import BannerCard from './BannerCard';
import TextInputCard from './TextInputCard';
import ButtonLinkCard from './ButtonLinkCard';
import { useBannerContent } from "./useBannerContent";

// Pemetaan tipe konten ke komponennya masing-masing
const componentMap = {
  "Upload Banner": BannerCard,
  "Title": TextInputCard,
  "Text": TextInputCard,
  "Button Link": ButtonLinkCard,
};

const BannerSection = () => {
  const {
    contents,
    selectedFiles,
    setSelectedFiles,
    showDropdown, setShowDropdown,
    isExpanded, setIsExpanded,
    dropdownOptions,
    handleAddContent, handleRemoveContent
  } = useBannerContent();

  // Handler ini tetap di komponen UI karena berurusan langsung dengan event DOM
  const handleFileChange = (event, contentId) => {
    if (!event) {
      setSelectedFiles(prev => {
        const newFiles = { ...prev };
        delete newFiles[contentId];
        return newFiles;
      });
      return;
    }

    const file = event.target.files[0];
    if (file) {
      setSelectedFiles(prev => ({
        ...prev,
        [contentId]: { name: file.name, type: file.type, size: file.size }
      }));
    }
  };

  return (
    <section>
      <div className="relative border-l-4 border-[var(--color-accent)]">
        <div className="flex items-center gap-2 mb-3 pl-2">
          <h2 className="text-lg font-bold text-[var(--color-button-blue)] dark:text-white tracking-wide">
            BANNER CONTENT
          </h2>
          <div className="flex items-center gap-1">
            <button onClick={() => setShowDropdown(!showDropdown)} className="text-[var(--color-button-blue)] dark:text-white hover:text-[var(--color-accent)]" title="Tambah Konten">
              <PlusIcon className="w-4 h-4" />
            </button>
            {/* Chevron Up/Down */}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-[var(--color-button-blue)] dark:text-white hover:text-[var(--color-accent)]"
              title="Sembunyikan / Tampilkan"
            >
              {isExpanded ? (
                <ChevronUpIcon className="w-4 h-4" />
              ) : (
                <ChevronDownIcon className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Dropdown */}
          {showDropdown && (
            <div className="absolute left-0 top-full mt-1 bg-white dark:bg-[var(--color-sidebar)] border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10 min-w-[200px] max-h-[300px] overflow-y-auto">
              {dropdownOptions.map((option) => (
                <div key={option} className="border-b border-gray-200 dark:border-gray-700 last:border-b-0">
                  <div className="flex items-center justify-between p-3">
                    <span className="text-sm text-gray-700 dark:text-white">{option}</span>
                    <button
                      onClick={() => handleAddContent(option)}
                      className="text-xs px-3 py-1 bg-[var(--color-button-blue)] text-white rounded hover:opacity-80"
                    >
                      Add
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      {isExpanded && contents.length === 0 && (
        <div className="bg-white dark:bg-[var(--color-sidebar)] border border-gray-200 dark:border-gray-700 rounded-lg p-6">
          <p className="text-center text-gray-500 dark:text-gray-400 text-sm">
            No content added yet. Click the + button to add content.
          </p>
        </div>
      )}

      {/* Content after added */}
      {isExpanded && contents.length > 0 && (
        <div className="space-y-3">
          {contents.map((content) => {
            const Component = componentMap[content.type];
            if (!Component) return null; // Safety check

            // Props yang sama untuk semua kartu
            const commonProps = {
              key: content.id,
              id: content.id,
              onRemove: handleRemoveContent,
            };

            // Props spesifik untuk tipe kartu tertentu
            const specificProps = {
              "Upload Banner": {
                selectedFile: selectedFiles[content.id],
                onFileChange: handleFileChange,
              },
              "Title": { type: content.type },
              "Text": { type: content.type },
              "Button Link": {},
            };

            // Gabungkan props dan render komponen
            return <Component {...commonProps} {...specificProps[content.type]} />;
          })}
        </div>
      )}
    </section>
  );
};

export default BannerSection;
