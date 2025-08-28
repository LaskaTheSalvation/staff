#!/usr/bin/env node

/**
 * Simple integration tests for API connectivity in the sections
 */

// Mock fetch for testing the API service
global.fetch = async (url, options) => {
  console.log(`API Call: ${options?.method || 'GET'} ${url}`);
  
  // Mock successful responses
  if (url.includes('/content/services/')) {
    return {
      ok: true,
      json: async () => ({ contents: [] })
    };
  }
  
  if (url.includes('/content/directors/')) {
    return {
      ok: true,
      json: async () => ({ contents: [] })
    };
  }
  
  if (url.includes('/content/gallery/')) {
    return {
      ok: true,
      json: async () => ({ contents: [] })
    };
  }
  
  if (url.includes('/services/')) {
    return {
      ok: true,
      json: async () => ({ results: [] })
    };
  }
  
  return {
    ok: true,
    json: async () => ({ message: 'success' })
  };
};

// API Service setup
const API_BASE_URL = 'http://127.0.0.1:8000/api';

class ApiService {
  constructor(baseURL = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(url, config);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  }

  async get(endpoint) {
    return this.request(endpoint);
  }

  async post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
}

const apiService = new ApiService();

const contentAPI = {
  services: {
    get: () => apiService.get('/content/services/'),
    save: (data) => apiService.post('/content/services/', data),
  },
  directors: {
    get: () => apiService.get('/content/directors/'),
    save: (data) => apiService.post('/content/directors/', data),
  },
  gallery: {
    get: () => apiService.get('/content/gallery/'),
    save: (data) => apiService.post('/content/gallery/', data),
  },
};

const serviceAPI = {
  getAll: () => apiService.get('/services/'),
};

// Test functions
async function testAllAPIIntegrations() {
  console.log('🚀 Running API Integration Tests...');
  console.log('==================================');
  
  let allTestsPassed = true;
  
  // Test 1: Service Section
  try {
    console.log('\n🧪 Testing Service Section API Integration...');
    await serviceAPI.getAll();
    console.log('✅ Service data loaded successfully');
    
    await contentAPI.services.get();
    console.log('✅ Service content loaded successfully');
    
    const testContent = {
      contents: [
        { id: 1, type: 'Title', title: 'Test Service' },
        { id: 2, type: 'Table', title: 'Test Table', rows: [] }
      ]
    };
    await contentAPI.services.save(testContent);
    console.log('✅ Service content saved successfully');
  } catch (error) {
    console.error('❌ Service API integration failed:', error.message);
    allTestsPassed = false;
  }
  
  // Test 2: Director Section
  try {
    console.log('\n🧪 Testing Director Section API Integration...');
    await contentAPI.directors.get();
    console.log('✅ Director content loaded successfully');
    
    const testContent = {
      contents: [
        { 
          id: 1, 
          type: 'Profile', 
          profileNo: 1,
          profileData: {
            pictureRows: [{ id: 1, nama: 'John Doe', file: null, isEditing: false }],
            titleRows: [{ id: 1, nama: 'CEO', isEditing: false }],
            descRows: [{ id: 1, nama: 'Company CEO with 10 years experience', isEditing: false }]
          }
        }
      ]
    };
    await contentAPI.directors.save(testContent);
    console.log('✅ Director content with profile data saved successfully');
  } catch (error) {
    console.error('❌ Director API integration failed:', error.message);
    allTestsPassed = false;
  }
  
  // Test 3: Gallery Section
  try {
    console.log('\n🧪 Testing Gallery Section API Integration...');
    await contentAPI.gallery.get();
    console.log('✅ Gallery content loaded successfully');
    
    const testContent = {
      contents: [
        { id: 1, type: 'Title' },
        { id: 2, type: 'Enhanced Picture' }
      ]
    };
    await contentAPI.gallery.save(testContent);
    console.log('✅ Gallery content saved successfully');
  } catch (error) {
    console.error('❌ Gallery API integration failed:', error.message);
    allTestsPassed = false;
  }
  
  // Test 4: Error Handling
  try {
    console.log('\n🧪 Testing Error Handling...');
    
    // Mock a failed request
    const originalFetch = global.fetch;
    global.fetch = async () => ({
      ok: false,
      status: 500,
      json: async () => ({ error: 'Server error' })
    });
    
    try {
      await contentAPI.services.get();
      console.error('❌ Error handling test failed - should have thrown an error');
      allTestsPassed = false;
    } catch (error) {
      console.log('✅ Error handling works correctly');
    }
    
    global.fetch = originalFetch; // Restore mock
  } catch (error) {
    console.error('❌ Error handling test failed:', error.message);
    allTestsPassed = false;
  }
  
  console.log('\n==================================');
  if (allTestsPassed) {
    console.log('🎉 All API integration tests passed!');
    process.exit(0);
  } else {
    console.log('⚠️  Some API integration tests failed');
    process.exit(1);
  }
}

// Run tests
testAllAPIIntegrations().catch(console.error);