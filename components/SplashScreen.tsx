
import React, { useEffect, useState } from 'react';
import { Heart, PawPrint } from 'lucide-react';

interface SplashScreenProps {
  onFinish: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [step, setStep] = useState(0); // 0: Start, 1: Paws, 2: Logo Reveal

  useEffect(() => {
    // Sequence
    const timer1 = setTimeout(() => setStep(1), 500); // Paws start
    const timer2 = setTimeout(() => setStep(2), 2500); // Logo Reveal
    const timer3 = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onFinish, 700);
    }, 4500);

    return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
    };
  }, [onFinish]);

  if (!isVisible) return null;

  return (
    <div className={`fixed inset-0 z-[9999] bg-slate-900 flex items-center justify-center transition-all duration-700 overflow-hidden ${!isVisible ? 'opacity-0 scale-110 pointer-events-none' : 'opacity-100'}`}>
      
      {/* Step 1: Walking Paws Animation */}
      {step >= 1 && step < 2 && (
          <div className="absolute inset-0 flex items-center justify-center">
              {[1, 2, 3, 4].map((i) => (
                  <div 
                    key={i}
                    className="absolute text-emerald-500 opacity-0 animate-paw-walk"
                    style={{ 
                        animationDelay: `${(i - 1) * 0.5}s`,
                        left: `${40 + (i % 2 === 0 ? 5 : -5)}%`,
                        top: `${80 - (i * 15)}%`,
                        transform: `rotate(${i % 2 === 0 ? 15 : -15}deg)`
                    }}
                  >
                      <PawPrint size={64} fill="currentColor" />
                  </div>
              ))}
          </div>
      )}

      {/* Step 2: Logo Reveal */}
      <div className={`relative flex flex-col items-center transition-all duration-700 transform ${step === 2 ? 'scale-100 opacity-100 translate-y-0' : 'scale-50 opacity-0 translate-y-10'}`}>
        
        {/* Animated Icons Container */}
        <div className="relative w-40 h-40 mb-8">
            {/* Pulsing Background */}
            <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-3xl animate-pulse-fast"></div>
            
            {/* Main Heart - Beating */}
            <div className="absolute inset-0 flex items-center justify-center animate-bounce-slow z-20">
                <Heart size={100} className="text-emerald-500 fill-current drop-shadow-[0_0_25px_rgba(16,185,129,0.6)]" />
            </div>
            
            {/* Orbiting Paw */}
            <div className="absolute -top-4 -right-4 animate-spin-slow" style={{ animationDuration: '8s' }}>
                <div className="bg-white p-3 rounded-full shadow-lg">
                    <PawPrint size={24} className="text-orange-500" />
                </div>
            </div>
        </div>

        {/* Text with Reveal Animation */}
        <div className="text-center">
            <h1 className="text-6xl font-black text-white tracking-tight mb-2 drop-shadow-xl">
                VetCare
            </h1>
            <div className="flex items-center justify-center gap-3">
                <div className="h-px w-10 bg-emerald-500/50"></div>
                <p className="text-emerald-400 font-bold tracking-[0.3em] text-xs uppercase animate-pulse">System Loading</p>
                <div className="h-px w-10 bg-emerald-500/50"></div>
            </div>
        </div>

      </div>
      
      {/* CSS for Paw Walk */}
      <style>{`
        @keyframes paw-walk {
            0% { opacity: 0; transform: scale(0.5); }
            50% { opacity: 1; transform: scale(1); }
            100% { opacity: 0; transform: scale(1.2); }
        }
        .animate-paw-walk {
            animation: paw-walk 1s ease-out forwards;
        }
        @keyframes spin-slow {
            from { transform: rotate(0deg) translateX(60px) rotate(0deg); }
            to { transform: rotate(360deg) translateX(60px) rotate(-360deg); }
        }
        .animate-spin-slow {
            animation: spin-slow 8s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default SplashScreen;
