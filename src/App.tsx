
import React, { useState, useEffect, Suspense, lazy } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Notification, { NotificationType } from '../components/Notification';
import VetBot from '../components/VetBot';
import CartDrawer from '../components/CartDrawer';
import LoginModal from './components/LoginModal';
import SplashScreen from '../components/SplashScreen';
import { Page, Doctor, Product, CartItem, UserRole, Appointment, Order, Prescription, User, SystemSettings, BlogPost, ForumTopic, AdoptionPet } from './types';
import { MOCK_APPOINTMENTS } from '../constants'; 
import { ArrowUp, ShoppingBag, Loader2 } from 'lucide-react';
import { Language } from './lib/translations';
import { api } from './services/api';

// Lazy Load Pages for Performance
const LandingPage = lazy(() => import('../pages/LandingPage'));
const SearchPage = lazy(() => import('../pages/SearchPage'));
const DoctorProfilePage = lazy(() => import('../pages/DoctorProfilePage'));
const ShopPage = lazy(() => import('../pages/ShopPage'));
const ProductDetailsPage = lazy(() => import('../pages/ProductDetailsPage'));
const CommunityPage = lazy(() => import('../pages/CommunityPage'));
const ClientDashboard = lazy(() => import('../pages/ClientDashboard'));
const DoctorDashboard = lazy(() => import('./pages/DoctorDashboard'));
const AdminDashboard = lazy(() => import('../pages/AdminDashboard')); 
const ForumPage = lazy(() => import('../pages/ForumPage'));
const RewardsPage = lazy(() => import('../pages/RewardsPage'));

interface NotificationState {
  message: string;
  type: NotificationType;
}

const App: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState<Page>(Page.LANDING);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [notification, setNotification] = useState<NotificationState | null>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  
  // Language with Persistence and Strict Validation
  // FINAL FIX: This prevents the "Uncaught TypeError" by ensuring language is ALWAYS valid.
  const [language, setLanguage] = useState<Language>(() => {
      const saved = localStorage.getItem('language');
      // Only accept 'ar' or 'en'. If anything else (null, undefined, garbage), force 'ar'.
      return (saved === 'ar' || saved === 'en') ? saved : 'ar';
  });

  // App Data - Centralized State
  const [allDoctors, setAllDoctors] = useState<Doctor[]>([]);
  const [users, setUsers] = useState<User[]>([{ id: 'u1', name: 'Super Admin', email: 'admin@vetcare.com', role: UserRole.ADMIN, joinDate: '2023-01-01', status: 'active' }]);
  const [storeProducts, setStoreProducts] = useState<Product[]>([]);
  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [forumTopics, setForumTopics] = useState<ForumTopic[]>([]);
  const [adoptionPets, setAdoptionPets] = useState<AdoptionPet[]>([]);
  const [allAppointments, setAllAppointments] = useState<Appointment[]>(MOCK_APPOINTMENTS); // Shared State for Interconnectivity

  // Auth State
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentDoctorProfile, setCurrentDoctorProfile] = useState<Doctor | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginModalPreSelectedRole, setLoginModalPreSelectedRole] = useState<UserRole | null>(null);
  const [loginModalMode, setLoginModalMode] = useState<'login' | 'register'>('login');
  
  // UI State
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [searchFilters, setSearchFilters] = useState({ specialty: '', city: '' });
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  // User Specific Data (derived from shared state ideally, but here separated for simulation)
  const [userOrders, setUserOrders] = useState<Order[]>([]); 
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [doctorRequests, setDoctorRequests] = useState<Appointment[]>([]);
  
  const [systemSettings, setSystemSettings] = useState<SystemSettings>({
      siteName: 'البيطار',
      maintenanceMode: false,
      allowNewRegistrations: true,
      taxRate: 14,
      supportEmail: 'support@vetcare.com',
      announcement: ''
  });

  // Persist Language
  useEffect(() => {
      localStorage.setItem('language', language);
      document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.lang = language;
  }, [language]);

  useEffect(() => {
    // Initial Fetch
    const fetchData = async () => {
        try {
            const [docs, prods, blogs, forum, pets] = await Promise.all([
                api.doctors.getAll(),
                api.shop.getProducts(),
                api.content.getBlogs(),
                api.content.getForum(),
                api.content.getAdoption()
            ]);
            setAllDoctors(docs);
            setStoreProducts(prods);
            setBlogPosts(blogs);
            setForumTopics(forum);
            setAdoptionPets(pets);
        } catch (e) { console.error("Initial fetch failed", e); }
    };
    fetchData();

    // Theme Init
    const savedTheme = localStorage.getItem('theme');
    const isDark = savedTheme === 'dark';
    setIsDarkMode(isDark);
    if (isDark) document.documentElement.classList.add('dark');
    
    // Scroll Listener
    const handleScroll = () => setShowScrollTop(window.scrollY > 300);
    window.addEventListener('scroll', handleScroll);

    // Browser Back Button Support
    const handlePopState = (event: PopStateEvent) => {
        if (event.state && event.state.page) {
            setCurrentPage(event.state.page);
        } else {
            setCurrentPage(Page.LANDING);
        }
    };
    window.addEventListener('popstate', handlePopState);

    // Push initial state
    window.history.replaceState({ page: Page.LANDING }, '', '');

    return () => {
        window.removeEventListener('scroll', handleScroll);
        window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  const toggleTheme = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem('theme', newMode ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark');
  };

  const showNotification = (message: string, type: NotificationType = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleAuth = (userData: any) => {
      const newUser: User = {
          id: userData._id || `u_${Date.now()}`,
          name: userData.name,
          email: userData.email,
          role: userData.role,
          joinDate: new Date().toLocaleDateString('en-CA'),
          status: 'active'
      };

      if (userData.role === UserRole.DOCTOR) {
          const docProfile = allDoctors.find(d => d.email === userData.email) || {
              id: newUser.id,
              name: userData.name,
              title: 'طبيب بيطري',
              specialty: userData.specialty || 'عام',
              bio: 'طبيب جديد',
              price: 200,
              location: userData.location || 'القاهرة',
              rating: 0,
              reviewsCount: 0,
              imageUrl: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=400',
              available: true,
              verified: !userData.isRegister, 
              waitingTime: 15,
              email: userData.email // Link for login mapping
          } as Doctor;
          setCurrentDoctorProfile(docProfile);
          // If newly registered doctor, add to list (pending verification)
          if (!allDoctors.find(d => d.email === userData.email)) {
              setAllDoctors(prev => [...prev, docProfile]);
          }
      }

      setIsLoggedIn(true);
      setCurrentUser(newUser);
      setShowLoginModal(false);
      showNotification(userData.isRegister ? 'تم إنشاء الحساب بنجاح' : `مرحباً بعودتك: ${userData.name}`, 'success');

      if (userData.role === UserRole.ADMIN) handlePageChange(Page.ADMIN_DASHBOARD);
      else if (userData.role === UserRole.DOCTOR) handlePageChange(Page.DOCTOR_DASHBOARD);
      else if (![Page.DOCTOR_PROFILE, Page.PRODUCT_DETAILS, Page.CART, Page.SHOP].includes(currentPage)) {
          handlePageChange(Page.CLIENT_DASHBOARD);
      }
  };

  const handleBookAppointment = async (appt: Appointment) => {
      // Add to Central State immediately so UI updates
      setAllAppointments(prev => [appt, ...prev]);
      try {
          // In real app, this would be an API call
          await api.appointments.create(appt);
          showNotification(language === 'ar' ? 'تم الحجز بنجاح' : 'Booking Successful', 'success');
      } catch (err) { 
          showNotification('Error creating appointment', 'error'); 
      }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    setCurrentDoctorProfile(null);
    handlePageChange(Page.LANDING);
    showNotification(language === 'ar' ? 'تم تسجيل الخروج' : 'Logged out', 'info');
  };

  const handlePageChange = (page: Page) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setCurrentPage(page);
    window.history.pushState({ page }, '', `?page=${page}`);
  };

  // Cart Logic
  const addToCart = (product: Product) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      return [...prev, { ...product, quantity: 1 }];
    });
    showNotification('تمت الإضافة للسلة', 'success');
  };
  const removeFromCart = (id: string) => setCartItems(prev => prev.filter(item => item.id !== id));
  const updateQuantity = (id: string, delta: number) => {
    setCartItems(prev => prev.map(item => item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item));
  };
  const clearCart = () => setCartItems([]);
  const handleAddOrder = async (order: Order) => {
      setUserOrders(prev => [order, ...prev]);
      setAllOrders(prev => [order, ...prev]);
      await api.shop.createOrder(order);
      showNotification('تم تأكيد الطلب بنجاح', 'success');
  };

  const PageLoader = () => (
      <div className="flex h-[50vh] items-center justify-center">
          <Loader2 className="animate-spin text-emerald-500 w-12 h-12" />
      </div>
  );

  if (currentPage === Page.ADMIN_DASHBOARD) {
      return (
          <Suspense fallback={<PageLoader />}>
            {notification && <Notification message={notification.message} type={notification.type} onClose={() => setNotification(null)} />}
            <AdminDashboard 
                setPage={handlePageChange}
                users={users}
                doctors={allDoctors}
                settings={systemSettings}
                products={storeProducts}
                orders={allOrders}
                blogs={blogPosts}
                forumTopics={forumTopics}
                adoptionPets={adoptionPets}
                onUpdateSettings={setSystemSettings}
                onVerifyDoctor={(id) => { setAllDoctors(prev => prev.map(d => d.id === id ? { ...d, verified: true } : d)); showNotification('تم التفعيل', 'success'); }}
                onDeleteDoctor={(id) => setAllDoctors(prev => prev.filter(d => d.id !== id))}
                onBanUser={(id) => setUsers(prev => prev.map(u => u.id === id ? { ...u, status: 'banned' } : u))}
                onAddProduct={(p) => setStoreProducts(prev => [p, ...prev])}
                onDeleteProduct={(id) => setStoreProducts(prev => prev.filter(p => p.id !== id))}
                onUpdateOrderStatus={(id, st) => setAllOrders(prev => prev.map(o => o.id === id ? {...o, status: st as any} : o))}
                onAddBlogPost={(p) => setBlogPosts(prev => [p, ...prev])}
                onEditBlogPost={(p) => setBlogPosts(prev => prev.map(post => post.id === p.id ? p : post))}
                onDeleteBlogPost={(id) => setBlogPosts(prev => prev.filter(p => p.id !== id))}
                onDeleteForumTopic={(id) => setForumTopics(prev => prev.filter(t => t.id !== id))}
                onDeleteAdoption={(id) => setAdoptionPets(prev => prev.filter(p => p.id !== id))}
                onLogout={handleLogout}
                language={language}
            />
          </Suspense>
      );
  }

  return (
    <div className={`min-h-screen bg-[#f8fafc] dark:bg-[#020617] text-slate-900 dark:text-slate-100 transition-colors duration-300 selection:bg-emerald-500 selection:text-white flex flex-col`} dir={language === 'ar' ? 'rtl' : 'ltr'}>
      
      {loading && <SplashScreen onFinish={() => setLoading(false)} />}

      <Navbar 
        setPage={handlePageChange} 
        currentPage={currentPage} 
        isLoggedIn={isLoggedIn}
        userRole={currentUser?.role || null}
        onLoginClick={() => { setLoginModalPreSelectedRole(null); setLoginModalMode('login'); setShowLoginModal(true); }}
        onProfileClick={() => handlePageChange(currentUser?.role === UserRole.DOCTOR ? Page.DOCTOR_DASHBOARD : currentUser?.role === UserRole.ADMIN ? Page.ADMIN_DASHBOARD : Page.CLIENT_DASHBOARD)}
        onLogout={handleLogout}
        cartCount={cartItems.reduce((acc, item) => acc + item.quantity, 0)}
        onCartClick={() => setIsCartOpen(true)}
        isDarkMode={isDarkMode}
        toggleTheme={toggleTheme}
        language={language}
        setLanguage={setLanguage}
      />
      
      {notification && <Notification message={notification.message} type={notification.type} onClose={() => setNotification(null)} />}

      <VetBot userRole={currentUser?.role || null} language={language} />
      
      {cartItems.length > 0 && currentUser?.role !== UserRole.DOCTOR && currentPage !== Page.SHOP && currentPage !== Page.PRODUCT_DETAILS && (
          <div onClick={() => setIsCartOpen(true)} className={`fixed bottom-24 ${language === 'ar' ? 'left-6' : 'right-6'} z-[80] bg-slate-900 dark:bg-emerald-600 text-white p-4 rounded-full shadow-2xl animate-fade-in flex items-center gap-3 cursor-pointer hover:scale-110 transition-transform border-4 border-white dark:border-slate-900 group`}>
              <div className="relative">
                  <ShoppingBag size={24} className="group-hover:animate-bounce" />
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-slate-900">{cartItems.reduce((acc, item) => acc + item.quantity, 0)}</span>
              </div>
          </div>
      )}

      {currentUser?.role !== UserRole.DOCTOR && (
        <CartDrawer 
          isOpen={isCartOpen} 
          onClose={() => setIsCartOpen(false)} 
          items={cartItems} 
          onRemove={removeFromCart} 
          onUpdateQuantity={updateQuantity} 
          onClearCart={clearCart} 
          onAddOrder={handleAddOrder}
        />
      )}

      {showLoginModal && (
        <LoginModal 
            key={loginModalPreSelectedRole ? `forced-${loginModalPreSelectedRole}-${loginModalMode}` : 'choice'} 
            onClose={() => setShowLoginModal(false)} 
            onLogin={handleAuth} 
            initialRole={loginModalPreSelectedRole}
            initialMode={loginModalMode}
            language={language}
        />
      )}

      <main className="flex-1 relative z-10">
        <Suspense fallback={<PageLoader />}>
            {(() => {
                // DOCTOR DASHBOARD ROUTING
                if (isLoggedIn && currentUser?.role === UserRole.DOCTOR && currentPage.startsWith('doctor_')) {
                    let tab: any = 'overview';
                    if (currentPage === Page.DOCTOR_SCHEDULE) tab = 'schedule';
                    if (currentPage === Page.DOCTOR_PATIENTS) tab = 'patients';
                    if (currentPage === Page.DOCTOR_WALLET) tab = 'financial';
                    
                    // Interconnectivity: Filter global appointments for this doctor
                    const myAppointments = allAppointments.filter(app => app.doctorId === currentDoctorProfile?.id);

                    return (
                        <DoctorDashboard 
                            setPage={handlePageChange} 
                            initialTab={tab} 
                            doctorProfile={currentDoctorProfile!} 
                            requests={doctorRequests}
                            appointments={myAppointments}
                            onAction={(id, action) => {
                                // Interconnectivity: Update global state so client sees the change
                                setAllAppointments(prev => prev.map(app => app.id === id ? { ...app, status: action === 'accept' ? 'completed' : 'cancelled' } : app));
                                showNotification(action === 'accept' ? (language === 'ar' ? 'تم إنهاء الموعد' : 'Appointment Completed') : (language === 'ar' ? 'تم الرفض' : 'Appointment Rejected'), action === 'accept' ? 'success' : 'info');
                            }}
                            onAddPrescription={(rx) => setPrescriptions(prev => [rx, ...prev])}
                            onUpdateProfile={(updated) => { 
                                // 1. Update list of all doctors
                                setAllDoctors(prev => prev.map(d => d.id === updated.id ? updated : d)); 
                                // 2. Update current logged-in profile
                                setCurrentDoctorProfile(updated);
                                // 3. Update view profile if looking at self (fixes Immediate Reflection issue)
                                if (selectedDoctor?.id === updated.id) {
                                    setSelectedDoctor(updated);
                                }
                                showNotification('تم الحفظ', 'success'); 
                            }}
                            language={language}
                        />
                    );
                }

                switch (currentPage) {
                    case Page.LANDING:
                        return <LandingPage setPage={handlePageChange} doctors={allDoctors} onSelectDoctor={(d) => { setSelectedDoctor(d); handlePageChange(Page.DOCTOR_PROFILE); }} onSearch={(f) => { setSearchFilters(f); handlePageChange(Page.SEARCH); }} onJoinDoctor={() => {setLoginModalPreSelectedRole(UserRole.DOCTOR); setLoginModalMode('register'); setShowLoginModal(true);}} language={language}/>;
                    case Page.SEARCH:
                        return <SearchPage setPage={handlePageChange} initialFilters={searchFilters} doctors={allDoctors} onSelectDoctor={(d) => { setSelectedDoctor(d); handlePageChange(Page.DOCTOR_PROFILE); }} language={language} />;
                    case Page.DOCTOR_PROFILE:
                        return <DoctorProfilePage doctor={selectedDoctor} setPage={handlePageChange} isLoggedIn={isLoggedIn} onLoginReq={() => {setLoginModalPreSelectedRole(UserRole.CLIENT); setLoginModalMode('login'); setShowLoginModal(true);}} onBookAppointment={handleBookAppointment} language={language}/>;
                    case Page.SHOP:
                        return <ShopPage setPage={handlePageChange} products={storeProducts} onAddToCart={addToCart} onOpenCart={() => setIsCartOpen(true)} cartCount={cartItems.reduce((a, b) => a + b.quantity, 0)} onProductClick={(p) => { setSelectedProduct(p); handlePageChange(Page.PRODUCT_DETAILS); }} language={language} />;
                    case Page.PRODUCT_DETAILS:
                        return <ProductDetailsPage product={selectedProduct} setPage={handlePageChange} onAddToCart={addToCart} allProducts={storeProducts} onProductClick={(p) => { setSelectedProduct(p); handlePageChange(Page.PRODUCT_DETAILS); }} language={language} />;
                    case Page.COMMUNITY:
                        return <CommunityPage setPage={handlePageChange} blogs={blogPosts} forumTopics={forumTopics} adoptionPets={adoptionPets} onAddAdoption={(pet) => { setAdoptionPets(prev => [pet, ...prev]); api.content.createPost('adoption', pet); showNotification('تم إرسال طلب التبني', 'success'); }} language={language} />;
                    case Page.CLIENT_DASHBOARD:
                        // Interconnectivity: Filter global appointments for this client
                        const myClientAppointments = allAppointments.filter(app => app.clientName === currentUser?.name || app.clientName === 'Registered Client');
                        return isLoggedIn ? <ClientDashboard setPage={handlePageChange} user={currentUser!} appointments={myClientAppointments} orders={userOrders} prescriptions={prescriptions} onUpdateProfile={(u) => { setUsers(prev => prev.map(user => user.id === u.id ? u : user)); setCurrentUser(u); showNotification('تم تحديث الملف', 'success'); }} language={language} /> : <LandingPage setPage={handlePageChange} doctors={allDoctors} onSelectDoctor={(d) => { setSelectedDoctor(d); handlePageChange(Page.DOCTOR_PROFILE); }} onSearch={(f) => { setSearchFilters(f); handlePageChange(Page.SEARCH); }} onJoinDoctor={() => {setLoginModalPreSelectedRole(UserRole.DOCTOR); setLoginModalMode('register'); setShowLoginModal(true);}} language={language} />;
                    case Page.FORUM:
                        return <ForumPage setPage={handlePageChange} posts={forumTopics} onAddPost={(p) => { setForumTopics(prev => [p, ...prev]); api.content.createPost('forum', p); showNotification('تم النشر', 'success'); }} />;
                    case Page.REWARDS:
                        return <RewardsPage setPage={handlePageChange} />;
                    default:
                        return <LandingPage setPage={handlePageChange} doctors={allDoctors} onSelectDoctor={(d) => { setSelectedDoctor(d); handlePageChange(Page.DOCTOR_PROFILE); }} onSearch={(f) => { setSearchFilters(f); handlePageChange(Page.SEARCH); }} onJoinDoctor={() => {setLoginModalPreSelectedRole(UserRole.DOCTOR); setLoginModalMode('register'); setShowLoginModal(true);}} language={language} />;
                }
            })()}
        </Suspense>
      </main>
      
      <Footer setPage={handlePageChange} language={language} />
      
      <button 
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} 
        className={`fixed bottom-8 ${language === 'ar' ? 'right-6' : 'left-6'} z-[90] bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-white p-3 rounded-full shadow-lg transition-all duration-500 transform hover:scale-110 ${showScrollTop ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'}`}
      >
        <ArrowUp size={24} />
      </button>

    </div>
  );
};

export default App;
