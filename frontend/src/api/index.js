/**
 * API wrapper for calling the FastAPI backend.
 * 
 * This centralizes all API calls so we handle auth tokens,
 * error handling, and base URL in one place.
 */

const API_BASE = 'http://localhost:8000'

// Get the stored token from localStorage
function getToken() {
  return localStorage.getItem('access_token')
}

// Make an API request with proper headers
async function request(endpoint, options = {}) {
  const token = getToken()
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  }
  
  // Add auth header if we have a token
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }
  
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  })
  
  // Parse response
  const data = await response.json().catch(() => null)
  
  if (!response.ok) {
    // Throw error with message from API or default
    throw new Error(data?.detail || `Request failed: ${response.status}`)
  }
  
  return data
}

// Auth API calls
export const auth = {
  // Register a new user
  async register(email, username, password, university) {
    return request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, username, password, university }),
    })
  },
  
  // Login and get access token
  // Note: OAuth2 expects form data, not JSON
  async login(email, password) {
    const formData = new URLSearchParams()
    formData.append('username', email)  // OAuth2 uses "username" field
    formData.append('password', password)
    
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData,
    })
    
    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(data?.detail || 'Login failed')
    }
    
    // Store the token
    localStorage.setItem('access_token', data.access_token)
    
    return data
  },
  
  // Get current user info
  async me() {
    return request('/auth/me')
  },
  
  // Logout (just removes token locally)
  logout() {
    localStorage.removeItem('access_token')
  },
}

// Listings API calls
export const listings = {
  async list(params = {}) {
    const searchParams = new URLSearchParams()

    Object.entries(params).forEach(([key, value]) => {
      if (value === undefined || value === null || value === '') return
      if (Array.isArray(value)) {
        value.forEach((item) => {
          if (item !== undefined && item !== null && item !== '') {
            searchParams.append(key, String(item))
          }
        })
        return
      }
      searchParams.append(key, String(value))
    })

    const query = searchParams.toString()
    return request(`/listings${query ? `?${query}` : ''}`)
  },

  async get(id) {
    return request(`/listings/${id}`)
  },

  async create(payload) {
    return request('/listings', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  },

  async update(id, payload) {
    return request(`/listings/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    })
  },

  async remove(id) {
    return request(`/listings/${id}`, {
      method: 'DELETE',
    })
  },

  async toggleSave(id) {
    return request(`/listings/${id}/save`, {
      method: 'POST',
    })
  },

  async similar(id, limit = 12) {
    return request(`/listings/${id}/similar?limit=${limit}`)
  },

  async mine(params = {}) {
    const searchParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      if (value === undefined || value === null || value === '') return
      searchParams.append(key, String(value))
    })
    const query = searchParams.toString()
    return request(`/listings/mine${query ? `?${query}` : ''}`)
  },

  async markSold(id) {
    return request(`/listings/${id}/mark-sold`, {
      method: 'POST',
    })
  },
}

export default { auth, listings }
