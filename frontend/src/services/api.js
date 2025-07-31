// API base configuration
const API_BASE_URL = 'http://127.0.0.1:8000/api';

// Generic API service
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

  // Generic CRUD operations
  async get(endpoint) {
    return this.request(endpoint);
  }

  async post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async put(endpoint, data) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async patch(endpoint, data) {
    return this.request(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async delete(endpoint) {
    return this.request(endpoint, {
      method: 'DELETE',
    });
  }
}

// Create API service instance
const apiService = new ApiService();

// Specific API services for different resources
export const companyAPI = {
  getAll: () => apiService.get('/companies/'),
  getById: (id) => apiService.get(`/companies/${id}/`),
  create: (data) => apiService.post('/companies/', data),
  update: (id, data) => apiService.put(`/companies/${id}/`, data),
  delete: (id) => apiService.delete(`/companies/${id}/`),
};

export const userAPI = {
  getAll: () => apiService.get('/users/'),
  getById: (id) => apiService.get(`/users/${id}/`),
  getStaff: () => apiService.get('/users/staff/'),
  getAdmins: () => apiService.get('/users/admins/'),
  create: (data) => apiService.post('/users/', data),
  update: (id, data) => apiService.put(`/users/${id}/`, data),
  delete: (id) => apiService.delete(`/users/${id}/`),
};

export const teamMemberAPI = {
  getAll: () => apiService.get('/team-members/'),
  getById: (id) => apiService.get(`/team-members/${id}/`),
  create: (data) => apiService.post('/team-members/', data),
  update: (id, data) => apiService.put(`/team-members/${id}/`, data),
  delete: (id) => apiService.delete(`/team-members/${id}/`),
};

export const serviceAPI = {
  getAll: () => apiService.get('/services/'),
  getById: (id) => apiService.get(`/services/${id}/`),
  create: (data) => apiService.post('/services/', data),
  update: (id, data) => apiService.put(`/services/${id}/`, data),
  delete: (id) => apiService.delete(`/services/${id}/`),
};

export const homeContentAPI = {
  getAll: () => apiService.get('/home-content/'),
  getById: (id) => apiService.get(`/home-content/${id}/`),
  create: (data) => apiService.post('/home-content/', data),
  update: (id, data) => apiService.put(`/home-content/${id}/`, data),
  delete: (id) => apiService.delete(`/home-content/${id}/`),
};

export const aboutUsAPI = {
  getAll: () => apiService.get('/about-us/'),
  getById: (id) => apiService.get(`/about-us/${id}/`),
  create: (data) => apiService.post('/about-us/', data),
  update: (id, data) => apiService.put(`/about-us/${id}/`, data),
  delete: (id) => apiService.delete(`/about-us/${id}/`),
};

export const contactAPI = {
  getAll: () => apiService.get('/contacts/'),
  getById: (id) => apiService.get(`/contacts/${id}/`),
  create: (data) => apiService.post('/contacts/', data),
  update: (id, data) => apiService.put(`/contacts/${id}/`, data),
  delete: (id) => apiService.delete(`/contacts/${id}/`),
};

export const projectAPI = {
  getAll: () => apiService.get('/projects/'),
  getById: (id) => apiService.get(`/projects/${id}/`),
  getFeatured: () => apiService.get('/projects/featured/'),
  create: (data) => apiService.post('/projects/', data),
  update: (id, data) => apiService.put(`/projects/${id}/`, data),
  delete: (id) => apiService.delete(`/projects/${id}/`),
};

export const testimonialAPI = {
  getAll: () => apiService.get('/testimonials/'),
  getById: (id) => apiService.get(`/testimonials/${id}/`),
  getFeatured: () => apiService.get('/testimonials/featured/'),
  create: (data) => apiService.post('/testimonials/', data),
  update: (id, data) => apiService.put(`/testimonials/${id}/`, data),
  delete: (id) => apiService.delete(`/testimonials/${id}/`),
};

export const clientAPI = {
  getAll: () => apiService.get('/clients/'),
  getById: (id) => apiService.get(`/clients/${id}/`),
  getFeatured: () => apiService.get('/clients/featured/'),
  create: (data) => apiService.post('/clients/', data),
  update: (id, data) => apiService.put(`/clients/${id}/`, data),
  delete: (id) => apiService.delete(`/clients/${id}/`),
};

export const newsAPI = {
  getAll: () => apiService.get('/news/'),
  getById: (id) => apiService.get(`/news/${id}/`),
  getPublished: () => apiService.get('/news/published/'),
  create: (data) => apiService.post('/news/', data),
  update: (id, data) => apiService.put(`/news/${id}/`, data),
  delete: (id) => apiService.delete(`/news/${id}/`),
};

export const mediaAPI = {
  getAll: () => apiService.get('/media/'),
  getById: (id) => apiService.get(`/media/${id}/`),
  create: (data) => apiService.post('/media/', data),
  update: (id, data) => apiService.put(`/media/${id}/`, data),
  delete: (id) => apiService.delete(`/media/${id}/`),
};

export const socialMediaAPI = {
  getAll: () => apiService.get('/social-media/'),
  getById: (id) => apiService.get(`/social-media/${id}/`),
  getActive: () => apiService.get('/social-media/active/'),
  create: (data) => apiService.post('/social-media/', data),
  update: (id, data) => apiService.put(`/social-media/${id}/`, data),
  delete: (id) => apiService.delete(`/social-media/${id}/`),
};

export const settingAPI = {
  getAll: () => apiService.get('/settings/'),
  getById: (id) => apiService.get(`/settings/${id}/`),
  create: (data) => apiService.post('/settings/', data),
  update: (id, data) => apiService.put(`/settings/${id}/`, data),
  delete: (id) => apiService.delete(`/settings/${id}/`),
};

export const categoryAPI = {
  getAll: () => apiService.get('/categories/'),
  getById: (id) => apiService.get(`/categories/${id}/`),
  create: (data) => apiService.post('/categories/', data),
  update: (id, data) => apiService.put(`/categories/${id}/`, data),
  delete: (id) => apiService.delete(`/categories/${id}/`),
};

export const userLogAPI = {
  getAll: () => apiService.get('/user-logs/'),
  getByUserId: (userId) => apiService.get(`/user-logs/?user_id=${userId}`),
  create: (data) => apiService.post('/user-logs/', data),
};

export const contentHistoryAPI = {
  getAll: () => apiService.get('/content-history/'),
  getById: (id) => apiService.get(`/content-history/${id}/`),
};

// Content management API
export const contentAPI = {
  banner: {
    get: () => apiService.get('/content/banner/'),
    save: (data) => apiService.post('/content/banner/', data),
  },
  services: {
    get: () => apiService.get('/content/services/'),
    save: (data) => apiService.post('/content/services/', data),
  },
  about: {
    get: () => apiService.get('/content/about/'),
    save: (data) => apiService.post('/content/about/', data),
  },
};

// Legacy API (for backward compatibility)
export const staffAPI = {
  getList: (page = 1) => apiService.get(`/staff/?page=${page}`),
  getDetail: (id) => apiService.get(`/staff/${id}/`),
  logActivity: (data) => apiService.post('/staff/log-activity/', data),
};

export default apiService;