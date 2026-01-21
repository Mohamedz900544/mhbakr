
import React, { useState, useEffect } from 'react';
import { Page, Pet, Appointment, Order, Prescription, User } from '../types';
import { MOCK_PETS } from '../constants';
import { 
  Calendar, Plus, Activity, Clock, MapPin, 
  Bell, Settings, X,
  Scan, Sparkles, Utensils, CheckCircle, Lightbulb, Camera, ArrowRight, Brain, Pill, ShoppingBag, Leaf, Syringe, Trash2
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { Language, translations } from '../lib/translations';

interface ClientDashboardProps {
  setPage: (page: Page) => void;
  user: User;
  appointments: Appointment[]; 
  orders: Order[];
  prescriptions: Prescription[];
  onDoctorClick?: (doctorName: string) => void; 
  onUpdateProfile: (updatedUser: User) => void;
  language: Language;
}

const ClientDashboard: React.FC<ClientDashboardProps> = ({ setPage, user, appointments, orders, prescriptions, onUpdateProfile, language }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'settings'>('overview');
  const [editUser, setEditUser] = useState(user);
  const t = translations[language];

  useEffect(() => {
      setEditUser(user);
  }, [user]);

  const handleSaveSettings = () => {
      onUpdateProfile(editUser);
  };

  // --- MODAL STATES ---
  const [showBMICalculator, setShowBMICalculator] = useState(false);
  const [showBreedScanner, setShowBreedScanner] = useState(false);
  const [showCalorieCalc, setShowCalorieCalc] = useState(false);
  const [showAddPetModal, setShowAddPetModal] = useState(false);
  const [showReportTranslator, setShowReportTranslator] = useState(false); 
  const [showDietPlanner, setShowDietPlanner] = useState(false);
  
  // --- FEATURE STATES ---
  // Report Translator
  const [reportText, setReportText] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [translatedReport, setTranslatedReport] = useState('');

  // Diet Planner
  const [dietPetType, setDietPetType] = useState('كلب');
  const [dietWeight, setDietWeight] = useState('');
  const [dietActivity, setDietActivity] = useState('متوسط');
  const [dietFoodType, setDietFoodType] = useState('مختلط (دراي + منزلي)');
  const [isGeneratingDiet, setIsGeneratingDiet] = useState(false);
  const [dietPlan, setDietPlan] = useState('');

  // Pets
  const [myPets, setMyPets] = useState<Pet[]>(MOCK_PETS);
  
  // New Pet Form
  const [newPetName, setNewPetName] = useState('');
  const [newPetType, setNewPetType] = useState('كلب');
  const [newPetBreed, setNewPetBreed] = useState('');
  const [newPetAge, setNewPetAge] = useState('');
  const [newPetWeight, setNewPetWeight] = useState('');

  // BMI Calculator
  const [bmiPetType, setBmiPetType] = useState<'dog' | 'cat'>('dog');
  const [bmiWeight, setBmiWeight] = useState('');
  const [bmiResult, setBmiResult] = useState<{status: string; color: string; message: string} | null>(null);

  // Calorie Calculator
  const [calWeight, setCalWeight] = useState('');
  const [calResult, setCalResult] = useState<number | null>(null);

  // Breed Scanner
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState<string | null>(null);

  // Tips
  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  const healthTips = language === 'ar' ? [
    "تطعيم السعار ضروري سنوياً للكلاب والقطط.",
    "القطط تحتاج لشرب مياه نظيفة باستمرار، جرب النافورة.",
    "الشوكولاتة سامة جداً للكلاب، تجنبها تماماً.",
    "قص الأظافر بانتظام يمنع الإصابات.",
    "الفحص الدوري كل 6 أشهر يكتشف الأمراض مبكراً."
  ] : [
    "Rabies vaccination is essential annually.",
    "Cats need fresh water constantly, try a fountain.",
    "Chocolate is toxic to dogs, avoid it completely.",
    "Regular nail trimming prevents injuries.",
    "Regular checkups every 6 months detect diseases early."
  ];

  useEffect(() => {
    const interval = setInterval(() => {
        setCurrentTipIndex((prev) => (prev + 1) % healthTips.length);
    }, 5000); 
    return () => clearInterval(interval);
  }, [language]);

  // --- LOGIC HANDLERS ---

  const handleGenerateDiet = async () => {
    if (!dietWeight) return;
    setIsGeneratingDiet(true);
    try {
        if (!process.env.API_KEY) throw new Error("API Key missing");
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const prompt = `اصنع خطة غذائية لـ ${dietPetType} وزنه ${dietWeight} كجم، نشاطه ${dietActivity}، ونوع الأكل المفضل ${dietFoodType}. الرد كنقاط مختصرة.`;
        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: prompt
        });
        setDietPlan(response.text || '');
    } catch (e) {
        setDietPlan(language === 'ar' ? "تعذر إنشاء الخطة. تأكد من الاتصال بالإنترنت." : "Could not generate plan. Check connection.");
    } finally {
        setIsGeneratingDiet(false);
    }
  };

  const handleTranslateReport = async () => {
    if (!reportText) return;
    setIsTranslating(true);
    try {
        if (!process.env.API_KEY) throw new Error("API Key missing");
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const prompt = `شرح وتبسيط هذا التقرير الطبي البيطري باللغة العربية العامية للمربي: ${reportText}`;
        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: prompt
        });
        setTranslatedReport(response.text || '');
    } catch (e) {
        setTranslatedReport("عذراً، حدث خطأ أثناء التحليل.");
    } finally {
        setIsTranslating(false);
    }
  };

  const calculateBMI = () => {
      const w = parseFloat(bmiWeight);
      if (!w) return;
      // Simple logic for demo purposes (Real BMI needs height/length)
      if (bmiPetType === 'cat') {
          if (w < 3) setBmiResult({ status: 'نحيف', color: 'text-yellow-500', message: 'يحتاج تغذية إضافية' });
          else if (w <= 5) setBmiResult({ status: 'وزن مثالي', color: 'text-emerald-500', message: 'حافظ على هذا المستوى' });
          else setBmiResult({ status: 'وزن زائد', color: 'text-red-500', message: 'يحتاج تقليل السعرات' });
      } else {
          if (w < 5) setBmiResult({ status: 'نحيف', color: 'text-yellow-500', message: 'يحتاج تغذية إضافية' });
          else if (w <= 20) setBmiResult({ status: 'وزن مثالي', color: 'text-emerald-500', message: 'حافظ على هذا المستوى' });
          else setBmiResult({ status: 'وزن زائد', color: 'text-red-500', message: 'يحتاج تقليل السعرات' });
      }
  };

  const calculateCalories = () => {
      const w = parseFloat(calWeight);
      if (!w) return;
      // RER Formula: 70 * (weight in kg ^ 0.75)
      const rer = 70 * Math.pow(w, 0.75);
      setCalResult(Math.round(rer));
  };

  const startBreedScan = () => {
      setScanning(true);
      setTimeout(() => {
          setScanning(false);
          setScanResult(language === 'ar' ? "شيرازي مون فيس (بنسبة 85%)" : "Shirazi Moon Face (85%)");
      }, 2500);
  };

  const handleAddPet = (e: React.FormEvent) => {
      e.preventDefault();
      const newPet: Pet = {
          id: Date.now().toString(),
          name: newPetName,
          type: newPetType,
          breed: newPetBreed,
          age: newPetAge,
          weight: newPetWeight + ' kg',
          image: 'https://images.unsplash.com/photo-1543852786-1cf6624b9987?auto=format&fit=crop&q=80&w=300',
          lastCheckup: 'جديد',
          nextVaccine: 'غير محدد'
      };
      setMyPets([...myPets, newPet]);
      setShowAddPetModal(false);
      setNewPetName('');
      setNewPetBreed('');
  };

  const myAppointments = appointments.filter(a => a.clientName === user.name || a.clientName === 'عميل مسجل' || a.clientName === 'Registered Client');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 pt-24 pb-12 animate-fade-in transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-3xl font-black text-gray-900 dark:text-white">{t.welcome}, {user.name} 👋</h1>
            <p className="text-gray-500 dark:text-gray-400 font-medium">Your Pet Health Dashboard</p>
          </div>
          <div className="flex gap-3">
            <button 
                onClick={() => setActiveTab(activeTab === 'overview' ? 'settings' : 'overview')}
                className={`p-3 rounded-xl shadow-sm transition-all relative group ${activeTab === 'settings' ? 'bg-gray-900 text-white' : 'bg-white dark:bg-slate-800 text-gray-600 dark:text-gray-300 hover:shadow-md'}`}
            >
               <Settings size={20} />
            </button>
            <button className="p-3 bg-white dark:bg-slate-800 rounded-xl shadow-sm hover:shadow-md transition-all text-gray-600 dark:text-gray-300 relative group">
               <Bell size={20} />
               {prescriptions.length > 0 && <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-800"></span>}
            </button>
            <button 
                onClick={() => setPage(Page.SEARCH)}
                className="bg-gray-900 dark:bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-emerald-600 dark:hover:bg-emerald-700 transition-colors flex items-center gap-2 shadow-lg shadow-gray-200 dark:shadow-none"
            >
              <Plus size={18} />
              {t.bookNow}
            </button>
          </div>
        </div>

        {activeTab === 'overview' ? (
            <>
                {/* Dynamic Health Tips */}
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-[2rem] p-8 text-white relative overflow-hidden transition-all duration-500 mb-10 shadow-lg">
                    <div className="relative z-10 flex flex-col justify-center">
                        <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                            <Lightbulb size={24} className="text-yellow-300 animate-pulse" /> 
                            Tip of the day 💡
                        </h3>
                        <p key={currentTipIndex} className="opacity-90 max-w-2xl leading-relaxed text-base font-medium animate-fade-in">
                            {healthTips[currentTipIndex]}
                        </p>
                    </div>
                    <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl"></div>
                </div>

                {/* Dashboard Grid */}
                <div className="grid lg:grid-cols-3 gap-8">
                    
                    {/* Appointments Column */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-8 shadow-sm border border-gray-100 dark:border-slate-700">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                                <Calendar className="text-emerald-500" /> {t.clientDash.appointments}
                            </h3>
                            {myAppointments.length > 0 ? (
                                <div className="space-y-4">
                                    {myAppointments.map(app => (
                                        <div key={app.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-700/50 rounded-2xl border border-gray-100 dark:border-slate-700">
                                            <div className="flex items-center gap-4">
                                                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold ${app.status === 'upcoming' ? 'bg-blue-500' : app.status === 'completed' ? 'bg-emerald-500' : 'bg-red-500'}`}>
                                                    {app.date.split('-')[2] || 'D'}
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-gray-900 dark:text-white">{app.doctorName}</h4>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">{app.doctorSpecialty} • {app.time}</p>
                                                </div>
                                            </div>
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${app.status === 'upcoming' ? 'bg-blue-100 text-blue-600' : 'bg-emerald-100 text-emerald-600'}`}>
                                                {app.status === 'upcoming' ? t.clientDash.active : t.clientDash.completed}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-10 text-gray-400">
                                    No appointments yet.
                                </div>
                            )}
                        </div>

                        {/* AI Tools Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <button onClick={() => setShowBMICalculator(true)} className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 flex flex-col items-center gap-3 hover:scale-105 transition-transform group">
                                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                    <Activity size={20} />
                                </div>
                                <span className="font-bold text-sm text-gray-700 dark:text-gray-300">BMI Calc</span>
                            </button>
                            <button onClick={() => setShowDietPlanner(true)} className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 flex flex-col items-center gap-3 hover:scale-105 transition-transform group">
                                <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center text-green-600 dark:text-green-400 group-hover:bg-green-600 group-hover:text-white transition-colors">
                                    <Leaf size={20} />
                                </div>
                                <span className="font-bold text-sm text-gray-700 dark:text-gray-300">Diet Plan</span>
                            </button>
                            <button onClick={() => setShowReportTranslator(true)} className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 flex flex-col items-center gap-3 hover:scale-105 transition-transform group">
                                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center text-purple-600 dark:text-purple-400 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                                    <Brain size={20} />
                                </div>
                                <span className="font-bold text-sm text-gray-700 dark:text-gray-300">Analyzer</span>
                            </button>
                            <button onClick={() => setShowBreedScanner(true)} className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 flex flex-col items-center gap-3 hover:scale-105 transition-transform group">
                                <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center text-orange-600 dark:text-orange-400 group-hover:bg-orange-600 group-hover:text-white transition-colors">
                                    <Camera size={20} />
                                </div>
                                <span className="font-bold text-sm text-gray-700 dark:text-gray-300">Scanner</span>
                            </button>
                        </div>
                    </div>

                    {/* Pets Column */}
                    <div className="space-y-8">
                         <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-8 shadow-sm border border-gray-100 dark:border-slate-700">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                    <Scan className="text-purple-500" /> {t.clientDash.myPets}
                                </h3>
                                <button onClick={() => setShowAddPetModal(true)} className="p-2 bg-gray-100 dark:bg-slate-700 rounded-full text-gray-600 dark:text-gray-300 hover:bg-emerald-500 hover:text-white transition-colors">
                                    <Plus size={16} />
                                </button>
                            </div>
                            {myPets.map(pet => (
                                <div key={pet.id} className="flex items-center gap-4 mb-4 p-4 bg-gray-50 dark:bg-slate-700/50 rounded-2xl">
                                    <img src={pet.image} className="w-12 h-12 rounded-full object-cover" alt={pet.name} />
                                    <div>
                                        <h4 className="font-bold text-gray-900 dark:text-white">{pet.name}</h4>
                                        <p className="text-xs text-gray-500">{pet.breed}</p>
                                    </div>
                                </div>
                            ))}
                         </div>
                    </div>

                </div>
            </>
        ) : (
            // --- SETTINGS TAB ---
            <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
                {/* Account Settings */}
                <div className="bg-white dark:bg-slate-800 rounded-[2rem] p-8 shadow-sm border border-gray-100 dark:border-slate-700">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <Settings className="text-gray-400" /> {t.dashboard.settings}
                        </h2>
                        <button onClick={() => setActiveTab('overview')} className="text-gray-400 hover:text-emerald-500">
                            <X size={20} />
                        </button>
                    </div>
                    
                    <div className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-500 mb-2">Name</label>
                                <input 
                                    type="text" 
                                    value={editUser.name} 
                                    onChange={(e) => setEditUser({...editUser, name: e.target.value})}
                                    className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl p-4 font-bold text-gray-900 dark:text-white focus:outline-none focus:border-emerald-500 transition-colors" 
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-bold text-gray-500 mb-2">Email</label>
                                <input 
                                    type="email" 
                                    value={editUser.email} 
                                    disabled
                                    className="w-full bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-4 font-bold text-gray-500 dark:text-gray-400 cursor-not-allowed" 
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-500 mb-2">Phone</label>
                                <input 
                                    type="text" 
                                    value={editUser.phone || ''} 
                                    onChange={(e) => setEditUser({...editUser, phone: e.target.value})}
                                    placeholder="Add Phone Number"
                                    className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl p-4 font-bold text-gray-900 dark:text-white focus:outline-none focus:border-emerald-500 transition-colors" 
                                />
                            </div>
                        </div>
                        <button onClick={handleSaveSettings} className="w-full bg-emerald-600 text-white py-3 rounded-xl font-bold hover:bg-emerald-700 transition-colors">
                            {t.save}
                        </button>
                    </div>
                </div>
            </div>
        )}

        {/* MODALS */}
        {showAddPetModal && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-sm p-6 relative">
                    <button onClick={() => setShowAddPetModal(false)} className="absolute top-4 right-4 text-gray-400"><X size={20}/></button>
                    <h3 className="text-xl font-bold mb-4 dark:text-white">إضافة حيوان جديد</h3>
                    <form onSubmit={handleAddPet} className="space-y-4">
                        <input value={newPetName} onChange={e => setNewPetName(e.target.value)} placeholder="الاسم" className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl p-3" required />
                        <input value={newPetBreed} onChange={e => setNewPetBreed(e.target.value)} placeholder="السلالة" className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl p-3" />
                        <button type="submit" className="w-full bg-emerald-500 text-white py-3 rounded-xl font-bold">حفظ</button>
                    </form>
                </div>
            </div>
        )}

        {showDietPlanner && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-md p-6 relative">
                    <button onClick={() => setShowDietPlanner(false)} className="absolute top-4 right-4 text-gray-400"><X size={20}/></button>
                    <h3 className="text-xl font-bold mb-4 dark:text-white flex items-center gap-2"><Utensils size={20} className="text-green-500"/> مخطط الوجبات الذكي</h3>
                    
                    {!dietPlan ? (
                        <div className="space-y-4">
                            <input value={dietWeight} onChange={e => setDietWeight(e.target.value)} placeholder="الوزن (كجم)" type="number" className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl p-3 dark:text-white" />
                            <select value={dietActivity} onChange={e => setDietActivity(e.target.value)} className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl p-3 dark:text-white">
                                <option>كسول (نوم كثير)</option>
                                <option>متوسط (لعب عادي)</option>
                                <option>نشيط جداً</option>
                            </select>
                            <button onClick={handleGenerateDiet} disabled={isGeneratingDiet} className="w-full bg-green-600 text-white py-3 rounded-xl font-bold">
                                {isGeneratingDiet ? 'جاري التحليل...' : 'إنشاء الخطة'}
                            </button>
                        </div>
                    ) : (
                        <div className="animate-fade-in">
                            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl text-sm leading-relaxed mb-4 max-h-60 overflow-y-auto whitespace-pre-wrap dark:text-green-100">
                                {dietPlan}
                            </div>
                            <button onClick={() => setDietPlan('')} className="w-full bg-gray-200 dark:bg-slate-700 text-gray-800 dark:text-white py-2 rounded-xl font-bold">إعادة</button>
                        </div>
                    )}
                </div>
            </div>
        )}

      </div>
    </div>
  );
};

export default ClientDashboard;
