const API_URL = process.env.NEXT_PUBLIC_HOST || 'http://localhost:8000';

class ApiClient {
  constructor() {
    this.baseURL = API_URL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;

    const config = {
      ...options,
      credentials: 'include', // Important for cookies
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };

    // Remove Content-Type for FormData
    if (options.body instanceof FormData) {
      delete config.headers['Content-Type'];
    }

    try {
      const response = await fetch(url, config);

      // Handle 204 No Content
      if (response.status === 204) {
        return null;
      }

      // Handle errors
      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        const customError = new Error(error.detail || error.message || 'Request failed');
        customError.response = {
          status: response.status,
          data: error,
        };
        throw customError;
      }

      // Parse JSON response
      const data = await response.json();
      return data;
    } catch (error) {
      // Re-throw the error for react-query to handle
      throw error;
    }
  }

  // GET request
  get(endpoint, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;

    return this.request(url, {
      method: 'GET',
    });
  }

  // POST request
  post(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // PUT request
  put(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // PATCH request
  patch(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  // DELETE request
  delete(endpoint) {
    return this.request(endpoint, {
      method: 'DELETE',
    });
  }

  // Upload files
  upload(endpoint, formData) {
    return this.request(endpoint, {
      method: 'POST',
      body: formData,
    });
  }
}

// Create and export a singleton instance
const apiClient = new ApiClient();
export default apiClient;
