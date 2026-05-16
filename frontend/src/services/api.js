import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authService = {
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },
  register: async (name, email, password) => {
    const response = await api.post('/auth/register', { name, email, password });
    return response.data;
  },
  googleLogin: async (credential) => {
    const response = await api.post('/auth/google', { credential });
    return response.data;
  },
  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
  updateProfile: async (data) => {
    const response = await api.put('/auth/me', data);
    return response.data;
  },
  deleteAccount: async () => {
    const response = await api.delete('/auth/me');
    return response.data;
  },
};

export const notesService = {
  getAllNotes: async () => {
    const response = await api.get('/notes');
    return response.data;
  },
  getNoteById: async (id) => {
    const response = await api.get(`/notes/${id}`);
    return response.data;
  },
  createNote: async (noteData) => {
    const response = await api.post('/notes', noteData);
    return response.data;
  },
  updateNote: async (id, noteData) => {
    const response = await api.put(`/notes/${id}`, noteData);
    return response.data;
  },
  deleteNote: async (id) => {
    const response = await api.delete(`/notes/${id}`);
    return response.data;
  },
};

export const notebooksService = {
  getAllNotebooks: async () => {
    const response = await api.get('/notebooks');
    return response.data;
  },
  getNotebookById: async (id) => {
    const response = await api.get(`/notebooks/${id}`);
    return response.data;
  },
  createNotebook: async (name) => {
    const response = await api.post('/notebooks', { name });
    return response.data;
  },
  updateNotebook: async (id, name) => {
    const response = await api.put(`/notebooks/${id}`, { name });
    return response.data;
  },
  deleteNotebook: async (id) => {
    const response = await api.delete(`/notebooks/${id}`);
    return response.data;
  },
};

export default api;
