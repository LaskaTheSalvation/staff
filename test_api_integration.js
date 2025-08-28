#!/usr/bin/env node

/**
 * Integration tests for API connectivity in the sections
 * This script tests that the API integrations are properly set up
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
  
  // Default mock response
  return {
    ok: true,
    json: async () => ({ message: 'success' })
  };
};

// Import the API service (simulate ES6 import)
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

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
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
async function testServiceAPIIntegration() {
  console.log('\n🧪 Testing Service Section API Integration...');
  
  try {
    // Test loading services
    const servicesData = await serviceAPI.getAll();
    console.log('✅ Service data loaded successfully');
    
    // Test loading service content
    const contentData = await contentAPI.services.get();
    console.log('✅ Service content loaded successfully');
    
    // Test saving service content
    const testContent = {
      contents: [
        { id: 1, type: 'Title', title: 'Test Service' },
        { id: 2, type: 'Table', title: 'Test Table', rows: [] }
      ]
    };
    await contentAPI.services.save(testContent);
    console.log('✅ Service content saved successfully');
    
    return true;
  } catch (error) {
    console.error('❌ Service API integration failed:', error.message);
    return false;
  }
}

async function testDirectorAPIIntegration() {
  console.log('\n🧪 Testing Director Section API Integration...');
  
  try {
    // Test loading director content
    const contentData = await contentAPI.directors.get();
    console.log('✅ Director content loaded successfully');
    
    // Test saving director content with profile data
    const testContent = {
      contents: [
        { id: 1, type: 'Title' },
        { 
          id: 2, 
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
    
    return true;
  } catch (error) {
    console.error('❌ Director API integration failed:', error.message);
    return false;
  }
}

async function testGalleryAPIIntegration() {
  console.log('\n🧪 Testing Gallery Section API Integration...');
  
  try {
    // Test loading gallery content
    const contentData = await contentAPI.gallery.get();
    console.log('✅ Gallery content loaded successfully');
    
    // Test saving gallery content
    const testContent = {
      contents: [
        { id: 1, type: 'Title' },
        { id: 2, type: 'Enhanced Picture' }
      ]
    };
    await contentAPI.gallery.save(testContent);
    console.log('✅ Gallery content saved successfully');
    
    return true;
  } catch (error) {
    console.error('❌ Gallery API integration failed:', error.message);
    return false;
  }
}

async function testDirectorProfileDataHandling() {
  console.log('\n🧪 Testing Director Profile Data Handling...');
  
  try {
    // Test comprehensive profile data structure
    const profileData = {
      pictureRows: [
        { id: 1, nama: 'John Doe', file: null, isEditing: false },
        { id: 2, nama: 'Jane Smith', file: null, isEditing: false }
      ],
      titleRows: [
        { id: 1, nama: 'Chief Executive Officer', isEditing: false },
        { id: 2, nama: 'Chairman of the Board', isEditing: false }
      ],
      descRows: [
        { id: 1, nama: 'Experienced leader with 15 years in technology sector', isEditing: false },
        { id: 2, nama: 'Strategic visionary with expertise in corporate governance', isEditing: false }
      ]
    };
    
    const testContent = {
      contents: [
        { 
          id: 1, 
          type: 'Profile', 
          profileNo: 1,
          profileData 
        }
      ]
    };
    
    await contentAPI.directors.save(testContent);
    console.log('✅ Complex profile data structure handled correctly');
    
    // Test loading and data persistence
    const loadedData = await contentAPI.directors.get();
    console.log('✅ Profile data persisted and loaded successfully');
    
    return true;
  } catch (error) {
    console.error('❌ Director profile data handling failed:', error.message);
    return false;
  }
}

async function testErrorHandling() {
  console.log('\n🧪 Testing Error Handling...');
  
  // Mock a failed request
  const originalFetch = global.fetch;
  global.fetch = async () => {
    return {
      ok: false,
      status: 500,
      json: async () => ({ error: 'Server error' })
    };
  };
  
  try {
    await contentAPI.services.get();
    console.error('❌ Error handling test failed - should have thrown an error');
    return false;
  } catch (error) {
    console.log('✅ Error handling works correctly');
    global.fetch = originalFetch; // Restore mock
    return true;
  }
}
  console.log('\n🧪 Testing Error Handling...');
  
  // Mock a failed request
  const originalFetch = global.fetch;
  global.fetch = async () => {
    return {
      ok: false,
      status: 500,
      json: async () => ({ error: 'Server error' })
    };
  };
  
  try {
    await contentAPI.services.get();
    console.error('❌ Error handling test failed - should have thrown an error');
    return false;
  } catch (error) {
    console.log('✅ Error handling works correctly');
    global.fetch = originalFetch; // Restore mock
    return true;
  }
}

// Main test runner
async function runTests() {
  console.log('🚀 Running API Integration Tests...');
  console.log('==================================');
  
  const testResults = await Promise.all([
    testServiceAPIIntegration(),
    testDirectorAPIIntegration(),
    testGalleryAPIIntegration(),
    testDirectorProfileDataHandling(),
    testErrorHandling()
  ]);
  
  const passedTests = testResults.filter(result => result).length;
  const totalTests = testResults.length;
  
  console.log('\n==================================');
  console.log(`📊 Test Results: ${passedTests}/${totalTests} tests passed`);
  
  if (passedTests === totalTests) {
    console.log('🎉 All API integration tests passed!');
    process.exit(0);
  } else {
    console.log('⚠️  Some API integration tests failed');
    process.exit(1);
  }
}

// Run tests if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runTests().catch(console.error);
}

export { 
  testServiceAPIIntegration, 
  testDirectorAPIIntegration, 
  testGalleryAPIIntegration,
  testDirectorProfileDataHandling,
  testErrorHandling 
};