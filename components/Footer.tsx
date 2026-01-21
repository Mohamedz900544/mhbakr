
import React from 'react';
import { Heart, Facebook, Twitter, Instagram, Mail, Phone, MapPin, Stethoscope, ShoppingBag, BookOpen } from 'lucide-react';
import { Page } from '../types';
import { Language, translations } from '../lib/translations';

interface FooterProps {
  setPage: (page: Page) => void;
  language: Language;
}

const Footer: React.FC<FooterProps> = ({ setPage, language }) => {
  const t = translations[language];

  return (
    <footer className="bg-slate-900 text-white pt-20 pb-10 border-t border-slate-800 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-900/20 rounded-full blur-3xl -mr-32 -mt-32"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-900/20 rounded-full blur-3xl -ml-32 -mb-32"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Brand Column */}
          <div className="space-y-6">
            <div 
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => setPage(Page.LANDING)}
            >
              <div className="bg-emerald-500 p-2.5 rounded-2xl shadow-lg shadow-emerald-900/20">
                <Heart className="text-white fill-white" size={24} />
              </div>
              <span className="text-2xl font-black tracking-tight">VetCare</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
              {language === 'ar' 
                ? 'المنصة البيطرية الأولى في مصر. نجمع بين التكنولوجيا والرعاية الصحية لضمان حياة أفضل لحيوانك الأليف.' 
                : 'The #1 Veterinary Platform. We combine technology and healthcare to ensure a better life for your pet.'}
            </p>
            <div className="flex gap-4 pt-2">
              <a href="#" className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center hover:bg-blue-600 hover:scale-110 transition-all shadow-md"><Facebook size={18} /></a>
              <a href="#" className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center hover:bg-pink-600 hover:scale-110 transition-all shadow-md"><Instagram size={18} /></a>
              <a href="#" className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center hover:bg-sky-500 hover:scale-110 transition-all shadow-md"><Twitter size={18} /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-lg mb-6 flex items-center gap-2"><BookOpen size={18} className="text-emerald-500"/> {t.quickLinks}</h3>
            <ul className="space-y-4 text-slate-400 text-sm font-medium">
              <li><button onClick={() => setPage(Page.LANDING)} className="hover:text-emerald-400 hover:translate-x-1 transition-all inline-block">{t.home}</button></li>
              <li><button onClick={() => setPage(Page.SEARCH)} className="hover:text-emerald-400 hover:translate-x-1 transition-all inline-block">{t.doctors}</button></li>
              <li><button onClick={() => setPage(Page.SHOP)} className="hover:text-emerald-400 hover:translate-x-1 transition-all inline-block">{t.shop}</button></li>
              <li><button onClick={() => setPage(Page.COMMUNITY)} className="hover:text-emerald-400 hover:translate-x-1 transition-all inline-block">{t.community}</button></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-bold text-lg mb-6 flex items-center gap-2"><Stethoscope size={18} className="text-emerald-500"/> {t.services}</h3>
            <ul className="space-y-4 text-slate-400 text-sm font-medium">
              <li><button onClick={() => setPage(Page.SEARCH)} className="hover:text-emerald-400 hover:translate-x-1 transition-all inline-block">{language === 'ar' ? 'حجز كشف' : 'Book Appointment'}</button></li>
              <li><button onClick={() => setPage(Page.SEARCH)} className="hover:text-emerald-400 hover:translate-x-1 transition-all inline-block">{language === 'ar' ? 'زيارة منزلية' : 'Home Visit'}</button></li>
              <li><button onClick={() => setPage(Page.COMMUNITY)} className="hover:text-emerald-400 hover:translate-x-1 transition-all inline-block">{language === 'ar' ? 'استشارة أونلاين' : 'Online Consult'}</button></li>
              <li><button onClick={() => setPage(Page.SHOP)} className="hover:text-emerald-400 hover:translate-x-1 transition-all inline-block">{language === 'ar' ? 'متجر المستلزمات' : 'Pet Store'}</button></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold text-lg mb-6 flex items-center gap-2"><Phone size={18} className="text-emerald-500"/> {t.contact}</h3>
            <ul className="space-y-5 text-slate-400 text-sm">
              <li className="flex items-center gap-4 group">
                <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center group-hover:bg-emerald-600 transition-colors">
                    <Phone size={18} className="text-emerald-500 group-hover:text-white transition-colors" />
                </div>
                <span className="font-bold text-white">19011</span>
              </li>
              <li className="flex items-center gap-4 group">
                <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center group-hover:bg-emerald-600 transition-colors">
                    <Mail size={18} className="text-emerald-500 group-hover:text-white transition-colors" />
                </div>
                <span>support@vetcare.com</span>
              </li>
              <li className="flex items-center gap-4 group">
                <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center group-hover:bg-emerald-600 transition-colors">
                    <MapPin size={18} className="text-emerald-500 group-hover:text-white transition-colors" />
                </div>
                <span>{language === 'ar' ? 'المعادي، القاهرة، مصر' : 'Maadi, Cairo, Egypt'}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 text-center flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 text-sm font-bold">© 2024 {t.rights}</p>
          <div className="flex gap-4">
              <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Google Play" className="h-10 opacity-80 hover:opacity-100 transition-opacity cursor-pointer" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg" alt="App Store" className="h-10 opacity-80 hover:opacity-100 transition-opacity cursor-pointer" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
