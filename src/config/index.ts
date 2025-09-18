export const config = {
  // API Configuration
  api: {
    baseURL: process.env.REACT_APP_API_URL,
    timeout: 10000,
  },

  // Application Configuration
  app: {
    title: process.env.REACT_APP_TITLE,
    description: process.env.REACT_APP_DESCRIPTION,
    version: '1.0.0',
  },

  // Analytics Configuration
  analytics: {
    googleAnalyticsId: process.env.REACT_APP_GA_TRACKING_ID,
  },

  // Contact Configuration
  contact: {
    email: process.env.REACT_APP_CONTACT_EMAIL,
  },

  // Environment
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
};

// Export individual config sections for convenience
export const { api, app, analytics, contact, isDevelopment, isProduction } = config;

export default config;
