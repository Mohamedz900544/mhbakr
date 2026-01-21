
import React, { useEffect, useState, useRef } from 'react';
import { User, Menu, ShoppingBag, Users, Home, Search, Heart, Stethoscope, LogIn, X, LogOut, Sun, Moon, LayoutDashboard, Settings, ChevronDown, Calendar, Wallet, FileText, Award, HelpCircle, Shield, Globe } from 'lucide-react';
import { Page, UserRole } from '../types';
import { translations, Language } from '../lib/translations';

interface NavbarProps {
  setPage: (page: Page) => void;
  currentPage: Page;
  isLoggedIn: boolean;
  userRole: UserRole | null;
  onLoginClick: () => void;
  onProfileClick: () => void;
  onLogout: () => void;
  cartCount: number;
  onCartClick: () => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
  language: Language;
  setLanguage: (lang: Language) => void;
}

const Navbar: React.FC<NavbarProps> = ({ 
  setPage, 
  currentPage, 
  isLoggedIn, 
  userRole,
  onLoginClick, 
  onProfileClick,
  onLogout,
  cartCount,
  onCartClick,
  isDarkMode,
  toggleTheme,
  language,
  setLanguage
}) => {
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const t = translations[language];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    
    const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
            setIsUserDropdownOpen(false);
        }
    };
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
        window.removeEventListener('scroll', handleScroll);
        document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const getNavItems = () => {
      if (isLoggedIn && userRole === UserRole.ADMIN) {
          return [
              { page: Page.ADMIN_DASHBOARD, icon: Shield, label: t.adminPanel },
              { page: Page.SEARCH, icon: Stethoscope, label: t.doctors },
          ];
      }
      if (isLoggedIn && userRole === UserRole.DOCTOR) {
          return [
            { page: Page.DOCTOR_DASHBOARD, icon: LayoutDashboard, label: t.doctorPanel },
            { page: Page.DOCTOR_SCHEDULE, icon: Calendar, label: 'الجدول' },
            { page: Page.DOCTOR_PATIENTS, icon: FileText, label: 'المرضى' },
            { page: Page.DOCTOR_WALLET, icon: Wallet, label: 'المالية' },
          ];
      }
      return [
        { page: Page.LANDING, icon: Home, label: t.home },
        { page: Page.SEARCH, icon: Stethoscope, label: t.doctors },
        { page: Page.SHOP, icon: ShoppingBag, label: t.shop },
        { page: Page.COMMUNITY, icon: Users, label: t.community },
      ];
  };

  const navItems = getNavItems();

  const handleNavClick = (page: Page) => {
    setPage(page);
    setIsMenuOpen(false);
  };

  const handleMobileAction = (action: () => void) => {
    action();
    setIsMenuOpen(false);
  };

  const toggleLanguage = () => {
      setLanguage(language === 'ar' ? 'en' : 'ar');
  };

  return (
    <>
      <nav 
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ease-in-out ${
          scrolled 
            ? 'bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-b border-gray-200/50 dark:border-slate-800/50 py-3 shadow-sm' 
            : 'bg-white/60 dark:bg-slate-900/60 backdrop-blur-md py-5 border-b border-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            
            {/* Logo */}
            <div 
              className="flex items-center gap-3 cursor-pointer group select-none" 
              onClick={() => setPage(Page.LANDING)}
            >
              <div className={`p-2.5 rounded-2xl transition-all duration-300 shadow-lg ${userRole === UserRole.DOCTOR ? 'bg-blue-600 shadow-blue-500/30' : userRole === UserRole.ADMIN ? 'bg-red-600 shadow-red-500/30' : 'bg-emerald-500 shadow-emerald-500/30 group-hover:bg-emerald-600 group-hover:scale-105'}`}>
                {userRole === UserRole.DOCTOR ? <Stethoscope className="h-6 w-6 text-white" /> : userRole === UserRole.ADMIN ? <Shield className="h-6 w-6 text-white" /> : <Heart className="h-6 w-6 text-white fill-white" />}
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black text-gray-900 dark:text-white leading-none tracking-tight">VetCare</span>
                <span className={`text-[10px] font-bold tracking-widest uppercase mt-0.5 ${userRole === UserRole.DOCTOR ? 'text-blue-600' : userRole === UserRole.ADMIN ? 'text-red-600' : 'text-gray-400 group-hover:text-emerald-500 transition-colors'}`}>
                    {userRole === UserRole.DOCTOR ? 'DOCTOR' : userRole === UserRole.ADMIN ? 'ADMIN' : 'SYSTEM'}
                </span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center bg-gray-100/50 dark:bg-slate-800/50 backdrop-blur-md p-1.5 rounded-full border border-gray-200/50 dark:border-slate-700/50">
              {navItems.map((item) => (
                <button
                  key={item.page}
                  onClick={() => setPage(item.page)}
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${
                    currentPage === item.page
                      ? userRole === UserRole.DOCTOR 
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' 
                        : userRole === UserRole.ADMIN 
                            ? 'bg-red-600 text-white shadow-lg shadow-red-500/30'
                            : 'bg-white dark:bg-emerald-600 text-slate-900 dark:text-white shadow-lg shadow-gray-200/50 dark:shadow-emerald-900/20'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200/50 dark:hover:bg-slate-700'
                  }`}
                >
                  <item.icon size={18} className={currentPage === item.page ? (userRole === UserRole.DOCTOR || userRole === UserRole.ADMIN ? '' : 'text-emerald-600 dark:text-white') : ''} strokeWidth={2.5} />
                  {item.label}
                </button>
              ))}
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2 md:gap-3">
              
              <button
                onClick={toggleLanguage}
                className="p-2.5 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-600 dark:text-gray-400 transition-colors font-bold text-xs flex items-center gap-1"
                title="Change Language"
              >
                <Globe size={18} />
                <span className="uppercase">{language === 'ar' ? 'EN' : 'ع'}</span>
              </button>

              <button
                onClick={toggleTheme}
                className="p-3 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-500 dark:text-gray-400 transition-colors hidden sm:block"
              >
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>

              {userRole !== UserRole.DOCTOR && userRole !== UserRole.ADMIN && (
                  <button 
                      onClick={onCartClick}
                      className="relative p-3 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-500 dark:text-gray-400 transition-colors hidden md:block"
                  >
                      <ShoppingBag size={22} />
                      {cartCount > 0 && (
                        <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white dark:border-slate-900">
                            {cartCount}
                        </span>
                      )}
                  </button>
              )}

              {isLoggedIn ? (
                  <div className="relative" ref={dropdownRef}>
                      {/* Desktop Profile */}
                      <button 
                        onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                        className={`hidden md:flex items-center gap-3 pl-2 pr-4 py-1.5 rounded-full border transition-all ${
                            isUserDropdownOpen 
                            ? 'bg-gray-50 dark:bg-slate-800 border-gray-300 dark:border-slate-600' 
                            : 'bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 hover:border-emerald-300 dark:hover:border-slate-600'
                        }`}
                      >
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white shadow-md ${userRole === UserRole.DOCTOR ? 'bg-blue-600' : userRole === UserRole.ADMIN ? 'bg-red-600' : 'bg-emerald-500'}`}>
                            {userRole === UserRole.DOCTOR ? <Stethoscope size={16} /> : userRole === UserRole.ADMIN ? <Shield size={16} /> : <User size={16} />}
                        </div>
                        <div className="flex flex-col items-start">
                            <span className="text-xs font-bold text-gray-900 dark:text-white">
                                {userRole === UserRole.DOCTOR ? 'د. محمد' : userRole === UserRole.ADMIN ? 'المدير' : 'محمود'}
                            </span>
                        </div>
                        <ChevronDown size={14} className={`text-gray-400 transition-transform ${isUserDropdownOpen ? 'rotate-180' : ''}`} />
                      </button>

                      {/* Mobile Profile Icon */}
                      <button 
                        onClick={onProfileClick}
                        className={`md:hidden w-10 h-10 rounded-full flex items-center justify-center text-white shadow-md transition-transform hover:scale-105 ${userRole === UserRole.DOCTOR ? 'bg-blue-600' : userRole === UserRole.ADMIN ? 'bg-red-600' : 'bg-emerald-500'}`}
                      >
                         {userRole === UserRole.DOCTOR ? <Stethoscope size={20} /> : userRole === UserRole.ADMIN ? <Shield size={20} /> : <User size={20} />}
                      </button>

                      {/* Dropdown */}
                      {isUserDropdownOpen && (
                          <div className={`absolute top-full mt-3 w-60 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-gray-100 dark:border-slate-700 overflow-hidden animate-fade-in-up hidden md:block z-[110] ${language === 'ar' ? 'left-0' : 'right-0'}`}>
                              <div className="p-2 space-y-1">
                                  <button 
                                    onClick={() => { onProfileClick(); setIsUserDropdownOpen(false); }}
                                    className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-700 rounded-xl transition-colors"
                                  >
                                      <LayoutDashboard size={18} className={userRole === UserRole.DOCTOR ? "text-blue-500" : "text-emerald-500"} />
                                      {userRole === UserRole.DOCTOR ? t.doctorPanel : userRole === UserRole.ADMIN ? t.adminPanel : 'حسابي'}
                                  </button>
                                  
                                  <div className="h-px bg-gray-100 dark:bg-slate-700 my-1"></div>
                                  <button 
                                    onClick={() => { onLogout(); setIsUserDropdownOpen(false); }}
                                    className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
                                  >
                                      <LogOut size={18} />
                                      {t.logout}
                                  </button>
                              </div>
                          </div>
                      )}
                  </div>
              ) : (
                  <button 
                    onClick={onLoginClick}
                    className="hidden md:flex bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-6 py-2.5 rounded-full font-bold text-sm hover:opacity-90 transition-all shadow-lg items-center gap-2"
                  >
                    <LogIn size={18} />
                    <span>{t.login}</span>
                  </button>
              )}

              <button 
                className="lg:hidden p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
                onClick={() => setIsMenuOpen(true)}
              >
                <Menu size={28} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer - Z-index 110 */}
      <div className={`fixed inset-0 z-[110] lg:hidden transition-all duration-300 ${isMenuOpen ? 'visible' : 'invisible'}`}>
        <div className={`absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300 ${isMenuOpen ? 'opacity-100' : 'opacity-0'}`} onClick={() => setIsMenuOpen(false)}></div>
        <div className={`absolute top-0 h-full w-[85%] max-w-[320px] bg-white dark:bg-slate-900 shadow-2xl transition-transform duration-300 flex flex-col ${language === 'ar' ? 'right-0' : 'left-0'} ${isMenuOpen ? 'translate-x-0' : (language === 'ar' ? 'translate-x-full' : '-translate-x-full')}`}>
            
            <div className="p-6 border-b border-gray-100 dark:border-slate-800">
                <div className="flex justify-between items-center mb-6">
                    <span className="text-xl font-black text-slate-900 dark:text-white">VetCare</span>
                    <button onClick={() => setIsMenuOpen(false)} className="p-2 bg-gray-100 dark:bg-slate-800 rounded-full text-gray-500"><X size={20} /></button>
                </div>
                
                {isLoggedIn ? (
                    <div className="bg-gray-50 dark:bg-slate-800 p-4 rounded-2xl flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white text-xl shadow-md ${userRole === UserRole.DOCTOR ? 'bg-blue-600' : userRole === UserRole.ADMIN ? 'bg-red-600' : 'bg-emerald-500'}`}>
                            {userRole === UserRole.DOCTOR ? <Stethoscope /> : userRole === UserRole.ADMIN ? <Shield /> : <User />}
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-900 dark:text-white">{userRole === UserRole.DOCTOR ? 'د. محمد' : userRole === UserRole.ADMIN ? 'Admin' : 'محمود'}</h3>
                            <button onClick={() => handleMobileAction(onProfileClick)} className="text-xs text-blue-500 font-bold mt-1">{t.adminPanel}</button>
                        </div>
                    </div>
                ) : (
                    <button onClick={() => handleMobileAction(onLoginClick)} className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg">
                        <LogIn size={18} /> {t.login}
                    </button>
                )}
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-2">
                {navItems.map((item) => (
                    <button
                        key={item.page}
                        onClick={() => handleNavClick(item.page)}
                        className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl text-sm font-bold transition-all ${
                            currentPage === item.page
                            ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white'
                            : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800'
                        }`}
                    >
                        <item.icon size={20} className={currentPage === item.page ? (userRole === UserRole.DOCTOR ? 'text-blue-500' : 'text-emerald-500') : ''} />
                        {item.label}
                    </button>
                ))}
            </div>

            <div className="p-6 border-t border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-800/50">
                <button onClick={toggleTheme} className="w-full flex items-center justify-between mb-4">
                    <span className="text-sm font-bold text-gray-500">Dark Mode</span>
                    <div className={`w-12 h-6 rounded-full relative transition-colors ${isDarkMode ? 'bg-emerald-500' : 'bg-gray-300'}`}>
                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${isDarkMode ? (language === 'ar' ? 'left-1' : 'right-1') : (language === 'ar' ? 'right-1' : 'left-1')}`}></div>
                    </div>
                </button>
                {isLoggedIn && (
                    <button onClick={() => handleMobileAction(onLogout)} className="w-full py-3 text-red-500 font-bold text-sm bg-red-50 dark:bg-red-900/20 rounded-xl">
                        {t.logout}
                    </button>
                )}
            </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
