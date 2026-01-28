import { config } from '../config';

const API_BASE_URL = config.API_URL;

class ApiService {
  private token: string | null = null;

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    return this.token || localStorage.getItem('token');
  }

  removeToken() {
    this.token = null;
    localStorage.removeItem('token');
  }

  private async request(endpoint: string, options: RequestInit = {}): Promise<any> {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (this.getToken()) {
      headers.Authorization = `Bearer ${this.getToken()}`;
    }

    try {
      console.log(`[API] Making request to: ${url}`);
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Error desconocido' }));
        throw new Error(error.message || `HTTP error! status: ${response.status}`);
      }

      return response.json();
    } catch (error: any) {
      // Manejar errores de red (Failed to fetch)
      if (error.message === 'Failed to fetch' || error.name === 'TypeError' || error.message?.includes('fetch')) {
        const backendUrl = API_BASE_URL.replace('/api', '');
        console.error(`[API] Connection error to ${backendUrl}${endpoint}:`, error);
        throw new Error(
          `No se pudo conectar con el servidor en ${backendUrl}. Verifica que el backend esté corriendo y que CORS esté configurado correctamente.`
        );
      }
      console.error(`[API] Error:`, error);
      throw error;
    }
  }

  // Auth endpoints
  async login(username: string, password: string) {
    const data = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
    if (data.token) {
      this.setToken(data.token);
    }
    return data;
  }

  async verifyToken() {
    return this.request('/auth/verify');
  }

  // Event endpoints
  async getEvent() {
    return this.request('/events');
  }

  async createEvent(eventData: any) {
    return this.request('/events', {
      method: 'POST',
      body: JSON.stringify(eventData),
    });
  }

  async updateEvent(id: string, eventData: any) {
    return this.request(`/events/${id}`, {
      method: 'PUT',
      body: JSON.stringify(eventData),
    });
  }

  // Gift endpoints
  async getGifts(params?: {
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    sortBy?: string;
  }) {
    const queryParams = new URLSearchParams();
    if (params?.category) queryParams.append('category', params.category);
    if (params?.minPrice) queryParams.append('minPrice', params.minPrice.toString());
    if (params?.maxPrice) queryParams.append('maxPrice', params.maxPrice.toString());
    if (params?.sortBy) queryParams.append('sortBy', params.sortBy);

    const query = queryParams.toString();
    return this.request(`/gifts${query ? `?${query}` : ''}`);
  }

  async getGift(id: string) {
    return this.request(`/gifts/${id}`);
  }

  async contributeToGift(id: string, amount: number) {
    return this.request(`/gifts/${id}/contribute`, {
      method: 'POST',
      body: JSON.stringify({ amount }),
    });
  }

  async createGift(giftData: any) {
    return this.request('/gifts', {
      method: 'POST',
      body: JSON.stringify(giftData),
    });
  }

  async updateGift(id: string, giftData: any) {
    return this.request(`/gifts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(giftData),
    });
  }

  async deleteGift(id: string) {
    return this.request(`/gifts/${id}`, {
      method: 'DELETE',
    });
  }

      // Payment endpoints
      async confirmPayment(giftIds: string[], paymentMethod?: string, paymentReference?: string, amounts?: number[]) {
        return this.request('/payments/confirm', {
          method: 'POST',
          body: JSON.stringify({ giftIds, paymentMethod, paymentReference, amounts }),
        });
      }

      // Report endpoints
      async getContributionsReport() {
        return this.request('/reports/contributions');
      }

      async getSummaryReport() {
        return this.request('/reports/summary');
      }
    }

    export const apiService = new ApiService();
