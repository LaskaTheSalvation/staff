import React, { useState, useEffect, useCallback } from "react";
import { PlusIcon, ChevronUpIcon, ChevronDownIcon, TrashIcon, PencilSquareIcon, CheckIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { teamMemberAPI, mediaAPI } from "../../services/api";

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

const DirectorCommissionerSection = () => {
  const [directors, setDirectors] = useState([]);
  const [isExpanded, setIsExpanded] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saveStatus, setSaveStatus] = useState({});
  const [editingId, setEditingId] = useState(null);

  // Load directors from API on component mount
  useEffect(() => {
    loadDirectors();
  }, []);

  const loadDirectors = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Check for localStorage migration first
      await migrateLocalStorageData();
      
      // Load directors from API (team members with is_management=true)
      const response = await teamMemberAPI.getAll();
      const managementMembers = response.filter(member => member.is_management);
      setDirectors(managementMembers);
      
    } catch (err) {
      console.error('Error loading directors:', err);
      setError('Failed to load directors. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Migrate localStorage data to API (one-time operation)
  const migrateLocalStorageData = async () => {
    const saved = localStorage.getItem("director_commissioner_contents");
    if (!saved) return;

    try {
      const oldContents = JSON.parse(saved);
      console.log('Migrating localStorage data to API:', oldContents);
      
      // For now, create a simple director entry if old data exists
      if (oldContents.length > 0) {
        // Check if we already have directors to avoid duplicate migration
        const existingDirectors = await teamMemberAPI.getAll();
        const hasManagement = existingDirectors.some(member => member.is_management);
        
        if (!hasManagement) {
          // Create a default director from localStorage data
          await teamMemberAPI.create({
            name: 'Director/Commissioner',
            position: 'Director',
            bio: 'Migrated from previous configuration',
            is_management: true,
            display_order: 0
          });
        }
      }
      
      // Remove localStorage after successful migration
      localStorage.removeItem("director_commissioner_contents");
      console.log('Migration completed, localStorage cleaned up');
      
    } catch (err) {
      console.error('Error during migration:', err);
    }
  };

  // Debounced save function
  const debouncedSave = useDebounce(async (id, data) => {
    try {
      setSaveStatus(prev => ({ ...prev, [id]: 'saving' }));
      await teamMemberAPI.update(id, data);
      setSaveStatus(prev => ({ ...prev, [id]: 'saved' }));
      
      // Clear save status after 2 seconds
      setTimeout(() => {
        setSaveStatus(prev => ({ ...prev, [id]: null }));
      }, 2000);
      
    } catch (err) {
      console.error('Error saving director:', err);
      setSaveStatus(prev => ({ ...prev, [id]: 'error' }));
    }
  }, 800);

  const handleAddDirector = async () => {
    try {
      const newDirector = await teamMemberAPI.create({
        name: 'New Director',
        position: 'Director',
        bio: '',
        is_management: true,
        display_order: directors.length
      });
      
      setDirectors(prev => [...prev, newDirector]);
      setEditingId(newDirector.id);
      
    } catch (err) {
      console.error('Error adding director:', err);
      setError('Failed to add director. Please try again.');
    }
  };

  const handleUpdateDirector = (id, field, value) => {
    // Update local state immediately for responsive UI
    setDirectors(prev => 
      prev.map(director => 
        director.id === id ? { ...director, [field]: value } : director
      )
    );
    
    // Debounced API update
    const updatedDirector = directors.find(d => d.id === id);
    if (updatedDirector) {
      debouncedSave(id, { ...updatedDirector, [field]: value });
    }
  };

  const handleRemoveDirector = async (id) => {
    if (!window.confirm('Are you sure you want to remove this director?')) return;
    
    try {
      await teamMemberAPI.delete(id);
      setDirectors(prev => prev.filter(director => director.id !== id));
    } catch (err) {
      console.error('Error removing director:', err);
      setError('Failed to remove director. Please try again.');
    }
  };

  const handleImageUpload = async (directorId, file) => {
    try {
      setSaveStatus(prev => ({ ...prev, [directorId]: 'uploading' }));
      
      const formData = new FormData();
      formData.append('file', file);
      formData.append('title', `Director ${directorId} Photo`);
      formData.append('alt_text', 'Director photo');
      
      const uploadResult = await mediaAPI.upload(formData);
      
      // Update director with new image path
      await handleUpdateDirector(directorId, 'image_path', uploadResult.file_url);
      
    } catch (err) {
      console.error('Error uploading image:', err);
      setSaveStatus(prev => ({ ...prev, [directorId]: 'error' }));
    }
  };

  const getSaveStatusText = (id) => {
    const status = saveStatus[id];
    switch (status) {
      case 'saving': return 'Saving...';
      case 'saved': return 'Saved ✓';
      case 'uploading': return 'Uploading...';
      case 'error': return 'Error ✗';
      default: return '';
    }
  };

  const getSaveStatusClass = (id) => {
    const status = saveStatus[id];
    switch (status) {
      case 'saving':
      case 'uploading': 
        return 'text-blue-500';
      case 'saved': 
        return 'text-green-500';
      case 'error': 
        return 'text-red-500';
      default: 
        return '';
    }
  };

  if (isLoading) {
    return (
      <section className="mb-10">
        <div className="flex items-center gap-2 pl-3 mb-4">
          <h2 className="text-lg font-bold text-[var(--color-button-blue)] dark:text-white tracking-wide uppercase">
            DIRECTOR & COMMISSIONER
          </h2>
        </div>
        <div className="bg-white dark:bg-[var(--color-card-secondary)] border border-gray-200 dark:border-gray-700 rounded-lg p-6 text-sm text-center text-gray-500 dark:text-black">
          Loading directors...
        </div>
      </section>
    );
  }

  return (
    <section className="mb-10">
      <div className="flex items-center gap-2 pl-3 mb-4">
        <h2 className="text-lg font-bold text-[var(--color-button-blue)] dark:text-white tracking-wide uppercase">
          DIRECTOR & COMMISSIONER
        </h2>
        <div className="flex items-center gap-1">
          <button
            onClick={handleAddDirector}
            title="Add Director"
            className="text-[var(--color-button-blue)] dark:text-white hover:text-[var(--color-accent)]"
          >
            <PlusIcon className="w-5 h-5" />
          </button>
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
          {directors.length === 0 ? (
            <div className="bg-white dark:bg-[var(--color-card-secondary)] border border-gray-200 dark:border-gray-700 rounded-lg p-6 text-sm text-center text-gray-500 dark:text-black">
              No directors added yet. Click the ➕ button above to add a director.
            </div>
          ) : (
            <div className="space-y-4">
              {directors.map((director) => (
                <div key={director.id} className="relative mb-4">
                  <div className="absolute left-0 top-0 h-full w-2 rounded-l-lg bg-[var(--color-accent)] dark:bg-[var(--color-button-blue)]"></div>
                  
                  <button
                    onClick={() => handleRemoveDirector(director.id)}
                    className="absolute top-3 right-3 p-1 text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400 z-10"
                    title="Remove Director"
                  >
                    <XMarkIcon className="w-5 h-5" />
                  </button>

                  <div className="ml-2 bg-white dark:bg-[var(--color-card-bg)] rounded-lg shadow-elevated px-6 pt-5 pb-6">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-lg font-bold text-[var(--color-button-blue)]">
                        Director Profile
                      </h3>
                      <div className="flex items-center gap-2">
                        <span className={`text-sm ${getSaveStatusClass(director.id)}`}>
                          {getSaveStatusText(director.id)}
                        </span>
                        <button
                          onClick={() => setEditingId(editingId === director.id ? null : director.id)}
                          className="p-1 text-[var(--color-button-blue)] hover:text-[var(--color-accent)]"
                          title={editingId === director.id ? "Stop Editing" : "Edit"}
                        >
                          {editingId === director.id ? (
                            <CheckIcon className="w-5 h-5" />
                          ) : (
                            <PencilSquareIcon className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-[var(--color-button-blue)] mb-2">
                          Name
                        </label>
                        {editingId === director.id ? (
                          <input
                            type="text"
                            value={director.name}
                            onChange={(e) => handleUpdateDirector(director.id, 'name', e.target.value)}
                            className="w-full px-4 py-2 bg-gray-100 dark:bg-[var(--color-card-secondary)] border border-gray-300 dark:border-gray-600 text-[var(--color-button-blue)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
                            placeholder="Enter director name"
                          />
                        ) : (
                          <div className="px-4 py-2 bg-gray-50 dark:bg-[var(--color-card-secondary)] border border-gray-200 dark:border-gray-600 text-[var(--color-button-blue)] rounded-xl">
                            {director.name || 'No name set'}
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-[var(--color-button-blue)] mb-2">
                          Position
                        </label>
                        {editingId === director.id ? (
                          <input
                            type="text"
                            value={director.position}
                            onChange={(e) => handleUpdateDirector(director.id, 'position', e.target.value)}
                            className="w-full px-4 py-2 bg-gray-100 dark:bg-[var(--color-card-secondary)] border border-gray-300 dark:border-gray-600 text-[var(--color-button-blue)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
                            placeholder="Enter position/title"
                          />
                        ) : (
                          <div className="px-4 py-2 bg-gray-50 dark:bg-[var(--color-card-secondary)] border border-gray-200 dark:border-gray-600 text-[var(--color-button-blue)] rounded-xl">
                            {director.position || 'No position set'}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mt-4">
                      <label className="block text-sm font-medium text-[var(--color-button-blue)] mb-2">
                        Biography
                      </label>
                      {editingId === director.id ? (
                        <textarea
                          value={director.bio || ''}
                          onChange={(e) => handleUpdateDirector(director.id, 'bio', e.target.value)}
                          rows={3}
                          className="w-full px-4 py-2 bg-gray-100 dark:bg-[var(--color-card-secondary)] border border-gray-300 dark:border-gray-600 text-[var(--color-button-blue)] rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
                          placeholder="Enter director biography"
                        />
                      ) : (
                        <div className="px-4 py-2 bg-gray-50 dark:bg-[var(--color-card-secondary)] border border-gray-200 dark:border-gray-600 text-[var(--color-button-blue)] rounded-xl min-h-[80px]">
                          {director.bio || 'No biography set'}
                        </div>
                      )}
                    </div>

                    <div className="mt-4">
                      <label className="block text-sm font-medium text-[var(--color-button-blue)] mb-2">
                        Photo
                      </label>
                      {editingId === director.id ? (
                        <div className="flex items-center gap-4">
                          <label className="inline-block cursor-pointer px-4 py-2 bg-[var(--color-button-blue)] text-white rounded-xl text-sm hover:bg-[var(--color-accent)] transition-colors">
                            Upload Photo
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => e.target.files[0] && handleImageUpload(director.id, e.target.files[0])}
                            />
                          </label>
                          {director.image_path && (
                            <img 
                              src={director.image_path} 
                              alt={director.name}
                              className="w-12 h-12 rounded-full object-cover"
                            />
                          )}
                        </div>
                      ) : (
                        <div className="flex items-center gap-4">
                          {director.image_path ? (
                            <img 
                              src={director.image_path} 
                              alt={director.name}
                              className="w-16 h-16 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center text-gray-500 dark:text-gray-400">
                              No Photo
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </section>
  );
};

export default DirectorCommissionerSection;