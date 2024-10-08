// api.ts
import { ApiService } from './apiServiceTypes';
import API_URLS from './apiEndpoints';

interface ApiResponse<T> {
  data: T;
  status: number;
}

// Fallback URL if the service type is not found
const DEFAULT_URL = 'http://localhost:8080';

export async function $API<T>(
  service: ApiService,
  endpoint: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
  body?: any,
  headers: Record<string, string> = {}
): Promise<ApiResponse<T>> {
  const baseUrl = API_URLS[service] || DEFAULT_URL;

  try {
    const response = await fetch(`${baseUrl}${endpoint}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Something went wrong');
    }

    const data = await response.json();
    return {
      data,
      status: response.status,
    };
  } catch (error) {
    console.error('API request error:', error);
    throw error;
  }
}
