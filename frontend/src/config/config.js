const API_BASE_URL = 'http://localhost:3004'; // Update this to match your backend port

export const config = {
  apiUrl: API_BASE_URL,
  endpoints: {
    images: `${API_BASE_URL}/api/images`,
    galleries: `${API_BASE_URL}/api/galleries`,
    uploads: `${API_BASE_URL}/uploads`
  }
};

export default config;