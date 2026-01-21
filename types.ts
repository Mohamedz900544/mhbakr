
// أدوار المستخدمين
export enum UserRole {
  CLIENT = 'client',
  DOCTOR = 'doctor',
  ADMIN = 'admin'
}

// إعدادات النظام العامة (للوحة تحكم الأدمن)
export interface SystemSettings {
    siteName: string;
    maintenanceMode: boolean;
    allowNewRegistrations: boolean;
    taxRate: number;
    supportEmail: string;
    announcement?: string;
}

// التخصصات الطبية
export enum Specialty {
  SMALL_ANIMALS = 'حيوانات أليفة (قطط وكلاب)',
  LARGE_ANIMALS = 'حيوانات المزرعة',
  POULTRY = 'طيور ودواجن',
  EXOTIC = 'حيوانات نادرة',
  SURGERY = 'جراحة وعمليات',
  DENTAL = 'أسنان',
  GROOMING = 'تجميل وعناية'
}

// واجهة المستخدم العامة (لإدارة النظام)
export interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    phone?: string;
    joinDate: string;
    status: 'active' | 'banned' | 'pending';
}

// واجهة الطبيب
export interface Doctor {
  id: string;
  name: string;
  title: string;
  specialty: Specialty | string;
  bio: string;
  price: number;
  location: string;
  rating: number;
  reviewsCount: number;
  imageUrl: string;
  available: boolean;
  waitingTime: number;
  verified: boolean; // Acts as "Pending" status if false
  images?: string[];
  qualifications?: string[];
  about?: string;
  mapPosition?: { top: string; left: string };
  email?: string; // Link to User login
  phone?: string;
}

// واجهة الحيوان الأليف
export interface Pet {
  id: string;
  name: string;
  type: string;
  breed: string;
  age: string;
  weight: string;
  image: string;
  lastCheckup: string;
  nextVaccine: string;
  nextVaccineName?: string;
  medicalHistory?: { date: string; diagnosis: string; doctor: string }[];
}

// واجهة حيوان للتبني
export interface AdoptionPet {
  id: string;
  name: string;
  type: string;
  breed: string;
  gender: 'male' | 'female';
  age: string;
  location: string;
  image: string;
  story: string;
  vaccinated: boolean;
  ownerName: string;
  status: 'available' | 'adopted' | 'pending';
  phone?: string; // Contact info
}

// واجهة الموعد
export interface Appointment {
  id: string;
  doctorId: string; // Added to link to specific doctor
  doctorName: string;
  doctorSpecialty: string;
  date: string;
  time: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  petName: string;
  location: string;
  clientName?: string;
  type?: 'checkup' | 'emergency' | 'consultation';
  price?: number;
}

// واجهة الطلب
export interface Order {
  id: string;
  date: string;
  status: 'processing' | 'shipped' | 'delivered';
  items: string[];
  total: number;
  address?: string;
  phone?: string;
  paymentMethod?: 'cash' | 'card';
}

// واجهة الروشيتة (E-Prescription)
export interface Prescription {
  id: string;
  doctorName: string;
  patientName: string;
  date: string;
  medications: { name: string; dosage: string; notes?: string }[];
  diagnosis?: string;
  notes?: string;
}

// واجهة المنتج
export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  oldPrice?: number;
  image: string;
  rating: number;
  badge?: string;
  description?: string; // Added description
  images?: string[]; // Added multiple images
}

// عنصر السلة
export interface CartItem extends Product {
  quantity: number;
}

// واجهة المقال
export interface BlogPost {
  id: string;
  title: string;
  category: string;
  image: string;
  summary: string;
  date: string;
  author: string;
  content: string;
}

// واجهة المنتدى (Topics Summary)
export interface ForumTopic {
  id: number | string;
  title: string;
  author: string;
  authorRole?: 'doctor' | 'client' | 'مربي' | 'مربي متميز';
  replies: number;
  views?: number;
  tag: string;
  lastActive: string;
  content?: string;
  likes?: number;
  avatar?: string;
  time?: string;
  isLiked?: boolean;
  comments?: number;
}

// الصفحات
export enum Page {
  LANDING = 'landing',
  LOGIN = 'login',
  SEARCH = 'search',
  DOCTOR_PROFILE = 'doctor_profile',
  SHOP = 'shop',
  PRODUCT_DETAILS = 'product_details', // New Page
  COMMUNITY = 'community',
  CLIENT_DASHBOARD = 'client_dashboard',
  FORUM = 'forum',
  CART = 'cart',
  REWARDS = 'rewards',
  // Doctor Pages
  DOCTOR_DASHBOARD = 'doctor_dashboard',
  DOCTOR_SCHEDULE = 'doctor_schedule',
  DOCTOR_PATIENTS = 'doctor_patients',
  DOCTOR_WALLET = 'doctor_wallet',
  DOCTOR_SETTINGS = 'doctor_settings',
  DOCTOR_SUPPORT = 'doctor_support',
  // Admin Pages
  ADMIN_DASHBOARD = 'admin_dashboard'
}
