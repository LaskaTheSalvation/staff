// API client for connecting to Django backend
const API_BASE_URL = 'http://127.0.0.1:8000/api';

class APIClient {
  constructor(baseURL = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
      ...options,
    };

    if (config.body && typeof config.body === 'object') {
      config.body = JSON.stringify(config.body);
    }

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

  // Banner Content API
  getBannerContent() {
    return this.request('/banner/public/');
  }

  // Service Content API
  getServiceContent() {
    return this.request('/service/public/');
  }

  // About Us Content API
  getAboutUsContent() {
    return this.request('/aboutus/public/');
  }

  // Journey Content API
  getJourneyContent() {
    return this.request('/journey/public/');
  }

  // Pages API
  getPages() {
    return this.request('/pages/public/');
  }

  getPageByName(name) {
    return this.request(`/pages/by_name/?name=${name}`);
  }

  // Authenticated endpoints (require login)
  createBannerContent(data) {
    return this.request('/banner/', {
      method: 'POST',
      body: data,
    });
  }

  updateBannerContent(id, data) {
    return this.request(`/banner/${id}/`, {
      method: 'PUT',
      body: data,
    });
  }

  deleteBannerContent(id) {
    return this.request(`/banner/${id}/`, {
      method: 'DELETE',
    });
  }

  // File upload helper
  async uploadFile(file, endpoint) {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error(`Upload failed! status: ${response.status}`);
    }
    
    return await response.json();
  }
}

// Export singleton instance
export const apiClient = new APIClient();
export default APIClient;