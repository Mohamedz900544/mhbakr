
import React, { useState, useEffect } from 'react';
import { Filter, SlidersHorizontal, SearchX, Check, Map as MapIcon, List, LayoutGrid, Star, MapPin, X, ChevronDown, ChevronUp, CheckCircle } from 'lucide-react';
import { Doctor, Specialty, Page } from '../types';
import DoctorCard from '../components/DoctorCard';
import MapView from '../components/MapView';
import { Language, translations } from '../lib/translations';

interface SearchPageProps {
  setPage: (page: Page) => void;
  initialFilters: { specialty: string; city: string };
  onSelectDoctor: (doctor: Doctor) => void;
  doctors: Doctor[];
  language: Language;
}

const SearchPage: React.FC<SearchPageProps> = ({ setPage, initialFilters, onSelectDoctor, doctors, language }) => {
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [isFiltersOpen, setIsFiltersOpen] = useState(false); 
  const [isDesktopFiltersVisible, setIsDesktopFiltersVisible] = useState(true);

  const [filters, setFilters] = useState({
    specialty: '',
    city: '',
    availability: false,
  });

  const t = translations[language];

  useEffect(() => {
    setFilters(prev => ({
        ...prev,
        specialty: initialFilters.specialty,
        city: initialFilters.city
    }));
  }, [initialFilters]);

  const filteredDoctors = doctors.filter(doc => {
    if (!doc.verified) return false;
    if (filters.specialty && doc.specialty !== filters.specialty) return false;
    if (filters.city && !doc.location.includes(filters.city)) return false;
    if (filters.availability && !doc.available) return false;
    return true;
  });

  const FilterContent = () => (
    <>
        <div className="flex items-center justify-between mb-6">
        <h2 className="font-black text-xl text-gray-900 dark:text-white flex items-center gap-2">
            <Filter size={20} className="text-emerald-500" /> {t.filter}
        </h2>
        {(filters.specialty || filters.availability || filters.city) && (
            <button 
            onClick={() => setFilters({specialty: '', availability: false, city: ''})}
            className="text-xs text-red-500 font-bold hover:bg-red-50 dark:hover:bg-red-900/20 px-2 py-1 rounded-lg transition-colors"
            >
            {t.clearFilters}
            </button>
        )}
        </div>

        {/* Specialty Filter */}
        <div className="mb-8">
        <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-4">{t.specialty}</h3>
        <div className="space-y-2">
            <button 
            onClick={() => setFilters({...filters, specialty: ''})}
            className={`w-full ${language === 'ar' ? 'text-right' : 'text-left'} px-4 py-3 rounded-2xl text-sm font-bold transition-all duration-300 ${filters.specialty === '' ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/30' : 'bg-gray-50 dark:bg-slate-700/50 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700'}`}
            >
            {language === 'ar' ? 'الكل' : 'All'}
            </button>
            {Object.values(Specialty).map(spec => (
            <button
                key={spec}
                onClick={() => setFilters({...filters, specialty: spec})}
                className={`w-full ${language === 'ar' ? 'text-right' : 'text-left'} px-4 py-3 rounded-2xl text-sm font-bold transition-all duration-300 flex justify-between items-center ${filters.specialty === spec ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/30' : 'bg-gray-50 dark:bg-slate-700/50 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700'}`}
            >
                {spec}
                {filters.specialty === spec && <Check size={16} />}
            </button>
            ))}
        </div>
        </div>

        {/* City Filter */}
        <div className="mb-8">
        <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-4">{t.city}</h3>
        <div className="relative">
            <select 
                value={filters.city}
                onChange={(e) => setFilters({...filters, city: e.target.value})}
                className="w-full bg-gray-50 dark:bg-slate-700/50 border-none rounded-2xl p-4 text-sm font-bold text-gray-700 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500 transition-all appearance-none cursor-pointer"
            >
                <option value="">{language === 'ar' ? 'كل المدن' : 'All Cities'}</option>
                <option value="القاهرة">القاهرة</option>
                <option value="الجيزة">الجيزة</option>
                <option value="الإسكندرية">الإسكندرية</option>
                <option value="المنصورة">المنصورة</option>
                <option value="طنطا">طنطا</option>
            </select>
            <ChevronDown className={`absolute ${language === 'ar' ? 'left-4' : 'right-4'} top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none`} size={18} />
        </div>
        </div>

        {/* Availability Filter */}
        <div>
        <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-4">{t.availability}</h3>
        <label className="flex items-center justify-between cursor-pointer group p-3 bg-gray-50 dark:bg-slate-700/50 rounded-2xl transition-all hover:bg-gray-100 dark:hover:bg-slate-700">
            <span className="text-gray-700 dark:text-gray-300 text-sm font-bold">{t.availableToday}</span>
            <div className="relative inline-block w-12 h-7 align-middle select-none transition duration-200 ease-in">
            <input 
                type="checkbox" 
                className="peer absolute block w-5 h-5 rounded-full bg-white border-4 appearance-none cursor-pointer checked:right-0 checked:border-emerald-500 transition-all duration-300 ease-in-out right-1 top-1 checked:translate-x-[-1.25rem]"
                checked={filters.availability}
                onChange={(e) => setFilters({...filters, availability: e.target.checked})}
            />
            <div className={`block overflow-hidden h-7 rounded-full cursor-pointer transition-colors ${filters.availability ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-slate-600'}`}></div>
            </div>
        </label>
        </div>
    </>
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#020617] pt-28 pb-16 transition-colors duration-300 relative">
      
      {/* Ambient Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[20%] right-[-10%] w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-[10%] left-[-10%] w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="flex flex-col gap-8 mb-8 animate-fade-in-up">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">{t.searchResults}</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium flex items-center gap-2">
                         {t.foundDoctors} <span className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 px-3 py-0.5 rounded-full font-bold">{filteredDoctors.length}</span>
                    </p>
                </div>

                <div className="flex gap-3">
                    <div className="glass p-1.5 rounded-2xl flex items-center shadow-sm">
                        <button 
                        onClick={() => setViewMode('list')}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${viewMode === 'list' ? 'bg-slate-900 dark:bg-emerald-500 text-white shadow-md transform scale-105' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
                        >
                            <List size={18} />
                            <span className="hidden sm:inline">{t.listView}</span>
                        </button>
                        <button 
                        onClick={() => setViewMode('map')}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${viewMode === 'map' ? 'bg-slate-900 dark:bg-emerald-500 text-white shadow-md transform scale-105' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
                        >
                            <MapIcon size={18} />
                            <span className="hidden sm:inline">{t.mapView}</span>
                        </button>
                    </div>

                    <button 
                        onClick={() => setIsFiltersOpen(true)}
                        className="lg:hidden glass p-3 rounded-2xl text-slate-700 dark:text-white shadow-sm"
                    >
                        <SlidersHorizontal size={24} />
                        {(filters.specialty || filters.city || filters.availability) && (
                            <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>
                        )}
                    </button>
                    
                     <button 
                        onClick={() => setIsDesktopFiltersVisible(!isDesktopFiltersVisible)}
                        className="hidden lg:flex glass p-3 rounded-2xl text-slate-700 dark:text-white shadow-sm hover:bg-white/50 transition-colors"
                        title="Toggle Filters"
                    >
                        {isDesktopFiltersVisible ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
                    </button>
                </div>
            </div>
        </div>

        <div className="flex gap-8 items-start relative">
          
          <div className={`hidden lg:block transition-all duration-500 ease-in-out ${isDesktopFiltersVisible ? 'w-1/4 opacity-100 translate-x-0' : 'w-0 opacity-0 -translate-x-10 overflow-hidden'}`}>
            <div className="glass-card p-6 rounded-[2.5rem] sticky top-32 animate-fade-in">
               <FilterContent />
            </div>
          </div>

          <div className={`flex-1 transition-all duration-500 ${isDesktopFiltersVisible ? 'w-3/4' : 'w-full'}`}>
            {viewMode === 'map' ? (
              <MapView 
                doctors={filteredDoctors} 
                onBook={onSelectDoctor} 
              />
            ) : (
              filteredDoctors.length > 0 ? (
                  <div className={`grid gap-6 animate-fade-in ${isDesktopFiltersVisible ? 'md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3' : 'md:grid-cols-3 lg:grid-cols-4'}`}>
                    {filteredDoctors.map(doctor => (
                        <div key={doctor.id} className="transform hover:-translate-y-2 transition-transform duration-300">
                            <DoctorCard 
                                doctor={doctor} 
                                onBook={onSelectDoctor}
                            />
                        </div>
                    ))}
                  </div>
              ) : (
                  <div className="flex flex-col items-center justify-center py-32 glass-card rounded-[3rem] text-center">
                      <div className="bg-slate-100 dark:bg-slate-800/50 w-24 h-24 rounded-full flex items-center justify-center mb-6 animate-bounce-slow">
                          <SearchX size={48} className="text-slate-400" />
                      </div>
                      <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">{t.noResults}</h3>
                      <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-xs mx-auto">حاول تغيير معايير البحث أو تصفح جميع الأطباء</p>
                      <button 
                        onClick={() => setFilters({specialty: '', availability: false, city: ''})}
                        className="bg-slate-900 dark:bg-emerald-500 text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all"
                      >
                          {t.clearFilters}
                      </button>
                  </div>
              )
            )}
          </div>

        </div>
      </div>

      {/* Mobile Filter Drawer */}
      <div className={`fixed inset-0 z-[100] lg:hidden transition-all duration-300 ${isFiltersOpen ? 'visible opacity-100' : 'invisible opacity-0'}`}>
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setIsFiltersOpen(false)}></div>
            <div className={`absolute bottom-0 left-0 right-0 bg-white dark:bg-slate-900 rounded-t-[2.5rem] p-8 shadow-2xl transition-transform duration-500 max-h-[85vh] overflow-y-auto ${isFiltersOpen ? 'translate-y-0' : 'translate-y-full'}`}>
                <div className="w-16 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full mx-auto mb-8"></div>
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white">{t.filter}</h2>
                    <button onClick={() => setIsFiltersOpen(false)} className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-500">
                        <X size={24} />
                    </button>
                </div>
                <FilterContent />
                <button 
                    onClick={() => setIsFiltersOpen(false)}
                    className="w-full bg-slate-900 dark:bg-emerald-500 text-white py-4 rounded-2xl font-bold text-lg mt-6 shadow-xl active:scale-95 transition-transform"
                >
                    {t.viewDetails} ({filteredDoctors.length})
                </button>
            </div>
      </div>
    </div>
  );
};

export default SearchPage;
