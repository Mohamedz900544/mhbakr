
import React, { useState } from 'react';
import { Doctor, Page, Appointment } from '../types';
import { 
  MapPin, Star, Stethoscope, ShieldCheck, Calendar, 
  CheckCircle, ArrowRight, CreditCard, Banknote, Briefcase, Award, ChevronLeft, 
  User, Phone, Info, Clock, Map, PhoneCall, Heart, Share2, Syringe, Scissors, 
  AlertCircle, Home, LayoutDashboard, X, Sparkles, ChevronDown, ChevronUp, GraduationCap, Loader2
} from 'lucide-react';
import { Language, translations } from '../lib/translations';
import { translateContent } from '../lib/ai';

interface DoctorProfilePageProps {
  doctor: Doctor | null;
  setPage: (page: Page) => void;
  isLoggedIn: boolean;
  onLoginReq: () => void;
  onBookAppointment: (appointment: Appointment) => void; 
  language: Language;
}

const DoctorProfilePage: React.FC<DoctorProfilePageProps> = ({ doctor, setPage, isLoggedIn, onLoginReq, onBookAppointment, language }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'services' | 'reviews'>('overview');
  const [expandedSections, setExpandedSections] = useState<string[]>(['bio', 'hours']);
  const [translatedBio, setTranslatedBio] = useState<string | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);
  
  const t = translations[language];

  // Booking State
  const [selectedDay, setSelectedDay] = useState(0);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [bookingStep, setBookingStep] = useState<'slot' | 'details' | 'success'>('slot');
  
  // Guest Info
  const [guestName, setGuestName] = useState('');
  const [guestPhone, setGuestPhone] = useState('');

  if (!doctor) return <div className="min-h-screen flex items-center justify-center text-emerald-600 font-bold bg-slate-50 dark:bg-slate-950">{t.loading}</div>;

  const days = [
    { name: language === 'ar' ? 'اليوم' : 'Today', date: '25 Oct', slots: ['5:00 PM', '5:30 PM', '6:00 PM', '7:30 PM'] },
    { name: language === 'ar' ? 'غداً' : 'Tomorrow', date: '26 Oct', slots: ['1:00 PM', '2:00 PM', '4:00 PM'] },
    { name: language === 'ar' ? 'السبت' : 'Sat', date: '27 Oct', slots: ['10:00 AM', '10:30 AM', '11:00 AM'] }
  ];

  // Default Mock Services if user hasn't added any
  const defaultServices = [
    { name: language === 'ar' ? 'كشف عام' : 'General Checkup', price: doctor.price },
    { name: language === 'ar' ? 'تطعيمات دورية' : 'Vaccination', price: 250 },
    { name: language === 'ar' ? 'حلاقة وعناية' : 'Grooming', price: 300 },
  ];

  const services = (doctor.services && doctor.services.length > 0) ? doctor.services : defaultServices;

  const toggleSection = (section: string) => {
    setExpandedSections(prev => 
      prev.includes(section) ? prev.filter(s => s !== section) : [...prev, section]
    );
  };

  const handleTranslateBio = async () => {
      if (translatedBio) {
          setTranslatedBio(null); // Toggle back
          return;
      }
      
      setIsTranslating(true);
      const textToTranslate = doctor.about || doctor.bio;
      const result = await translateContent(textToTranslate, language);
      
      if (result) {
          setTranslatedBio(result);
      } else {
          alert("Translation service unavailable. Please try again.");
      }
      setIsTranslating(false);
  };

  const handleProceed = () => {
    if(!selectedSlot) {
        const btn = document.getElementById('book-btn');
        if(btn) {
            btn.classList.add('animate-shake');
            setTimeout(() => btn.classList.remove('animate-shake'), 500);
        }
        return;
    }
    setBookingStep('details');
  };

  const handleConfirmBooking = () => {
      if (!isLoggedIn && (!guestName || !guestPhone)) {
         alert(language === 'ar' ? "يرجى إدخال الاسم ورقم الهاتف لإتمام الحجز" : "Please enter name and phone");
         return;
      }

      const newAppointment: Appointment = {
          id: Date.now().toString(),
          doctorId: doctor.id, 
          doctorName: doctor.name,
          doctorSpecialty: typeof doctor.specialty === 'string' ? doctor.specialty : 'General',
          date: days[selectedDay].date,
          time: selectedSlot || '',
          status: 'upcoming',
          petName: isLoggedIn ? (language === 'ar' ? 'حيواني الأليف' : 'My Pet') : (language === 'ar' ? 'ضيف غير مسجل' : 'Guest'), 
          clientName: isLoggedIn ? (language === 'ar' ? 'عميل مسجل' : 'Registered Client') : guestName,
          location: doctor.location,
          price: doctor.price
      };

      onBookAppointment(newAppointment);

      setTimeout(() => {
          setBookingStep('success');
      }, 500);
  };

  // Helper Accordion Component
  const AccordionItem = ({ id, title, icon: Icon, children }: any) => {
    const isOpen = expandedSections.includes(id);
    return (
      <div className="border border-slate-100 dark:border-slate-700/50 rounded-3xl overflow-hidden mb-4 transition-all bg-white dark:bg-slate-800 shadow-sm hover:shadow-lg">
        <button
          onClick={() => toggleSection(id)}
          className={`w-full flex items-center justify-between p-6 font-bold text-slate-900 dark:text-white transition-colors ${isOpen ? 'bg-slate-50/50 dark:bg-slate-700/30' : 'hover:bg-slate-50 dark:hover:bg-slate-700/30'}`}
        >
          <div className="flex items-center gap-4">
            {Icon && <div className={`p-2.5 rounded-2xl ${isOpen ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400' : 'bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400'}`}><Icon size={20} /></div>}
            <span className="text-lg">{title}</span>
          </div>
          {isOpen ? <ChevronUp size={20} className="text-emerald-500" /> : <ChevronDown size={20} className="text-slate-400" />}
        </button>
        <div
          className={`transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}
        >
          <div className="p-6 pt-2 text-sm text-slate-600 dark:text-slate-300 leading-loose">
            <div className="mt-2">
               {children}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-slate-950 pb-12 animate-fade-in transition-colors duration-300 font-sans relative">
      
      {/* Emergency Floating Button */}
      <a href={`tel:123456789`} className="fixed bottom-8 left-8 z-[60] flex items-center justify-center gap-3 bg-red-600 hover:bg-red-500 text-white px-6 py-4 rounded-full shadow-[0_0_30px_rgba(220,38,38,0.4)] animate-pulse hover:animate-none transition-all hover:scale-105 border-4 border-white dark:border-slate-900 group">
          <AlertCircle className="animate-bounce" size={24} />
          <div className="flex flex-col items-start">
             <span className="font-black text-lg leading-none">{language === 'ar' ? 'طوارئ 24/7' : 'Emergency 24/7'}</span>
             <span className="text-[10px] opacity-90 font-bold hidden group-hover:inline-block transition-all">{language === 'ar' ? 'اضغط للاتصال فوراً' : 'Call Now'}</span>
          </div>
      </a>

      {/* Hero Header with Parallax & Gradient */}
      <div className="relative h-[350px] overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-900 via-slate-900 to-black z-0"></div>
          <img 
            src={doctor.bannerUrl || "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=1200"} 
            className="w-full h-full object-cover opacity-30 mix-blend-overlay" 
            alt="Clinic Cover" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#f8fafc] dark:from-slate-950 via-transparent to-transparent z-10"></div>
          
          <div className="absolute top-6 right-0 w-full px-4 sm:px-6 lg:px-8 z-20 flex justify-between items-center pt-4">
             <button className="glass hover:bg-white/20 text-white px-5 py-2.5 rounded-2xl transition-all flex items-center gap-2 font-bold text-sm backdrop-blur-md" onClick={() => setPage(Page.SEARCH)}>
                <ArrowRight size={18} /> {t.back}
             </button>
          </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-40 relative z-20">
        <div className="grid lg:grid-cols-3 gap-8 items-start">
            
            {/* --- Left Column: Clinic Info --- */}
            <div className="lg:col-span-2 space-y-8">
                
                {/* Main Profile Card */}
                <div className="glass-card rounded-[3rem] p-8 relative overflow-hidden">
                    <div className="flex flex-col sm:flex-row gap-8 items-start relative z-10">
                        <div className="relative group">
                            <div className="w-40 h-40 rounded-[2.5rem] overflow-hidden border-[6px] border-white dark:border-slate-800 shadow-2xl transition-transform transform group-hover:scale-105">
                                <img src={doctor.imageUrl} alt={doctor.name} className="w-full h-full object-cover" />
                            </div>
                            <div className="absolute -bottom-4 -right-4 bg-blue-500 text-white p-3 rounded-2xl shadow-lg border-4 border-white dark:border-slate-800 flex items-center justify-center">
                                <ShieldCheck size={24} />
                            </div>
                        </div>

                        <div className="flex-1 w-full pt-2">
                            <div className="flex justify-between items-start flex-wrap gap-4">
                                <div>
                                    <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-2 flex items-center gap-3">
                                        {doctor.name}
                                        <span className="bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-300 text-[10px] px-3 py-1 rounded-full font-bold border border-blue-200 dark:border-blue-500/30">Verified</span>
                                    </h1>
                                    <p className="text-emerald-600 dark:text-emerald-400 font-bold mb-2">{doctor.title}</p>
                                    <p className="text-slate-500 dark:text-slate-400 font-bold mb-4 flex items-center gap-2 text-lg">
                                        <MapPin size={20} className="text-emerald-500" /> {doctor.location}
                                    </p>
                                </div>
                                <div className="text-center bg-yellow-50 dark:bg-yellow-900/10 px-5 py-3 rounded-2xl border border-yellow-200 dark:border-yellow-500/20">
                                    <div className="flex items-center gap-1 justify-center text-yellow-500 font-black text-2xl">
                                        {doctor.rating} <Star className="fill-current" size={20} />
                                    </div>
                                    <span className="text-xs text-slate-400 font-bold">{doctor.reviewsCount} reviews</span>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-3 mt-6">
                                <span className="glass px-5 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 text-slate-700 dark:text-slate-200">
                                    <Briefcase size={16} className="text-blue-500" /> {doctor.specialty}
                                </span>
                                <span className="glass px-5 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 text-slate-700 dark:text-slate-200">
                                    <Clock size={16} className="text-orange-500" /> Wait: {doctor.waitingTime} min
                                </span>
                                <span className="glass px-5 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 text-slate-700 dark:text-slate-200">
                                    <CreditCard size={16} className="text-green-500" /> Fees: {doctor.price} {t.currency}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-10 pt-8 border-t border-slate-200/50 dark:border-slate-700/50 flex gap-4 relative z-10">
                        <button className="flex-1 bg-white dark:bg-slate-800 py-3.5 rounded-2xl font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2">
                            <Share2 size={18} /> Share
                        </button>
                        <button className="flex-1 bg-white dark:bg-slate-800 py-3.5 rounded-2xl font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2">
                            <Heart size={18} /> Save
                        </button>
                    </div>
                </div>

                {/* Tabs Section */}
                <div className="glass-card rounded-[3rem] shadow-lg border border-slate-100 dark:border-slate-800 overflow-hidden min-h-[500px]">
                    <div className="flex border-b border-slate-100 dark:border-slate-800 px-8 pt-8 gap-8 bg-slate-50/30 dark:bg-slate-900/30">
                        <button onClick={() => setActiveTab('overview')} className={`pb-5 text-sm font-black border-b-4 transition-all ${activeTab === 'overview' ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400' : 'border-transparent text-slate-400 hover:text-slate-600'}`}>Overview</button>
                        <button onClick={() => setActiveTab('services')} className={`pb-5 text-sm font-black border-b-4 transition-all ${activeTab === 'services' ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400' : 'border-transparent text-slate-400 hover:text-slate-600'}`}>Services</button>
                        <button onClick={() => setActiveTab('reviews')} className={`pb-5 text-sm font-black border-b-4 transition-all ${activeTab === 'reviews' ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400' : 'border-transparent text-slate-400 hover:text-slate-600'}`}>Reviews</button>
                    </div>

                    <div className="p-8">
                        {activeTab === 'overview' && (
                            <div className="space-y-2 animate-fade-in">
                                <AccordionItem id="bio" title={language === 'ar' ? "عن الطبيب" : "About"} icon={Info}>
                                    <div className="flex justify-between items-start gap-4">
                                        <p className="leading-loose mb-6 text-base whitespace-pre-wrap">{translatedBio || doctor.about || doctor.bio}</p>
                                        <button 
                                            onClick={handleTranslateBio}
                                            disabled={isTranslating}
                                            className="text-xs bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 px-3 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-emerald-200 dark:hover:bg-emerald-900/50 transition-colors whitespace-nowrap self-start shadow-sm"
                                        >
                                            {isTranslating ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
                                            {isTranslating ? t.translating : (translatedBio ? t.original : t.translateWithAI)}
                                        </button>
                                    </div>
                                    <h4 className="font-bold text-slate-900 dark:text-white mb-4 mt-8 flex items-center gap-2 text-sm"><Map size={16}/> Gallery</h4>
                                    <div className="grid grid-cols-3 gap-3">
                                        {doctor.images?.map((img, i) => (
                                            <img key={i} src={img} className="rounded-2xl object-cover w-full h-32 shadow-md hover:scale-105 transition-transform cursor-pointer border-2 border-white dark:border-slate-700" alt="Clinic" />
                                        )) || <p className="text-slate-400 text-xs">No images available</p>}
                                    </div>
                                </AccordionItem>

                                <AccordionItem id="qualifications" title={language === 'ar' ? "المؤهلات" : "Qualifications"} icon={GraduationCap}>
                                    <ul className="space-y-4">
                                        {doctor.qualifications && doctor.qualifications.length > 0 ? (
                                            doctor.qualifications.map((q, i) => (
                                                <li key={i} className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700/50">
                                                    <div className="bg-emerald-100 dark:bg-emerald-500/20 p-2 rounded-xl text-emerald-600 dark:text-emerald-400">
                                                        <Award size={18} />
                                                    </div>
                                                    <span className="font-bold text-slate-700 dark:text-slate-200 text-sm">{q}</span>
                                                </li>
                                            ))
                                        ) : (
                                            <p className="text-slate-400 italic">No qualifications listed.</p>
                                        )}
                                    </ul>
                                </AccordionItem>

                                <AccordionItem id="hours" title={language === 'ar' ? "مواعيد العمل" : "Working Hours"} icon={Clock}>
                                    <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-3xl grid grid-cols-2 gap-6 text-sm border border-slate-100 dark:border-slate-700/50">
                                        <div className="flex flex-col gap-1 pb-2 border-b border-slate-200 dark:border-slate-700">
                                            <span className="text-slate-500 dark:text-slate-400 font-bold">Start Time</span>
                                            <span className="font-black text-slate-900 dark:text-white text-lg">{doctor.workingHours?.start || '10:00'}</span>
                                        </div>
                                        <div className="flex flex-col gap-1 pb-2 border-b border-slate-200 dark:border-slate-700">
                                            <span className="text-slate-500 dark:text-slate-400 font-bold">End Time</span>
                                            <span className="font-black text-emerald-500 text-lg">{doctor.workingHours?.end || '22:00'}</span>
                                        </div>
                                    </div>
                                </AccordionItem>
                            </div>
                        )}

                        {activeTab === 'services' && (
                            <div className="grid gap-4 animate-fade-in">
                                {services.map((svc, i) => (
                                    <div key={i} className="flex items-center justify-between p-5 rounded-3xl border border-slate-100 dark:border-slate-700 hover:border-emerald-500 dark:hover:border-emerald-500 transition-all hover:shadow-md bg-white dark:bg-slate-800 group">
                                        <div className="flex items-center gap-5">
                                            <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform">
                                                <Stethoscope size={24} />
                                            </div>
                                            <span className="font-bold text-slate-900 dark:text-white text-lg">{svc.name}</span>
                                        </div>
                                        <span className="font-black text-emerald-600 dark:text-emerald-400 text-lg">{svc.price} {t.currency}</span>
                                    </div>
                                ))}
                            </div>
                        )}

                         {activeTab === 'reviews' && (
                             <div className="animate-fade-in space-y-8">
                                 {/* AI Summary Block */}
                                 <div className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 p-6 rounded-3xl border border-purple-100 dark:border-purple-500/20 relative overflow-hidden">
                                     <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-400 to-indigo-500"></div>
                                     <div className="flex items-center gap-3 mb-3 relative z-10">
                                         <div className="bg-white dark:bg-slate-800 p-2 rounded-lg shadow-sm">
                                            <Sparkles className="text-purple-500" size={20} />
                                         </div>
                                         <h4 className="font-black text-purple-900 dark:text-purple-300 text-lg">AI Summary</h4>
                                     </div>
                                     <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed relative z-10">
                                         Based on {doctor.reviewsCount} reviews, patients consistently praise the doctor's diagnostic accuracy and compassionate handling of animals. The clinic is noted for its cleanliness, though some mentioned slightly longer wait times during peak hours.
                                     </p>
                                 </div>

                                 <div className="text-center py-10 bg-slate-50 dark:bg-slate-800/50 rounded-[2.5rem] border border-dashed border-slate-200 dark:border-slate-700">
                                     <div className="bg-white dark:bg-slate-800 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
                                        <Star className="text-slate-300 dark:text-slate-600" size={32} />
                                     </div>
                                     <h3 className="font-bold text-slate-900 dark:text-white mb-2 text-lg">Be the first to review</h3>
                                     <p className="text-slate-500 dark:text-slate-400 text-sm">Your feedback helps other pet owners.</p>
                                 </div>
                             </div>
                        )}
                    </div>
                </div>
            </div>

            {/* --- Right Column: Sticky Booking Card --- */}
            <div className="lg:col-span-1">
                <div id="booking-card" className="bg-white dark:bg-slate-900 rounded-[3rem] shadow-2xl border border-slate-100 dark:border-slate-800 sticky top-32 overflow-hidden z-30 ring-4 ring-slate-50 dark:ring-slate-800/50">
                    
                    {/* Booking Header */}
                    <div className="bg-slate-900 dark:bg-emerald-600 p-8 text-white text-center relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-40 h-40 bg-white opacity-5 rounded-full blur-3xl -mr-10 -mt-10"></div>
                        {bookingStep === 'details' && (
                            <button onClick={() => setBookingStep('slot')} className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 hover:text-white p-2 rounded-full hover:bg-white/10 transition-all">
                                <ChevronLeft size={24} className="rotate-180" />
                            </button>
                        )}
                        <h3 className="text-2xl font-black relative z-10">
                            {bookingStep === 'slot' ? (language === 'ar' ? 'احجز موعدك' : 'Book Now') : (language === 'ar' ? 'بيانات الحجز' : 'Booking Details')}
                        </h3>
                        <p className="text-white/60 text-xs font-bold mt-1 relative z-10">Step {bookingStep === 'slot' ? '1' : '2'} of 2</p>
                    </div>
                    
                    <div className="p-8">
                        {bookingStep === 'slot' ? (
                            <div className="animate-fade-in">
                                <h4 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2 text-sm">
                                    <Calendar className="w-4 h-4 text-emerald-500" /> {language === 'ar' ? 'اختر اليوم' : 'Select Day'}
                                </h4>
                                <div className="flex bg-slate-100 dark:bg-slate-800 rounded-2xl p-1.5 mb-8">
                                    {days.map((day, idx) => (
                                        <button 
                                            key={idx}
                                            onClick={() => { setSelectedDay(idx); setSelectedSlot(null); }}
                                            className={`flex-1 text-center py-3 rounded-xl text-xs transition-all ${selectedDay === idx ? 'bg-white dark:bg-slate-700 shadow-md text-emerald-600 dark:text-emerald-400 font-black scale-105' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 font-bold'}`}
                                        >
                                            {day.name} <br/> <span className="opacity-70 font-normal mt-1 block">{day.date}</span>
                                        </button>
                                    ))}
                                </div>
                                
                                <h4 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2 text-sm">
                                    <Clock className="w-4 h-4 text-emerald-500" /> {language === 'ar' ? 'المواعيد المتاحة' : 'Available Slots'}
                                </h4>
                                <div className="grid grid-cols-2 gap-3 mb-8">
                                    {days[selectedDay].slots.map((slot) => (
                                        <button
                                            key={slot}
                                            onClick={() => setSelectedSlot(slot)}
                                            className={`py-3.5 px-2 rounded-xl border-2 text-sm transition-all font-bold ${selectedSlot === slot ? 'bg-emerald-500 text-white border-emerald-500 shadow-lg scale-105' : 'bg-transparent text-slate-600 dark:text-slate-300 border-slate-100 dark:border-slate-700 hover:border-emerald-300 dark:hover:border-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-900/10'}`}
                                        >
                                            {slot}
                                        </button>
                                    ))}
                                </div>
                                
                                <button 
                                    id="book-btn"
                                    onClick={handleProceed}
                                    className={`w-full py-4 rounded-2xl font-black text-base transition-all shadow-xl flex items-center justify-center gap-2 mb-4 ${selectedSlot ? 'bg-slate-900 dark:bg-emerald-500 text-white hover:bg-emerald-600 dark:hover:bg-emerald-600 hover:-translate-y-1' : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed'}`}
                                >
                                    {language === 'ar' ? 'متابعة الحجز' : 'Continue'} <ChevronLeft size={20} />
                                </button>
                                
                                <div className="flex items-center justify-center gap-2 text-[10px] text-slate-400 font-bold bg-slate-50 dark:bg-slate-800/50 py-2 rounded-lg">
                                    <CheckCircle size={12} className="text-emerald-500" /> {language === 'ar' ? 'لا يشترط الدفع أونلاين' : 'Pay at Clinic'}
                                </div>
                            </div>
                        ) : (
                            <div className="animate-fade-in space-y-6">
                                <div className="bg-emerald-50 dark:bg-emerald-900/20 p-5 rounded-3xl border border-emerald-100 dark:border-emerald-500/20 text-sm">
                                    <div className="flex justify-between mb-3 border-b border-emerald-200 dark:border-emerald-800 pb-3">
                                        <span className="text-slate-500 dark:text-emerald-200 font-bold">Appointment</span>
                                        <span className="font-black text-emerald-700 dark:text-emerald-400">{days[selectedDay].date} - {selectedSlot}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-slate-500 dark:text-emerald-200 font-bold">Total Fees</span>
                                        <span className="font-black text-slate-900 dark:text-white text-lg">{doctor.price} {t.currency}</span>
                                    </div>
                                </div>

                                {!isLoggedIn && (
                                    <div className="space-y-4 pt-2">
                                        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl text-xs text-blue-700 dark:text-blue-300 leading-relaxed font-bold border border-blue-100 dark:border-blue-800 flex gap-3">
                                            <Info size={16} className="flex-shrink-0" />
                                            {language === 'ar' ? 'يمكنك الحجز كزائر، أو تسجيل الدخول لحفظ بياناتك.' : 'You can book as a guest or login to save history.'}
                                        </div>
                                        
                                        <div>
                                            <label className="text-xs font-bold text-slate-500 mb-2 block">{language === 'ar' ? 'الاسم بالكامل' : 'Full Name'}</label>
                                            <input 
                                                type="text" 
                                                value={guestName}
                                                onChange={(e) => setGuestName(e.target.value)}
                                                className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-xl px-4 py-3.5 text-sm font-bold focus:outline-none focus:border-emerald-500 dark:text-white transition-colors"
                                                placeholder={language === 'ar' ? 'الاسم' : 'Name'}
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-slate-500 mb-2 block">{language === 'ar' ? 'رقم الهاتف' : 'Phone'}</label>
                                            <input 
                                                type="tel" 
                                                value={guestPhone}
                                                onChange={(e) => setGuestPhone(e.target.value)}
                                                className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-xl px-4 py-3.5 text-sm font-bold focus:outline-none focus:border-emerald-500 dark:text-white transition-colors"
                                                placeholder="01xxxxxxxxx"
                                            />
                                        </div>
                                    </div>
                                )}

                                <button 
                                    onClick={handleConfirmBooking}
                                    className="w-full bg-emerald-500 text-white py-4 rounded-2xl font-black text-lg hover:bg-emerald-600 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 transform duration-200 flex items-center justify-center gap-3"
                                >
                                    {t.confirm} <CheckCircle size={22} />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
      </div>

      {/* Enhanced Success Modal */}
      {bookingStep === 'success' && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/80 backdrop-blur-xl p-6 animate-fade-in">
           <div className="bg-white dark:bg-slate-900 rounded-[3rem] w-full max-w-md shadow-2xl relative overflow-hidden flex flex-col border border-white/20 dark:border-slate-700">
             
             <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-emerald-500/20 to-transparent"></div>
             <button onClick={() => setPage(Page.LANDING)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 z-20 p-2 bg-white/50 dark:bg-slate-800/50 backdrop-blur rounded-full transition-colors"><X size={24}/></button>

             <div className="p-8 text-center relative z-10 pt-12">
                <div className="w-28 h-28 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner animate-bounce-slow ring-8 ring-emerald-50 dark:ring-emerald-900/10">
                    <CheckCircle size={56} className="text-emerald-500" />
                </div>
                
                <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-3">{language === 'ar' ? 'تم الحجز بنجاح!' : 'Booking Confirmed!'}</h2>
                <p className="text-slate-500 dark:text-slate-400 mb-8 text-base font-medium">{language === 'ar' ? 'تم تسجيل موعدك. سيتم الاتصال بك لتأكيد الحجز قريباً.' : 'Your appointment is booked. We will contact you shortly.'}</p>

                {/* Ticket Details */}
                <div className="bg-slate-50 dark:bg-slate-800 rounded-3xl p-6 mb-8 border border-dashed border-slate-200 dark:border-slate-700 relative">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 via-teal-500 to-emerald-600 rounded-t-3xl"></div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="text-right border-l border-slate-200 dark:border-slate-700 pl-4">
                            <p className="text-xs text-slate-400 font-bold mb-1">Doctor</p>
                            <p className="font-black text-slate-900 dark:text-white">{doctor.name}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-xs text-slate-400 font-bold mb-1">Date</p>
                            <p className="font-black text-slate-900 dark:text-white">{days[selectedDay].date}</p>
                        </div>
                        <div className="text-right border-l border-slate-200 dark:border-slate-700 pl-4 pt-4 border-t">
                            <p className="text-xs text-slate-400 font-bold mb-1">Time</p>
                            <p className="font-black text-emerald-600 dark:text-emerald-400 text-lg">{selectedSlot}</p>
                        </div>
                        <div className="text-right pt-4 border-t border-slate-200 dark:border-slate-700">
                            <p className="text-xs text-slate-400 font-bold mb-1">ID</p>
                            <p className="font-mono font-bold text-slate-600 dark:text-slate-300">#9283</p>
                        </div>
                    </div>
                </div>
                
                <button 
                    onClick={() => setPage(Page.LANDING)}
                    className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-4 rounded-2xl font-bold hover:opacity-90 transition-all shadow-xl flex items-center justify-center gap-2"
                >
                    <Home size={20} />
                    {language === 'ar' ? 'العودة للرئيسية' : 'Back to Home'}
                </button>
             </div>
           </div>
         </div>
      )}
      
      <style>
          {`
            @keyframes shake {
                0%, 100% { transform: translateX(0); }
                10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
                20%, 40%, 60%, 80% { transform: translateX(5px); }
            }
            .animate-shake {
                animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
            }
          `}
      </style>
    </div>
  );
};

const ActivityIcon = (props: any) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
);

export default DoctorProfilePage;
