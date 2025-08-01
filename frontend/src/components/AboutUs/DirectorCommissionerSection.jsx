import React, { useState, useEffect } from "react";
import { PlusIcon, ChevronUpIcon, ChevronDownIcon } from "@heroicons/react/24/solid";
import DirectorTitleCard from "./components/DirectorTitleCard";
import DirectorTextCard from "./components/DirectorTextCard";
import DirectorProfileCard from "./components/DirectorProfileCard";

const componentMapDirector = {
  Title: DirectorTitleCard,
  Text: DirectorTextCard,
  Profile: DirectorProfileCard,
};
const dropdownOptionsDirector = ["Title", "Text", "Profile"];

const DirectorCommissionerSection = () => {
  const [contents, setContents] = useState(() => {
    const saved = localStorage.getItem("director_commissioner_contents");
    return saved ? JSON.parse(saved) : [];
  });
  const [isExpanded, setIsExpanded] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    localStorage.setItem("director_commissioner_contents", JSON.stringify(contents));
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
        <h2 className="text-lg font-bold text-[var(--color-button-blue)] dark:text-white tracking-wide uppercase">
          DIRECTOR & COMMISSIONER
        </h2>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            title="Tambah Konten"
            className="text-[var(--color-button-blue)] dark:text-white"
          >
            <PlusIcon className="w-5 h-5" />
          </button>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            title="Sembunyikan / Tampilkan"
            className="text-[var(--color-button-blue)] dark:text-white"
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
          {dropdownOptionsDirector.map((option) => (
            <button
              key={option}
              onClick={() => handleAddContent(option)}
              className="block w-full text-left text-sm text-[var(--color-sidebar)] dark:text-white py-1 px-3"
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
              Belum ada layanan ditambahkan.
            </div>
          ) : (
            <div className="space-y-4">
              {contents.map((content, i) => {
                const Component = componentMapDirector[content.type];
                if (!Component) return null;
                return (
                  <Component
                    key={content.id}
                    id={content.id}
                    onRemove={handleRemoveContent}
                    profileNo={content.type === "Profile" ? i + 1 : undefined}
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

export default DirectorCommissionerSection;