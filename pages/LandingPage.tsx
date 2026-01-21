
import React, { useState } from 'react';
import { Search, ArrowLeft, Stethoscope, ShoppingBag, Users, MapPin, Shield, Star, Heart, ArrowRight } from 'lucide-react';
import { Page, Specialty, Doctor } from '../types';
import { CITIES } from '../constants';
import DoctorCard from '../components/DoctorCard';
import { Language, translations } from '../lib/translations';

interface LandingPageProps {
  setPage: (page: Page) => void;
  doctors: Doctor[];
  onSelectDoctor: (doctor: any) => void;
  onSearch: (filters: { specialty: string; city: string }) => void;
  onJoinDoctor: () => void;
  language: Language;
}

const LandingPage: React.FC<LandingPageProps> = ({ setPage, doctors, onSelectDoctor, onSearch, onJoinDoctor, language }) => {
  const [specialty, setSpecialty] = useState('');
  const [city, setCity] = useState('');
  
  const t = translations[language];

  const topDoctors = [...doctors]
    .filter(d => d.verified)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 4);

  return (
    <div className="min-h-screen pt-20 pb-12 relative overflow-hidden font-sans">
      
      {/* Dynamic Background Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-emerald-400/20 rounded-full mix-blend-multiply filter blur-[100px] opacity-70 animate-blob"></div>
          <div className="absolute top-0 left-0 w-[800px] h-[800px] bg-blue-400/20 rounded-full mix-blend-multiply filter blur-[100px] opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-32 left-1/2 w-[800px] h-[800px] bg-purple-400/20 rounded-full mix-blend-multiply filter blur-[100px] opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      {/* --- HERO SECTION (3D Layout) --- */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-32 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16 pt-10">
            
            {/* Text Content */}
            <div className="lg:w-1/2 text-center lg:text-right space-y-8 animate-fade-in-up">
                <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full text-xs font-bold text-emerald-700 dark:text-emerald-300 shadow-sm mb-4">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                    {language === 'ar' ? 'المنصة البيطرية الأولى في الشرق الأوسط' : '#1 Veterinary Platform in MENA'}
                </div>

                <h1 className="text-6xl md:text-8xl font-black tracking-tight leading-[1.1] text-slate-900 dark:text-white">
                  {language === 'ar' ? 'رعاية' : 'Care'}<br/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-400">
                    {language === 'ar' ? 'بلا حدود.' : 'Unlimited.'}
                  </span>
                </h1>

                <p className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed font-medium max-w-lg mx-auto lg:mx-0">
                  {t.heroSubtitle}
                </p>

                {/* Glass Search Bar */}
                <div className="glass-card p-2 rounded-[2rem] flex flex-col sm:flex-row gap-2 max-w-xl mx-auto lg:mx-0 shadow-2xl shadow-emerald-900/10 transform transition-transform hover:scale-[1.02]">
                    <div className="flex-1 relative">
                        <Stethoscope className="absolute top-1/2 -translate-y-1/2 right-4 text-slate-400" size={20}/>
                        <select 
                            value={specialty} 
                            onChange={(e) => setSpecialty(e.target.value)}
                            className="w-full bg-transparent h-14 pr-12 pl-4 outline-none font-bold text-slate-700 dark:text-white appearance-none cursor-pointer"
                        >
                            <option value="">{t.searchPlaceholder}</option>
                            {Object.values(Specialty).map(s => <option key={s} value={s} className="dark:bg-slate-800">{s}</option>)}
                        </select>
                    </div>
                    <div className="w-px bg-slate-200 dark:bg-slate-700 hidden sm:block"></div>
                    <button 
                        onClick={() => onSearch({ specialty, city })}
                        className="bg-slate-900 dark:bg-emerald-500 text-white h-14 px-8 rounded-[1.5rem] font-bold shadow-lg hover:shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2"
                    >
                        <Search size={20} />
                        {t.searchBtn}
                    </button>
                </div>

                <div className="flex items-center gap-6 justify-center lg:justify-start pt-4 opacity-80">
                    <div className="flex -space-x-4 space-x-reverse">
                        {[1,2,3,4].map(i => (
                            <img key={i} src={`https://i.pravatar.cc/100?img=${i+10}`} className="w-12 h-12 rounded-full border-4 border-white dark:border-slate-900" alt="User" />
                        ))}
                    </div>
                    <div className="text-right">
                        <div className="flex text-yellow-400"><Star size={16} fill="currentColor"/><Star size={16} fill="currentColor"/><Star size={16} fill="currentColor"/><Star size={16} fill="currentColor"/><Star size={16} fill="currentColor"/></div>
                        <p className="text-xs font-bold">+10,000 Happy Clients</p>
                    </div>
                </div>
            </div>

            {/* 3D Visual - UPDATED IMAGE */}
            <div className="lg:w-1/2 relative perspective-1000">
                <div className="relative w-full aspect-square transform-style-3d">
                    {/* Main Character - Using a very clear dog image to avoid 'sandwich' confusion */}
                    <div className="absolute inset-0 flex items-center justify-center animate-float">
                        <img 
                            src="https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&q=80&w=800" 
                            alt="Happy Dog" 
                            className="w-[90%] h-[90%] object-cover drop-shadow-[0_30px_60px_rgba(0,0,0,0.4)] z-10 hover:scale-105 transition-transform duration-700 rounded-[3rem]"
                        />
                    </div>
                    
                    {/* Floating Glass Cards - Orbiting */}
                    <div className="absolute top-[10%] left-[5%] z-20 glass-card p-4 rounded-3xl flex items-center gap-4 animate-float animation-delay-2000 shadow-xl border-t border-white/50">
                        <div className="bg-emerald-100 dark:bg-emerald-900/50 p-3 rounded-full text-emerald-600"><Shield size={24}/></div>
                        <div>
                            <p className="font-black text-lg">100%</p>
                            <p className="text-xs font-bold text-slate-500">Verified Vets</p>
                        </div>
                    </div>

                    <div className="absolute bottom-[15%] right-0 z-20 glass-card p-4 rounded-3xl flex items-center gap-4 animate-float animation-delay-4000 shadow-xl border-t border-white/50">
                        <div className="bg-orange-100 dark:bg-orange-900/50 p-3 rounded-full text-orange-600"><Heart size={24} fill="currentColor"/></div>
                        <div>
                            <p className="font-black text-lg">24/7</p>
                            <p className="text-xs font-bold text-slate-500">Emergency Care</p>
                        </div>
                    </div>

                    {/* Decorative Blobs behind image */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/20 to-teal-400/20 rounded-full blur-3xl -z-10 animate-pulse-slow"></div>
                </div>
            </div>
        </div>
      </div>

      {/* --- SERVICES (Glass Cards) --- */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-32">
         <div className="grid md:grid-cols-3 gap-8">
            {[
                { icon: Stethoscope, title: t.doctors, desc: language === 'ar' ? 'حجز فوري مع نخبة الأطباء' : 'Instant booking with elite vets', link: Page.SEARCH, color: 'text-emerald-500' },
                { icon: ShoppingBag, title: t.shop, desc: language === 'ar' ? 'منتجات أصلية وتوصيل سريع' : 'Original products, fast delivery', link: Page.SHOP, color: 'text-blue-500' },
                { icon: Users, title: t.community, desc: language === 'ar' ? 'مجتمع داعم لتبادل الخبرات' : 'Supportive community for pets', link: Page.COMMUNITY, color: 'text-purple-500' }
            ].map((item, i) => (
                <div 
                    key={i}
                    onClick={() => setPage(item.link)} 
                    className="glass-card p-8 rounded-[2.5rem] relative overflow-hidden group cursor-pointer card-3d-hover"
                >
                    <div className={`w-16 h-16 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform ${item.color}`}>
                        <item.icon size={32} />
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">{item.title}</h3>
                    <p className="text-slate-500 dark:text-slate-400 font-bold text-sm">{item.desc}</p>
                    <div className="mt-6 flex items-center gap-2 text-sm font-black opacity-0 group-hover:opacity-100 transition-all translate-y-4 group-hover:translate-y-0">
                        {language === 'ar' ? 'تصفح الآن' : 'Explore'} <ArrowLeft size={16} />
                    </div>
                </div>
            ))}
         </div>
      </div>

      {/* --- FEATURED DOCTORS --- */}
      <div className="bg-slate-100 dark:bg-slate-900/50 py-24 rounded-[4rem] mx-4 relative overflow-hidden">
         <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="flex justify-between items-end mb-12">
                <div>
                    <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-2">{language === 'ar' ? 'صفوة الأطباء' : 'Top Doctors'}</h2>
                    <p className="text-slate-500 font-bold">Hand-picked for your peace of mind</p>
                </div>
                <button onClick={() => setPage(Page.SEARCH)} className="text-emerald-600 font-black flex items-center gap-2 hover:gap-4 transition-all">
                    {language === 'ar' ? 'عرض الكل' : 'View All'} <ArrowLeft />
                </button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {topDoctors.map(doctor => (
                    <DoctorCard key={doctor.id} doctor={doctor} onBook={onSelectDoctor} />
                ))}
            </div>
         </div>
      </div>

      {/* --- DOCTOR CTA --- */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <div className="bg-slate-900 rounded-[3rem] p-12 md:p-24 text-center relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
              <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600 rounded-full blur-[150px] opacity-30"></div>
              
              <div className="relative z-10 max-w-3xl mx-auto">
                  <h2 className="text-5xl md:text-6xl font-black text-white mb-8 tracking-tight">
                      {language === 'ar' ? 'هل أنت طبيب بيطري؟' : 'Are you a Vet?'}
                  </h2>
                  <p className="text-slate-400 text-xl mb-10 leading-relaxed">
                      {language === 'ar' 
                        ? 'انضم لأكبر شبكة طبية، أدر عيادتك بذكاء، وضاعف دخلك مع نظام الحجوزات المتطور.' 
                        : 'Join the largest network, manage your clinic smartly, and increase your revenue.'}
                  </p>
                  <button 
                    onClick={onJoinDoctor}
                    className="bg-white text-slate-900 px-12 py-5 rounded-2xl font-black text-lg hover:bg-emerald-400 transition-all shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_rgba(52,211,153,0.6)]"
                  >
                      {language === 'ar' ? 'انضم كطبيب الآن' : 'Join as a Doctor'}
                  </button>
              </div>
          </div>
      </div>

    </div>
  );
};

export default LandingPage;
