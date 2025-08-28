// Utility functions for content management

/**
 * Create a debounced function that delays invoking func until after wait milliseconds
 * have elapsed since the last time the debounced function was invoked.
 * @param {Function} func - The function to debounce
 * @param {number} wait - The number of milliseconds to delay
 * @returns {Function} - The debounced function
 */
export const useDebounce = (func, wait = 800) => {
  let timeout;
  
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
};

/**
 * Migrate localStorage data to backend API
 * @param {string} storageKey - The localStorage key to migrate
 * @param {Function} transformFn - Function to transform localStorage data to API format
 * @param {Function} saveFn - Function to save data to API
 * @returns {Promise<boolean>} - Returns true if migration was successful
 */
export const migrateLocalStorageData = async (storageKey, transformFn, saveFn) => {
  try {
    const saved = localStorage.getItem(storageKey);
    if (!saved) {
      return false; // No data to migrate
    }

    const parsedData = JSON.parse(saved);
    if (!parsedData || (Array.isArray(parsedData) && parsedData.length === 0)) {
      // Clean up empty data
      localStorage.removeItem(storageKey);
      return false;
    }

    // Transform the data to API format
    const transformedData = await transformFn(parsedData);
    
    // Save to API
    await saveFn(transformedData);
    
    // Clean up localStorage after successful migration
    localStorage.removeItem(storageKey);
    
    console.log(`Successfully migrated ${storageKey} to backend`);
    return true;
  } catch (error) {
    console.warn(`Failed to migrate ${storageKey}:`, error);
    return false;
  }
};

/**
 * Get company ID from context or URL - placeholder for now
 * In a real app, this would come from user context or route params
 * @returns {number|null} - Company ID
 */
export const getCurrentCompanyId = () => {
  // For now, return 1 as default company ID
  // This should be replaced with proper company context
  return 1;
};

/**
 * Create a save status manager for UI feedback
 * @returns {Object} - Object with status management methods
 */
export const createSaveStatusManager = () => {
  let statusCallbacks = [];
  
  return {
    onStatusChange: (callback) => {
      statusCallbacks.push(callback);
    },
    
    setSaving: () => {
      statusCallbacks.forEach(cb => cb('saving'));
    },
    
    setSaved: () => {
      statusCallbacks.forEach(cb => cb('saved'));
      // Auto-clear saved status after 2 seconds
      setTimeout(() => {
        statusCallbacks.forEach(cb => cb('idle'));
      }, 2000);
    },
    
    setError: (error) => {
      statusCallbacks.forEach(cb => cb('error', error));
    }
  };
};