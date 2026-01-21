
import React from 'react';
import { Star, MapPin, Clock, Stethoscope, ChevronLeft } from 'lucide-react';
import { Doctor } from '../types';

interface DoctorCardProps {
  doctor: Doctor;
  onBook: (doctor: Doctor) => void;
}

const DoctorCard: React.FC<DoctorCardProps> = ({ doctor, onBook }) => {
  return (
    <div 
        onClick={() => onBook(doctor)}
        className="group bg-white dark:bg-slate-800 rounded-3xl p-5 border border-gray-100 dark:border-slate-700 shadow-sm hover:shadow-xl hover:border-emerald-200 dark:hover:border-emerald-900 transition-all duration-300 flex flex-col h-full relative overflow-hidden cursor-pointer hover:-translate-y-1 animate-fade-in"
    >
      
      {/* Decorative gradient blob */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 dark:bg-emerald-900/10 rounded-bl-full -mr-10 -mt-10 transition-transform group-hover:scale-150 duration-500"></div>

      {/* Availability Badge */}
      <div className="absolute top-5 left-5 z-10">
        {doctor.available ? (
           <span className="flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold px-2.5 py-1 rounded-full border border-emerald-100 dark:border-emerald-800 backdrop-blur-sm shadow-sm">
             <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
             متاح
           </span>
        ) : (
           <span className="bg-gray-50 dark:bg-slate-700 text-gray-500 dark:text-gray-400 text-[10px] font-bold px-2.5 py-1 rounded-full border border-gray-100 dark:border-slate-600">
             غير متاح
           </span>
        )}
      </div>

      <div className="flex items-start gap-4 mb-4 relative z-10">
        <div className="relative flex-shrink-0">
          <img 
            src={doctor.imageUrl} 
            alt={doctor.name} 
            className="w-16 h-16 rounded-2xl object-cover shadow-sm border border-gray-100 dark:border-slate-600 group-hover:scale-105 transition-transform duration-500"
          />
        </div>
        
        <div className="flex-1 min-w-0 pt-1">
           <div className="flex items-center gap-1 text-yellow-500 mb-1">
             <Star className="w-3 h-3 fill-current" />
             <span className="text-xs font-bold text-gray-700 dark:text-gray-200">{doctor.rating}</span>
             <span className="text-[10px] text-gray-400 dark:text-gray-500">({doctor.reviewsCount})</span>
           </div>
           <h3 className="text-base font-bold text-gray-900 dark:text-white leading-tight mb-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors truncate">{doctor.name}</h3>
           <p className="text-xs text-gray-500 dark:text-gray-400 font-medium flex items-center gap-1 truncate">
             <Stethoscope size={12} className="text-emerald-500" />
             {doctor.specialty}
           </p>
        </div>
      </div>

      <div className="border-t border-gray-50 dark:border-slate-700 pt-3 mt-auto space-y-2 relative z-10">
         <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-1.5 bg-gray-50 dark:bg-slate-700/50 px-2 py-1 rounded-lg">
               <MapPin size={12} className="text-gray-400" /> <span className="truncate max-w-[80px] font-bold">{doctor.location}</span>
            </div>
            <div className="flex items-center gap-1.5 bg-gray-50 dark:bg-slate-700/50 px-2 py-1 rounded-lg">
               <Clock size={12} className="text-gray-400" /> <span className="font-bold">{doctor.waitingTime} د</span>
            </div>
         </div>
      </div>

      <div className="mt-4 flex items-center justify-between gap-3 pt-3 relative z-10">
        <div className="flex flex-col">
           <span className="text-[10px] text-gray-400 dark:text-gray-500 font-bold">سعر الكشف</span>
           <span className="text-sm font-black text-gray-900 dark:text-emerald-400">{doctor.price} ج.م</span>
        </div>
        <button 
          onClick={(e) => {
              e.stopPropagation(); // Stop propagation to avoid double click events, though functionality is same
              onBook(doctor);
          }}
          className="flex-1 bg-gray-900 dark:bg-emerald-600 text-white py-2.5 rounded-xl text-xs font-bold hover:bg-emerald-600 dark:hover:bg-emerald-700 transition-all shadow-lg shadow-gray-200 dark:shadow-none flex items-center justify-center gap-2 group-hover:translate-x-[-2px]"
        >
          احجز الآن <ChevronLeft size={14} />
        </button>
      </div>
    </div>
  );
};

export default DoctorCard;
