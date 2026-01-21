
import {
  MOCK_DOCTORS,
  MOCK_APPOINTMENTS,
  MOCK_PRODUCTS,
  MOCK_BLOGS,
  MOCK_FORUM,
  MOCK_ADOPTION,
} from '../constants';
import { Doctor, Appointment, Product, Order, BlogPost, ForumTopic, AdoptionPet } from '../types';

const API_URL = process.env.VITE_API_URL || 'http://localhost:5000/api';

// Helper to handle fetch with timeout
const fetchWithTimeout = async (resource: string, options: any = {}) => {
    const { timeout = 5000 } = options;
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    try {
        const response = await fetch(resource, {
            ...options,
            signal: controller.signal  
        });
        clearTimeout(id);
        return response;
    } catch (error) {
        clearTimeout(id);
        throw error;
    }
};

export const api = {
    auth: {
        login: async (credentials: any) => {
            try {
                const res = await fetchWithTimeout(`${API_URL}/auth/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(credentials)
                });
                if (!res.ok) throw new Error('Login failed');
                return await res.json();
            } catch (error) {
                console.warn("Backend unavailable, using mock login.");
                return new Promise((resolve) => setTimeout(() => resolve({
                    _id: 'u_' + Date.now(),
                    name: credentials.email.includes('admin') ? 'Admin User' : 'Test User',
                    email: credentials.email,
                    role: credentials.role || 'client',
                    token: 'mock_token'
                }), 800));
            }
        },
        register: async (userData: any) => {
            try {
                const res = await fetchWithTimeout(`${API_URL}/auth/register`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(userData)
                });
                if (!res.ok) throw new Error('Registration failed');
                return await res.json();
            } catch (error) {
                console.warn("Backend unavailable, using mock register.");
                return new Promise((resolve) => setTimeout(() => resolve({
                    ...userData,
                    _id: 'u_' + Date.now(),
                    token: 'mock_token'
                }), 800));
            }
        }
    },
    doctors: {
        getAll: async (): Promise<Doctor[]> => {
            try {
                const res = await fetchWithTimeout(`${API_URL}/doctors`);
                if (!res.ok) throw new Error();
                const data = await res.json();
                return data.map((d: any) => ({
                    ...d,
                    id: d._id || d.id,
                    imageUrl: d.imageUrl || 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=400'
                }));
            } catch (error) {
                return MOCK_DOCTORS;
            }
        }
    },
    appointments: {
        create: async (appointmentData: any) => {
            try {
                const res = await fetchWithTimeout(`${API_URL}/appointments`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(appointmentData)
                });
                if (!res.ok) throw new Error();
                const data = await res.json();
                return { ...data, id: data._id };
            } catch (error) {
                return { ...appointmentData, id: 'apt_' + Date.now() };
            }
        },
        getMy: async (userId: string) => {
            try {
                const res = await fetchWithTimeout(`${API_URL}/appointments/my/${userId}`);
                if (!res.ok) throw new Error();
                const data = await res.json();
                return data.map((a: any) => ({ ...a, id: a._id }));
            } catch (error) {
                return MOCK_APPOINTMENTS;
            }
        }
    },
    shop: {
        getProducts: async (): Promise<Product[]> => {
            try {
                const res = await fetchWithTimeout(`${API_URL}/shop/products`);
                if (!res.ok) throw new Error();
                const data = await res.json();
                return data.map((p: any) => ({ ...p, id: p._id }));
            } catch (error) {
                return MOCK_PRODUCTS;
            }
        },
        createOrder: async (orderData: any) => {
            try {
                const res = await fetchWithTimeout(`${API_URL}/shop/orders`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(orderData)
                });
                if (!res.ok) throw new Error();
                return await res.json();
            } catch (error) {
                return { ...orderData, id: 'ord_' + Date.now() };
            }
        }
    },
    content: {
        getBlogs: async (): Promise<BlogPost[]> => {
            try {
                const res = await fetchWithTimeout(`${API_URL}/content/blogs`);
                if (!res.ok) throw new Error();
                const data = await res.json();
                return data.map((b: any) => ({ ...b, id: b._id }));
            } catch (error) { return MOCK_BLOGS; }
        },
        getForum: async (): Promise<ForumTopic[]> => {
            try {
                const res = await fetchWithTimeout(`${API_URL}/content/forum`);
                if (!res.ok) throw new Error();
                const data = await res.json();
                return data.map((t: any) => ({ ...t, id: t._id }));
            } catch (error) { return MOCK_FORUM; }
        },
        getAdoption: async (): Promise<AdoptionPet[]> => {
            try {
                const res = await fetchWithTimeout(`${API_URL}/content/adoption`);
                if (!res.ok) throw new Error();
                const data = await res.json();
                return data.map((p: any) => ({ ...p, id: p._id }));
            } catch (error) { return MOCK_ADOPTION; }
        },
        createPost: async (type: 'blogs'|'forum'|'adoption', data: any) => {
            try {
                const res = await fetchWithTimeout(`${API_URL}/content/${type}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
                if (!res.ok) throw new Error();
                return await res.json();
            } catch (error) { return { ...data, id: Date.now().toString() }; }
        }
    }
};
