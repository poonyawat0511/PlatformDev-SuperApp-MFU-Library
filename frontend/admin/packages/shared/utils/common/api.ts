
interface ApiResponse<T> {
    statusCode: number;
    message: string;
    data: T;
  }


class API {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  // Utility to handle GET requests
  public async GET<T>(endpoint: string): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}/${endpoint}`);
      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }
      const data: ApiResponse<T> = await response.json(); // Use the ApiResponse interface
      return data; // Adjust based on your API structure
    } catch (error) {
      console.error("GET Request Failed:", error);
      throw error;
    }
  }

  // Utility to handle POST requests
  public async POST<T>(endpoint: string, body: object): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}/${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }
      const data: ApiResponse<T> = await response.json(); // Use the ApiResponse interface
      return data; // Adjust based on your API structure
    } catch (error) {
      console.error("POST Request Failed:", error);
      throw error;
    }
  }

  // Utility to handle PATCH requests
  public async PATCH<T>(endpoint: string, body: object): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}/${endpoint}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }
      const data: ApiResponse<T> = await response.json(); // Use the ApiResponse interface
      return data; // Adjust based on your API structure
    } catch (error) {
      console.error("PATCH Request Failed:", error);
      throw error;
    }
  }

  // Utility to handle DELETE requests
  public async DELETE(endpoint: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/${endpoint}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }
    } catch (error) {
      console.error("DELETE Request Failed:", error);
      throw error;
    }
  }
}


export const createAPI = (baseUrl: string) => {
  return new API(baseUrl);
};
