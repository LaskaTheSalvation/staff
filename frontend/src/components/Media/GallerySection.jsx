import React, { useState, useEffect, useCallback } from "react";
import { PlusIcon, ChevronUpIcon, ChevronDownIcon, XMarkIcon, TrashIcon, PencilSquareIcon, CheckIcon } from "@heroicons/react/24/solid";
import GalleryTitleCard from "./components/GalleryTitleCard";
import GalleryDescriptionCard from "./components/GalleryDescriptionCard";
import { contentAPI, mediaAPI } from "../../services/api";
import MediaButton from "./MediaButton";

// Custom hook for debounced API calls
const useDebounce = (callback, delay) => {
  const [debounceTimer, setDebounceTimer] = useState(null);

  const debouncedCallback = useCallback((...args) => {
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }
    
    setDebounceTimer(setTimeout(() => {
      callback(...args);
    }, delay));
  }, [callback, delay, debounceTimer]);

  return debouncedCallback;
};

const GallerySection = () => {
  const [gallery, setGallery] = useState(null);
  const [galleryItems, setGalleryItems] = useState([]);
  const [contentCards, setContentCards] = useState([]);
  const [isExpanded, setIsExpanded] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saveStatus, setSaveStatus] = useState({});
  const [editingItemId, setEditingItemId] = useState(null);

  // Load gallery data on component mount
  useEffect(() => {
    loadGalleryData();
  }, []);

  const loadGalleryData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Check for localStorage migration first
      await migrateLocalStorageData();
      
      // Get or create gallery for the current company (we'll use company ID 1 as default)
      const galleryData = await contentAPI.gallery.getOrCreate(1);
      setGallery(galleryData);
      
      // Load gallery items
      const items = await contentAPI.gallery.items.list(galleryData.id);
      setGalleryItems(items);
      
    } catch (err) {
      console.error('Error loading gallery:', err);
      setError('Failed to load gallery. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Migrate localStorage data to API (one-time operation)
  const migrateLocalStorageData = async () => {
    const saved = localStorage.getItem("gallery_contents");
    if (!saved) return;

    try {
      const oldContents = JSON.parse(saved);
      console.log('Migrating gallery localStorage data to API:', oldContents);
      
      // For content cards (Title, Description), keep them in state
      const contentItems = oldContents.filter(item => item.type === 'Title' || item.type === 'Description');
      if (contentItems.length > 0) {
        setContentCards(contentItems);
      }
      
      // For Enhanced Picture items, they'll be handled by the gallery API
      // Remove localStorage after successful migration
      localStorage.removeItem("gallery_contents");
      console.log('Gallery migration completed, localStorage cleaned up');
      
    } catch (err) {
      console.error('Error during gallery migration:', err);
    }
  };

  // Debounced save function for gallery items
  const debouncedSaveItem = useDebounce(async (itemId, data) => {
    try {
      setSaveStatus(prev => ({ ...prev, [itemId]: 'saving' }));
      await contentAPI.gallery.items.update(gallery.id, itemId, data);
      setSaveStatus(prev => ({ ...prev, [itemId]: 'saved' }));
      
      // Clear save status after 2 seconds
      setTimeout(() => {
        setSaveStatus(prev => ({ ...prev, [itemId]: null }));
      }, 2000);
      
    } catch (err) {
      console.error('Error saving gallery item:', err);
      setSaveStatus(prev => ({ ...prev, [itemId]: 'error' }));
    }
  }, 800);

  const handleAddGalleryItem = async (selectedMedia) => {
    if (!gallery || !selectedMedia) return;
    
    try {
      const newItem = await contentAPI.gallery.items.add(gallery.id, {
        media: selectedMedia.id,
        name: selectedMedia.display_name || selectedMedia.title,
        title: selectedMedia.title || selectedMedia.display_name,
        ordering: galleryItems.length
      });
      
      setGalleryItems(prev => [...prev, newItem]);
      
    } catch (err) {
      console.error('Error adding gallery item:', err);
      setError('Failed to add gallery item. Please try again.');
    }
  };

  const handleUpdateGalleryItem = (itemId, field, value) => {
    // Update local state immediately for responsive UI
    setGalleryItems(prev => 
      prev.map(item => 
        item.id === itemId ? { ...item, [field]: value } : item
      )
    );
    
    // Debounced API update
    const updatedItem = galleryItems.find(item => item.id === itemId);
    if (updatedItem) {
      debouncedSaveItem(itemId, { ...updatedItem, [field]: value });
    }
  };

  const handleRemoveGalleryItem = async (itemId) => {
    if (!window.confirm('Are you sure you want to remove this gallery item?')) return;
    
    try {
      await contentAPI.gallery.items.remove(gallery.id, itemId);
      setGalleryItems(prev => prev.filter(item => item.id !== itemId));
    } catch (err) {
      console.error('Error removing gallery item:', err);
      setError('Failed to remove gallery item. Please try again.');
    }
  };

  const handleAddContentCard = (type) => {
    const newCard = { id: Date.now() + Math.random(), type };
    setContentCards(prev => [...prev]);
  };

  const handleRemoveContentCard = (id) => {
    setContentCards(prev => prev.filter(card => card.id !== id));
  };

  const getSaveStatusText = (id) => {
    const status = saveStatus[id];
    switch (status) {
      case 'saving': return 'Saving...';
      case 'saved': return 'Saved ✓';
      case 'error': return 'Error ✗';
      default: return '';
    }
  };

  const getSaveStatusClass = (id) => {
    const status = saveStatus[id];
    switch (status) {
      case 'saving': return 'text-blue-500';
      case 'saved': return 'text-green-500';
      case 'error': return 'text-red-500';
      default: return '';
    }
  };

  if (isLoading) {
    return (
      <section className="mb-10">
        <div className="flex items-center gap-2 pl-3 mb-4">
          <h2 className="text-lg font-bold text-[var(--color-button-blue)] dark:text-white tracking-wide">
            GALLERY
          </h2>
        </div>
        <div className="bg-white dark:bg-[var(--color-card-secondary)] border border-gray-200 dark:border-gray-700 rounded-lg p-6 text-sm text-center text-gray-500 dark:text-black">
          Loading gallery...
        </div>
      </section>
    );
  }

  return (
    <section className="mb-10">
      <div className="flex items-center gap-2 pl-3 mb-4">
        <h2 className="text-lg font-bold text-[var(--color-button-blue)] dark:text-white tracking-wide">
          GALLERY
        </h2>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            title="Toggle Section"
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

      {error && (
        <div className="mb-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-sm text-red-700 dark:text-red-300">
          {error}
          <button 
            onClick={() => setError(null)}
            className="ml-2 text-red-500 hover:text-red-700"
          >
            ✕
          </button>
        </div>
      )}

      {isExpanded && (
        <>
          {/* Gallery Items Management */}
          <div className="mb-6">
            <div className="bg-white dark:bg-[var(--color-card-bg)] rounded-lg shadow-elevated px-6 pt-5 pb-6">
              <h3 className="text-lg font-bold mb-4 text-[var(--color-button-blue)]">
                Gallery Images
              </h3>
              
              <div className="mb-4">
                <MediaButton
                  onMediaSelect={handleAddGalleryItem}
                  fileTypes={['image']}
                  buttonText="Add Image to Gallery"
                  className="bg-[var(--color-button-blue)] text-white px-4 py-2 rounded-xl hover:bg-[var(--color-accent)] transition-colors"
                  showPreview={false}
                />
              </div>

              {galleryItems.length === 0 ? (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  No images in gallery yet. Click "Add Image to Gallery" to get started.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {galleryItems.map((item) => (
                    <div key={item.id} className="relative bg-gray-50 dark:bg-[var(--color-card-secondary)] rounded-lg p-4">
                      <button
                        onClick={() => handleRemoveGalleryItem(item.id)}
                        className="absolute top-2 right-2 p-1 text-gray-400 hover:text-red-500 z-10"
                        title="Remove from Gallery"
                      >
                        <XMarkIcon className="w-4 h-4" />
                      </button>

                      {/* Image Display */}
                      {item.media_details?.thumbnail_urls?.medium && (
                        <img 
                          src={item.media_details.thumbnail_urls.medium} 
                          alt={item.media_details.alt_text || item.name}
                          className="w-full h-40 object-cover rounded-lg mb-3"
                        />
                      )}

                      {/* Item Details */}
                      <div className="space-y-2">
                        <div>
                          <label className="block text-sm font-medium text-[var(--color-button-blue)] mb-1">
                            Name
                          </label>
                          {editingItemId === item.id ? (
                            <input
                              type="text"
                              value={item.name || ''}
                              onChange={(e) => handleUpdateGalleryItem(item.id, 'name', e.target.value)}
                              className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
                              placeholder="Enter name"
                            />
                          ) : (
                            <div className="px-2 py-1 bg-white dark:bg-[var(--color-card-bg)] border border-gray-200 dark:border-gray-600 rounded text-sm">
                              {item.name || 'No name'}
                            </div>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-[var(--color-button-blue)] mb-1">
                            Title
                          </label>
                          {editingItemId === item.id ? (
                            <input
                              type="text"
                              value={item.title || ''}
                              onChange={(e) => handleUpdateGalleryItem(item.id, 'title', e.target.value)}
                              className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
                              placeholder="Enter title"
                            />
                          ) : (
                            <div className="px-2 py-1 bg-white dark:bg-[var(--color-card-bg)] border border-gray-200 dark:border-gray-600 rounded text-sm">
                              {item.title || 'No title'}
                            </div>
                          )}
                        </div>

                        <div className="flex justify-between items-center pt-2">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setEditingItemId(editingItemId === item.id ? null : item.id)}
                              className="p-1 text-[var(--color-button-blue)] hover:text-[var(--color-accent)]"
                              title={editingItemId === item.id ? "Stop Editing" : "Edit"}
                            >
                              {editingItemId === item.id ? (
                                <CheckIcon className="w-4 h-4" />
                              ) : (
                                <PencilSquareIcon className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                          
                          <span className={`text-xs ${getSaveStatusClass(item.id)}`}>
                            {getSaveStatusText(item.id)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Content Cards (Title, Description) */}
          {contentCards.length > 0 && (
            <div className="space-y-4">
              {contentCards.map((card) => {
                const Component = card.type === 'Title' ? GalleryTitleCard : GalleryDescriptionCard;
                return (
                  <Component
                    key={card.id}
                    id={card.id}
                    onRemove={handleRemoveContentCard}
                  />
                );
              })}
            </div>
          )}

          {/* Add Content Cards */}
          <div className="mt-4">
            <div className="flex gap-2">
              <button
                onClick={() => handleAddContentCard('Title')}
                className="px-3 py-2 bg-[var(--color-button-blue)] text-white rounded-lg hover:bg-[var(--color-accent)] transition-colors text-sm"
              >
                + Add Title
              </button>
              <button
                onClick={() => handleAddContentCard('Description')}
                className="px-3 py-2 bg-[var(--color-button-blue)] text-white rounded-lg hover:bg-[var(--color-accent)] transition-colors text-sm"
              >
                + Add Description
              </button>
            </div>
          </div>
        </>
      )}
    </section>
  );
};

export default GallerySection;
