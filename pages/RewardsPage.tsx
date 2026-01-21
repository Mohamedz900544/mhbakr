
import React, { useState } from 'react';
import { Page } from '../types';
import { Award, Gift, Star, Zap, TrendingUp, Lock, CheckCircle, ArrowRight, Truck as TruckIcon, Video as VideoIcon, Scissors as ScissorsIcon, Stethoscope as StethoscopeIcon } from 'lucide-react';

interface RewardsPageProps {
  setPage: (page: Page) => void;
}

const RewardsPage: React.FC<RewardsPageProps> = ({ setPage }) => {
  const [currentPoints, setCurrentPoints] = useState(1250);
  const [showRedeemSuccess, setShowRedeemSuccess] = useState<string | null>(null);

  const nextTierPoints = 2000;
  const progress = (currentPoints / nextTierPoints) * 100;

  const rewards = [
    { id: 1, title: 'خصم 10% على الكشف', cost: 500, icon: StethoscopeIcon },
    { id: 2, title: 'توصيل مجاني للمتجر', cost: 300, icon: TruckIcon },
    { id: 3, title: 'استشارة أونلاين مجانية', cost: 1000, icon: VideoIcon },
    { id: 4, title: 'جلسة تنظيف (Grooming)', cost: 2500, icon: ScissorsIcon },
  ];

  const handleRedeem = (reward: any) => {
      if(currentPoints >= reward.cost) {
          setCurrentPoints(prev => prev - reward.cost);
          setShowRedeemSuccess(reward.title);
          setTimeout(() => setShowRedeemSuccess(null), 3000);
      }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 pt-24 pb-12 animate-fade-in font-sans">
      
      {/* Redemption Success Toast */}
      {showRedeemSuccess && (
          <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[60] bg-gray-900 dark:bg-emerald-600 text-white px-6 py-4 rounded-2xl shadow-2xl animate-fade-in-up flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-full"><CheckCircle size={20} /></div>
              <div>
                  <h4 className="font-bold text-sm">مبروك!</h4>
                  <p className="text-xs opacity-90">تم استبدال النقاط بـ "{showRedeemSuccess}" بنجاح</p>
              </div>
          </div>
      )}

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex items-center gap-2 mb-6">
            <button onClick={() => setPage(Page.LANDING)} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-colors text-gray-500 dark:text-gray-400">
                <ArrowRight size={20} />
            </button>
            <h1 className="text-2xl font-black text-gray-900 dark:text-white">برنامج ولاء البيطار</h1>
        </div>

        {/* Hero Card */}
        <div className="bg-gradient-to-br from-purple-600 to-indigo-700 rounded-[2.5rem] p-8 md:p-12 text-white shadow-2xl relative overflow-hidden mb-12">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl -mr-16 -mt-16"></div>
            <div className="relative z-10 text-center">
                <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold mb-4 border border-white/10 shadow-sm">
                    <Star size={14} className="fill-yellow-400 text-yellow-400" /> المستوى الفضي
                </div>
                <h2 className="text-5xl font-black mb-2 tracking-tight">{currentPoints}</h2>
                <p className="text-purple-200 text-sm font-bold mb-8">نقطة مكتسبة</p>

                {/* Progress Bar */}
                <div className="max-w-md mx-auto">
                    <div className="flex justify-between text-xs font-bold text-purple-200 mb-2">
                        <span>المستوى الحالي</span>
                        <span>الذهبي ({nextTierPoints})</span>
                    </div>
                    <div className="h-4 bg-black/20 rounded-full overflow-hidden backdrop-blur-sm border border-white/10">
                        <div 
                            className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 transition-all duration-1000 ease-out"
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                    <p className="text-xs mt-3 text-purple-200">باقي لك {nextTierPoints - currentPoints} نقطة للوصول للمستوى الذهبي والحصول على خصومات مضاعفة!</p>
                </div>
            </div>
        </div>

        {/* Rewards Grid */}
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <Gift className="text-purple-500" /> استبدال النقاط
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
            {rewards.map(reward => (
                <div key={reward.id} className="bg-white dark:bg-slate-800 p-6 rounded-[2rem] border border-gray-100 dark:border-slate-700 shadow-sm hover:shadow-lg transition-all flex items-center justify-between group">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-purple-50 dark:bg-purple-900/20 rounded-2xl flex items-center justify-center text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform">
                            <reward.icon size={24} />
                        </div>
                        <div>
                            <h4 className="font-bold text-gray-900 dark:text-white text-sm">{reward.title}</h4>
                            <p className="text-xs text-gray-500 dark:text-gray-400 font-bold">{reward.cost} نقطة</p>
                        </div>
                    </div>
                    <button 
                        onClick={() => handleRedeem(reward)}
                        disabled={currentPoints < reward.cost}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all transform active:scale-95 ${
                            currentPoints >= reward.cost 
                            ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-emerald-600 dark:hover:bg-emerald-400 hover:text-white' 
                            : 'bg-gray-100 dark:bg-slate-700 text-gray-400 cursor-not-allowed'
                        }`}
                    >
                        {currentPoints >= reward.cost ? 'استبدال' : <Lock size={14} />}
                    </button>
                </div>
            ))}
        </div>

        {/* How to earn */}
        <div className="bg-white dark:bg-slate-800 rounded-[2rem] p-8 border border-gray-100 dark:border-slate-700">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <Zap className="text-yellow-500 fill-current" /> كيف تجمع النقاط؟
            </h3>
            <div className="space-y-4">
                <EarnItem title="حجز موعد كشف" points="+50" />
                <EarnItem title="شراء منتجات من المتجر" points="+10 لكل 100ج" />
                <EarnItem title="تقييم الطبيب بعد الزيارة" points="+20" />
                <EarnItem title="دعوة صديق للتطبيق" points="+100" />
            </div>
        </div>

      </div>
    </div>
  );
};

const EarnItem = ({ title, points }: { title: string, points: string }) => (
    <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-slate-700/30 rounded-2xl">
        <span className="font-bold text-gray-700 dark:text-gray-300 text-sm">{title}</span>
        <span className="font-black text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/30 px-3 py-1 rounded-lg text-xs">{points}</span>
    </div>
);

export default RewardsPage;
