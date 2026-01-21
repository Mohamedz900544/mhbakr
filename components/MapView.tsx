
import React, { useState } from 'react';
import { Doctor } from '../types';
import { MapPin, X, Star, Navigation } from 'lucide-react';

interface MapViewProps {
  doctors: Doctor[];
  onBook: (doctor: Doctor) => void;
}

const MapView: React.FC<MapViewProps> = ({ doctors, onBook }) => {
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);

  return (
    <div className="bg-emerald-50 dark:bg-slate-800 rounded-[2.5rem] overflow-hidden relative shadow-lg border-4 border-white dark:border-slate-700 h-[600px] w-full animate-fade-in group">
      
      {/* Abstract Map Background */}
      <div className="absolute inset-0 bg-[#f0f4f8] dark:bg-slate-900 transition-colors">
        {/* Grid Lines */}
        <div className="absolute inset-0 opacity-10" style={{ 
            backgroundImage: 'radial-gradient(#94a3b8 1px, transparent 1px)', 
            backgroundSize: '20px 20px' 
        }}></div>

        {/* The Nile River (Stylized) */}
        <svg className="absolute inset-0 w-full h-full text-blue-200 dark:text-blue-900/30 pointer-events-none" preserveAspectRatio="none">
           <path d="M55% 100% Q52% 80% 55% 65% T53% 50%" stroke="currentColor" strokeWidth="20" fill="none" />
           <path d="M53% 50% Q45% 30% 35% 10%" stroke="currentColor" strokeWidth="15" fill="none" /> 
           <path d="M53% 50% Q65% 30% 70% 10%" stroke="currentColor" strokeWidth="15" fill="none" /> 
        </svg>

        {/* City Labels */}
        <div className="absolute top-[10%] left-[20%] text-slate-400 text-xs font-black tracking-widest opacity-50">الإسكندرية</div>
        <div className="absolute top-[60%] left-[55%] text-slate-500 text-sm font-black tracking-widest">القاهرة</div>
        <div className="absolute top-[30%] left-[45%] text-slate-400 text-xs font-black tracking-widest opacity-50">طنطا</div>
      </div>

      {/* Pins */}
      {doctors.map((doctor) => {
        if (!doctor.mapPosition) return null;
        const isSelected = selectedDoctor?.id === doctor.id;
        
        return (
          <button
            key={doctor.id}
            onClick={(e) => { e.stopPropagation(); setSelectedDoctor(doctor); }}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 group/pin focus:outline-none transition-all duration-500"
            style={{ top: doctor.mapPosition.top, left: doctor.mapPosition.left }}
          >
             <div className="relative">
                {doctor.available && (
                  <span className="absolute -inset-3 rounded-full bg-emerald-400/30 animate-ping"></span>
                )}
                
                <div className={`p-2 rounded-full shadow-xl border-4 transition-all duration-300 ${isSelected ? 'bg-slate-900 border-emerald-400 scale-125 z-30' : 'bg-white border-white dark:border-slate-700 scale-100 z-10 hover:scale-110'}`}>
                    <MapPin size={24} className={isSelected ? 'text-emerald-400 fill-current' : 'text-emerald-600'} />
                </div>

                {/* Tooltip */}
                <div className={`absolute -top-12 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg whitespace-nowrap transition-all duration-300 ${isSelected ? 'opacity-100 -translate-y-1' : 'opacity-0 translate-y-2 group-hover/pin:opacity-100 group-hover/pin:translate-y-0'}`}>
                   {doctor.name}
                   <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-900 rotate-45"></div>
                </div>
             </div>
          </button>
        );
      })}

      {/* Doctor Card Overlay */}
      {selectedDoctor && (
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 w-[90%] max-w-sm bg-white/90 dark:bg-slate-800/90 backdrop-blur-md rounded-3xl p-5 shadow-2xl border border-white/50 dark:border-slate-600 animate-fade-in-up z-40">
           <button 
             onClick={() => setSelectedDoctor(null)}
             className="absolute top-4 right-4 text-slate-400 hover:text-red-500 transition-colors"
           >
             <X size={20} />
           </button>
           
           <div className="flex gap-4">
              <img src={selectedDoctor.imageUrl} alt={selectedDoctor.name} className="w-16 h-16 rounded-2xl object-cover shadow-sm" />
              <div>
                 <h3 className="font-bold text-slate-900 dark:text-white">{selectedDoctor.name}</h3>
                 <p className="text-emerald-600 dark:text-emerald-400 text-xs font-bold mb-2">{selectedDoctor.specialty}</p>
                 <div className="flex items-center gap-1">
                    <Star size={12} className="text-yellow-400 fill-current" />
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400">{selectedDoctor.rating}</span>
                 </div>
              </div>
           </div>
           
           <div className="mt-4 flex gap-3">
               <div className="flex-1">
                   <p className="text-[10px] text-slate-400 font-bold">سعر الكشف</p>
                   <p className="font-black text-slate-900 dark:text-white">{selectedDoctor.price} ج.م</p>
               </div>
               <button 
                 onClick={() => onBook(selectedDoctor)}
                 className="flex-1 bg-slate-900 dark:bg-emerald-600 text-white py-2 rounded-xl text-xs font-bold hover:opacity-90 flex items-center justify-center gap-2"
               >
                  احجز الآن <Navigation size={12} />
               </button>
           </div>
        </div>
      )}
    </div>
  );
};

export default MapView;
