// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://uatapi.nuqigold.com";

// API Endpoints
export const API_ENDPOINTS = {
  // Splash Screen endpoints
  SPLASH_SCREENS: {
    GET_ALL: `${API_BASE_URL}/screen/splashscreen`,
    GET_BY_ID: (id) => `${API_BASE_URL}/screen/splashscreen/${id}`,
    CREATE: `${API_BASE_URL}/screen/splashscreen`,
    UPDATE: (id) => `${API_BASE_URL}/screen/splashscreen/${id}`,
    DELETE: (id) => `${API_BASE_URL}/screen/splashscreen/${id}`,
  },

  // Popup endpoints
  POPUPS: {
    GET_ALL: `${API_BASE_URL}/screen/popup`,
    GET_BY_ID: (id) => `${API_BASE_URL}/screen/popup/${id}`,
    CREATE: `${API_BASE_URL}/screen/popup`,
    UPDATE: (id) => `${API_BASE_URL}/screen/popup/${id}`,
    DELETE: (id) => `${API_BASE_URL}/screen/popup/${id}`,
  },
};

export default API_BASE_URL;
