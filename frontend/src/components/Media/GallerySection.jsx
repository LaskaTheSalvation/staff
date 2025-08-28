import React, { useState, useEffect } from "react";
import { PlusIcon, ChevronUpIcon, ChevronDownIcon } from "@heroicons/react/24/solid";
import GalleryTitleCard from "./components/GalleryTitleCard";
import GalleryPictureCard from "./components/GalleryPictureCard";
import EnhancedGalleryPictureCard from "./components/EnhancedGalleryPictureCard";
import GalleryDescriptionCard from "./components/GalleryDescriptionCard";
import { contentAPI } from "../../services/api";

const componentMap = {
  Title: GalleryTitleCard,
  Picture: GalleryPictureCard,
  "Enhanced Picture": EnhancedGalleryPictureCard, // New enhanced version
  Description: GalleryDescriptionCard,
};

const dropdownOptions = ["Title", "Enhanced Picture", "Description"];

const GallerySection = () => {
  const [contents, setContents] = useState([]);
  const [isExpanded, setIsExpanded] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  // Load content from API
  useEffect(() => {
    const loadContent = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await contentAPI.gallery.get().catch(() => ({ contents: [] }));
        
        // Load content from API, fallback to localStorage for migration
        if (response.contents && response.contents.length > 0) {
          setContents(response.contents);
        } else {
          // Migration: try to load from localStorage and save to API
          const saved = localStorage.getItem("gallery_contents");
          if (saved) {
            const parsedContents = JSON.parse(saved);
            setContents(parsedContents);
            // Save to API for migration
            if (parsedContents.length > 0) {
              try {
                await contentAPI.gallery.save({ contents: parsedContents });
                localStorage.removeItem("gallery_contents"); // Clean up after migration
              } catch (err) {
                console.warn('Failed to migrate localStorage to API:', err);
              }
            }
          }
        }
      } catch (err) {
        console.error('Failed to load gallery content:', err);
        setError('Failed to load gallery content. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, []);

  // Save content to API instead of localStorage
  const saveContentToAPI = async (newContents) => {
    if (saving) return; // Prevent multiple simultaneous saves
    
    try {
      setSaving(true);
      await contentAPI.gallery.save({ contents: newContents });
    } catch (err) {
      console.error('Failed to save gallery content to API:', err);
      setError('Failed to save changes. Please try again.');
      // Still update local state for better UX
    } finally {
      setSaving(false);
    }
  };

  const handleAddContent = async (type) => {
    const newContent = { id: Date.now() + Math.random(), type };
    const newContents = [...contents, newContent];
    setContents(newContents);
    setShowDropdown(false);
    
    // Save to API
    await saveContentToAPI(newContents);
  };

  const handleRemoveContent = async (id) => {
    const newContents = contents.filter((c) => c.id !== id);
    setContents(newContents);
    
    // Save to API
    await saveContentToAPI(newContents);
  };

  return (
    <section className="mb-10">
      <div className="flex items-center gap-2 pl-3 mb-4">
        <h2 className="text-lg font-bold text-[var(--color-button-blue)] dark:text-white tracking-wide">
          GALLERY
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
          {/* Error state */}
          {error && (
            <div className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-lg p-4 mb-4">
              <p className="text-red-800 dark:text-red-200 text-sm">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-2 text-red-600 dark:text-red-400 underline text-sm"
              >
                Reload page
              </button>
            </div>
          )}

          {/* Saving indicator */}
          {saving && (
            <div className="bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 rounded-lg p-3 text-center mb-4">
              <p className="text-blue-800 dark:text-blue-200 text-sm">Saving changes...</p>
            </div>
          )}

          {/* Loading state */}
          {loading && (
            <div className="bg-yellow-50 dark:bg-yellow-900 border border-yellow-200 dark:border-yellow-700 rounded-lg p-4 text-center mb-4">
              <p className="text-yellow-800 dark:text-yellow-200">Loading gallery content...</p>
            </div>
          )}

          {contents.length === 0 && !loading ? (
            <div className="bg-white dark:bg-[var(--color-card-secondary)] border border-gray-200 dark:border-gray-700 rounded-lg p-6 text-sm text-center text-gray-500 dark:text-black">
              Belum ada konten Gallery. Klik tombol ➕ di atas.
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

export default GallerySection;
