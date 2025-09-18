import axios from 'axios';
import { api as apiConfig } from '../config/index';

// Centralized API configuration
const API_BASE = apiConfig.baseURL;

// Create axios instance with default configuration
const api = axios.create({
  baseURL: API_BASE,
  timeout: apiConfig.timeout,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth tokens
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      localStorage.removeItem('adminToken');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

// Portfolio data types
export interface HeroData {
  title: string;
  subtitle: string;
  description: string;
  cvUrl: string;
  socialLinks: {
    github: string;
    linkedin: string;
    email: string;
  };
}

export interface Skill {
  _id?: string;
  icon: string;
  title: string;
  description: string;
}

export interface Project {
  _id?: string;
  title: string;
  description: string;
  technologies: string[];
  frontendUrl: string;
  backendUrl: string;
  liveUrl: string;
  image: string;
  featured: boolean;
  order: number;
}

export interface ContactInfo {
  icon: string;
  title: string;
  value: string;
  href: string;
}

export interface AboutData {
  title: string;
  subtitle: string;
  description: string;
  paragraph1: string;
  paragraph2: string;
  paragraph3: string;
  profileImage: string;
  skills: Skill[];
}

export interface ContactData {
  title: string;
  subtitle: string;
  description: string;
  contactInfo: ContactInfo[];
  responseTime: string;
}

export interface PortfolioData {
  hero: HeroData;
  about: AboutData;
  projects: {
    title: string;
    subtitle: string;
    items: Project[];
  };
  contact: ContactData;
  footer: {
    copyright: string;
    additionalLinks: Array<{ text: string; url: string }>;
  };
}

export interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

// API functions
export const getPortfolioData = async (): Promise<PortfolioData> => {
  try {
    const response = await api.get('/portfolio');
    return response.data.data;
  } catch (error) {
    console.error('Failed to fetch portfolio data:', error);
    throw error;
  }
};

export const submitContact = async (contactData: ContactFormData) => {
  try {
    const response = await api.post('/contact', contactData);
    return response.data;
  } catch (error) {
    console.error('Failed to submit contact form:', error);
    throw error;
  }
};

// Health check
export const checkApiHealth = async () => {
  try {
    const response = await api.get('/health');
    return response.data;
  } catch (error) {
    console.error('API health check failed:', error);
    throw error;
  }
};

export default api; 