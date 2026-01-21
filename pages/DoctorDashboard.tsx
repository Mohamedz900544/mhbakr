
import React, { useState, useEffect } from 'react';
import { Page, Appointment, Prescription, Doctor, Specialty } from '../types';
import { 
    Calendar, Clock, User, Check, X, DollarSign, Activity, 
    TrendingUp, Filter, MapPin, Search, MoreHorizontal, 
    Bell, ChevronLeft, Stethoscope, AlertCircle, FilePlus, PauseCircle, Mic, EyeOff, Eye,
    Users, Briefcase, FileText, ChevronRight, Settings, Phone, CalendarDays, Wallet, Star, PieChart, HelpCircle, Mail, MessageSquare, Plus, CheckCircle, Video, FileBarChart, Download, Pill, Trash2, Save, History as HistoryIcon, Syringe, FileClock, Sparkles, Loader2, Lock, ArrowUpRight
} from 'lucide-react';
import { Language, translations } from '../lib/translations';

interface DoctorDashboardProps {
  setPage: (page: Page) => void;
  initialTab?: 'overview' | 'patients' | 'financial' | 'schedule' | 'settings' | 'support';
  doctorProfile: Doctor;
  requests: Appointment[];
  appointments: Appointment[]; 
  onAction: (id: string, action: 'accept' | 'reject') => void;
  onAddPrescription: (prescription: Prescription) => void;
  onUpdateProfile: (updatedDoctor: Doctor) => void;
  language: Language;
}

const DoctorDashboard: React.FC<DoctorDashboardProps> = ({ setPage, initialTab = 'overview', doctorProfile, appointments, onAction, onAddPrescription, onUpdateProfile, language }) => {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [focusMode, setFocusMode] = useState(false);
  const [editForm, setEditForm] = useState(doctorProfile);
  
  const t = translations[language];

  // Patient details state
  const [selectedPatientName, setSelectedPatientName] = useState<string | null>(null);

  // Derived Statistics from live appointments
  const totalPatients = new Set(appointments.map(a => a.clientName || a.petName)).size;
  const pendingRequests = appointments.filter(a => a.status === 'upcoming').length;
  const completedAppointments = appointments.filter(a => a.status === 'completed');
  const totalRevenue = completedAppointments.reduce((acc, curr) => acc + (curr.price || 0), 0);

  // Filtered Lists
  const upcomingAppointments = appointments.filter(a => a.status === 'upcoming');
  const pastAppointments = appointments.filter(a => a.status === 'completed' || a.status === 'cancelled');

  useEffect(() => {
      if(initialTab) setActiveTab(initialTab);
  }, [initialTab]);

  useEffect(() => {
      setEditForm(doctorProfile);
  }, [doctorProfile]);

  const handleProfileUpdate = () => {
      onUpdateProfile(editForm);
  };

  // --- RESTRICTED ACCESS VIEW (PENDING) ---
  if (!doctorProfile.verified) {
      return (
          <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 text-center">
              <div className="bg-slate-800 p-10 rounded-[2.5rem] shadow-2xl max-w-lg w-full border border-slate-700 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-purple-600"></div>
                  <div className="w-24 h-24 bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Lock size={40} className="text-blue-400" />
                  </div>
                  <h1 className="text-3xl font-black text-white mb-4">حسابك قيد المراجعة</h1>
                  <p className="text-slate-400 mb-8 leading-relaxed">
                      شكراً لتسجيلك يا دكتور <b>{doctorProfile.name}</b>. يقوم فريق الإدارة حالياً بمراجعة أوراق اعتمادك وتراخيص العيادة.
                      <br/><br/>
                      ستصلك رسالة تأكيد فور تفعيل الحساب لتتمكن من إدارة عيادتك واستقبال الحجوزات.
                  </p>
                  <button onClick={() => setPage(Page.LANDING)} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold transition-colors">
                      {t.back}
                  </button>
              </div>
          </div>
      );
  }

  // --- APPROVED DOCTOR DASHBOARD ---
  return (
    <div className={`min-h-screen bg-[#f8fafc] dark:bg-slate-900 pb-12 font-sans transition-colors duration-300 ${focusMode ? 'dark:bg-black bg-white' : ''}`}>
      
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8">
            
            {/* Left Sidebar Menu */}
            {!focusMode && (
                <div className="w-full lg:w-72 flex-shrink-0 space-y-6 pt-8">
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-[2.5rem] shadow-xl shadow-gray-100 dark:shadow-slate-900/50 border border-gray-100 dark:border-slate-700 text-center relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-br from-blue-500 to-indigo-600"></div>
                        <div className="w-24 h-24 mx-auto bg-white p-1.5 rounded-full relative z-10 -mt-12 mb-4 shadow-lg">
                            <img src={doctorProfile.imageUrl} className="w-full h-full rounded-full object-cover" alt="Profile" />
                            <span className="absolute bottom-1 right-1 w-5 h-5 bg-emerald-500 border-4 border-white rounded-full"></span>
                        </div>
                        <h2 className="font-black text-xl text-gray-900 dark:text-white mb-1">{doctorProfile.name}</h2>
                        <p className="text-sm font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 py-1 px-3 rounded-full inline-block mb-4">{doctorProfile.specialty}</p>
                        
                        <div className="grid grid-cols-2 gap-4 border-t border-gray-100 dark:border-slate-700 pt-4 mt-2">
                            <div>
                                <p className="text-xs text-gray-400 font-bold">Rate</p>
                                <div className="flex items-center justify-center gap-1 text-yellow-500 font-black">
                                    {doctorProfile.rating} <Star size={12} fill="currentColor" />
                                </div>
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 font-bold">Bookings</p>
                                <p className="font-black text-gray-900 dark:text-white">{appointments.length}</p>
                            </div>
                        </div>
                    </div>

                    <nav className="space-y-2">
                        {[
                            { id: 'overview', label: t.dashboard.overview, icon: Activity },
                            { id: 'schedule', label: t.dashboard.schedule, icon: CalendarDays, badge: pendingRequests },
                            { id: 'patients', label: t.dashboard.patients, icon: Users },
                            { id: 'financial', label: t.dashboard.financial, icon: Wallet },
                            { id: 'settings', label: t.dashboard.settings, icon: Settings },
                        ].map((item) => (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id as any)}
                                className={`w-full flex items-center justify-between px-6 py-4 rounded-[20px] text-sm font-bold transition-all relative overflow-hidden group ${
                                    activeTab === item.id 
                                    ? 'bg-gray-900 dark:bg-white text-white dark:text-slate-900 shadow-lg shadow-gray-200 dark:shadow-none' 
                                    : 'bg-transparent text-gray-500 dark:text-gray-400 hover:bg-white dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-white'
                                }`}
                            >
                                <div className="flex items-center gap-4">
                                    <item.icon size={20} className={`transition-transform group-hover:scale-110 ${activeTab === item.id ? 'text-emerald-400 dark:text-blue-600' : ''}`} />
                                    {item.label}
                                </div>
                                {item.badge && item.badge > 0 && (
                                    <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">{item.badge}</span>
                                )}
                            </button>
                        ))}
                    </nav>
                </div>
            )}

            {/* Main Content Area */}
            <div className="flex-1 min-w-0 pt-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4 py-4 border-b border-transparent transition-colors">
                    <div>
                        <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-2 flex items-center gap-3">
                            {activeTab === 'overview' && t.dashboard.overview}
                            {activeTab === 'schedule' && t.dashboard.schedule}
                            {activeTab === 'patients' && t.dashboard.patients}
                            {activeTab === 'financial' && t.dashboard.financial}
                            {activeTab === 'settings' && t.dashboard.settings}
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">{t.welcome}, Doc.</p>
                    </div>
                </div>

                {/* --- OVERVIEW TAB --- */}
                {activeTab === 'overview' && (
                    <div className="animate-fade-in space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {[
                                { title: t.dashboard.todayReq, val: pendingRequests, icon: Bell, color: 'bg-blue-500' },
                                { title: t.dashboard.totalPatients, val: totalPatients, icon: Users, color: 'bg-purple-500' },
                                { title: t.dashboard.revenue, val: `${totalRevenue} ${t.currency}`, icon: TrendingUp, color: 'bg-emerald-500' }
                            ].map((stat, i) => (
                                <div key={i} className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-700 relative overflow-hidden group">
                                    <div className={`absolute top-0 right-0 w-20 h-20 opacity-10 rounded-bl-3xl ${stat.color}`}></div>
                                    <div className="relative z-10">
                                        <div className={`w-12 h-12 rounded-xl ${stat.color} bg-opacity-20 flex items-center justify-center mb-4 text-white`}>
                                            <stat.icon size={24} className={stat.color.replace('bg-', 'text-')} />
                                        </div>
                                        <h3 className="text-3xl font-black text-gray-900 dark:text-white mb-1">{stat.val}</h3>
                                        <p className="text-gray-400 text-xs font-bold">{stat.title}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {upcomingAppointments.length > 0 ? (
                            <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-8 border border-gray-100 dark:border-slate-700">
                                <h3 className="font-bold text-lg mb-6 text-gray-900 dark:text-white">{t.dashboard.upcomingAppt}</h3>
                                <div className="space-y-4">
                                    {upcomingAppointments.slice(0, 3).map(apt => (
                                        <div key={apt.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-700/50 rounded-2xl border border-gray-100 dark:border-slate-700">
                                            <div className="flex items-center gap-4">
                                                <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 p-3 rounded-full font-bold">
                                                    {(apt.time || '').split(' ')[0]}
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-gray-900 dark:text-white">{apt.clientName || 'Unregistered'}</h4>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">{apt.petName} • {apt.date}</p>
                                                </div>
                                            </div>
                                            <button 
                                                onClick={() => setActiveTab('schedule')}
                                                className="text-sm font-bold text-blue-600 hover:underline"
                                            >
                                                {t.viewDetails}
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-[2.5rem] border border-dashed border-gray-200 dark:border-slate-700">
                                <Calendar size={48} className="mx-auto text-gray-300 dark:text-slate-600 mb-4" />
                                <p className="text-gray-500 dark:text-gray-400 font-bold">{t.noResults}</p>
                            </div>
                        )}
                    </div>
                )}

                {/* --- SCHEDULE TAB --- */}
                {activeTab === 'schedule' && (
                    <div className="animate-fade-in space-y-8">
                        {upcomingAppointments.length === 0 && pastAppointments.length === 0 ? (
                            <div className="text-center py-20">
                                <p className="text-gray-500">{t.noResults}</p>
                            </div>
                        ) : (
                            <>
                                <div className="space-y-4">
                                    <h3 className="font-black text-xl text-gray-900 dark:text-white flex items-center gap-2">
                                        <Clock className="text-blue-500"/> {t.dashboard.upcomingAppt} ({upcomingAppointments.length})
                                    </h3>
                                    {upcomingAppointments.map(apt => (
                                        <div key={apt.id} className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-700 flex flex-col md:flex-row justify-between items-center gap-6">
                                            <div className="flex items-center gap-6 w-full md:w-auto">
                                                <div className="text-center min-w-[80px]">
                                                    <span className="block text-2xl font-black text-blue-600 dark:text-blue-400">{apt.time}</span>
                                                    <span className="text-xs font-bold text-gray-400">{apt.date}</span>
                                                </div>
                                                <div className="h-10 w-px bg-gray-200 dark:bg-slate-700 hidden md:block"></div>
                                                <div>
                                                    <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-1">{apt.clientName || 'Guest'}</h4>
                                                    <div className="flex gap-3 text-sm text-gray-500 dark:text-gray-400">
                                                        <span className="flex items-center gap-1"><User size={14}/> {apt.petName}</span>
                                                        <span className="flex items-center gap-1"><DollarSign size={14}/> {apt.price} {t.currency}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex gap-3 w-full md:w-auto">
                                                <button 
                                                    onClick={() => onAction(apt.id, 'reject')}
                                                    className="flex-1 md:flex-none px-6 py-3 rounded-xl border border-red-100 dark:border-red-900/30 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 font-bold transition-colors"
                                                >
                                                    {t.dashboard.reject}
                                                </button>
                                                <button 
                                                    onClick={() => onAction(apt.id, 'accept')}
                                                    className="flex-1 md:flex-none px-8 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold transition-colors shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
                                                >
                                                    <CheckCircle size={18} /> {t.dashboard.complete}
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {pastAppointments.length > 0 && (
                                    <div className="pt-8 border-t border-gray-200 dark:border-slate-800">
                                        <h3 className="font-bold text-lg text-gray-500 mb-6">{t.clientDash.completed}</h3>
                                        <div className="space-y-3 opacity-70 hover:opacity-100 transition-opacity">
                                            {pastAppointments.map(apt => (
                                                <div key={apt.id} className="flex justify-between items-center p-4 bg-gray-50 dark:bg-slate-800/50 rounded-2xl">
                                                    <div className="flex items-center gap-4">
                                                        <div className={`w-3 h-3 rounded-full ${apt.status === 'completed' ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
                                                        <span className="font-bold text-gray-700 dark:text-gray-300">{apt.date}</span>
                                                        <span className="text-gray-500 text-sm">{apt.clientName} - {apt.petName}</span>
                                                    </div>
                                                    <span className={`text-xs font-bold px-3 py-1 rounded-lg ${apt.status === 'completed' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                                                        {apt.status === 'completed' ? t.dashboard.complete : t.dashboard.reject}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                )}

                {/* --- PATIENTS TAB --- */}
                {activeTab === 'patients' && (
                    <div className="animate-fade-in">
                        <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] overflow-hidden border border-gray-100 dark:border-slate-700 shadow-sm">
                            <div className="p-6 border-b border-gray-100 dark:border-slate-700">
                                <h3 className="font-bold text-lg text-gray-900 dark:text-white">{t.dashboard.patients}</h3>
                            </div>
                            {appointments.length > 0 ? (
                                <table className="w-full text-right text-sm">
                                    <thead className="bg-gray-50 dark:bg-slate-900 text-gray-500 dark:text-gray-400 font-bold">
                                        <tr>
                                            <th className="p-5">{t.dashboard.client}</th>
                                            <th className="p-5">{t.dashboard.pet}</th>
                                            <th className="p-5">{t.dashboard.date}</th>
                                            <th className="p-5">{t.dashboard.status}</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
                                        {/* Creating Unique Patient List based on Client Name + Pet Name */}
                                        {Array.from(new Set(appointments.map(a => `${a.clientName || 'Unknown'}|${a.petName}`)))
                                            .map((uniqueKey) => {
                                                const [client, pet] = (uniqueKey as string).split('|');
                                                const lastAppt = appointments.find(a => (a.clientName || 'Unknown') === client && a.petName === pet);
                                                return (
                                                    <tr key={uniqueKey as string} className="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
                                                        <td className="p-5 font-bold text-gray-900 dark:text-white">{client}</td>
                                                        <td className="p-5 text-gray-600 dark:text-gray-300">{pet}</td>
                                                        <td className="p-5 text-gray-500">{lastAppt?.date}</td>
                                                        <td className="p-5">
                                                            <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-3 py-1 rounded-full text-xs font-bold">{t.clientDash.active}</span>
                                                        </td>
                                                    </tr>
                                                );
                                            })
                                        }
                                    </tbody>
                                </table>
                            ) : (
                                <div className="p-10 text-center text-gray-500">{t.noResults}</div>
                            )}
                        </div>
                    </div>
                )}

                {/* --- FINANCIAL TAB --- */}
                {activeTab === 'financial' && (
                    <div className="animate-fade-in space-y-6">
                        <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-xl">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl -mr-16 -mt-16"></div>
                            <div className="relative z-10">
                                <p className="font-bold opacity-80 mb-2">{t.dashboard.revenue}</p>
                                <h2 className="text-5xl font-black mb-6">{totalRevenue} <span className="text-xl">{t.currency}</span></h2>
                                <div className="flex gap-4">
                                    <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-xl text-sm font-bold border border-white/10">
                                        {completedAppointments.length} Appts
                                    </div>
                                    <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-xl text-sm font-bold border border-white/10">
                                        Avg: {completedAppointments.length > 0 ? Math.round(totalRevenue / completedAppointments.length) : 0} {t.currency}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-8 border border-gray-100 dark:border-slate-700">
                            <h3 className="font-bold text-lg mb-6 text-gray-900 dark:text-white">{t.dashboard.recentTrans}</h3>
                            {completedAppointments.length > 0 ? (
                                <div className="space-y-4">
                                    {completedAppointments.map(apt => (
                                        <div key={apt.id} className="flex justify-between items-center p-4 bg-gray-50 dark:bg-slate-700/50 rounded-2xl">
                                            <div className="flex items-center gap-4">
                                                <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-full text-green-600 dark:text-green-400">
                                                    <ArrowUpRight size={20} />
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-gray-900 dark:text-white">{apt.clientName}</h4>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">{apt.date} • {apt.time}</p>
                                                </div>
                                            </div>
                                            <span className="font-black text-emerald-600 dark:text-emerald-400">+{apt.price} {t.currency}</span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-center text-gray-500 py-4">{t.noResults}</p>
                            )}
                        </div>
                    </div>
                )}

                {/* --- SETTINGS TAB (UPDATED) --- */}
                {activeTab === 'settings' && (
                    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in relative z-10">
                        <div className="bg-white dark:bg-slate-800 rounded-[2rem] p-8 shadow-sm border border-gray-100 dark:border-slate-700">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                                <Settings className="text-gray-400" /> {t.dashboard.settings}
                            </h2>
                            <div className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-500 mb-2">Name</label>
                                        <input 
                                            type="text" 
                                            value={editForm.name} 
                                            onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                                            className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl p-4 font-bold text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 transition-colors" 
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-500 mb-2">Specialty</label>
                                        <select 
                                            value={editForm.specialty} 
                                            onChange={(e) => setEditForm({...editForm, specialty: e.target.value})}
                                            className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl p-4 font-bold text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 transition-colors"
                                        >
                                            {Object.values(Specialty).map(s => <option key={s} value={s}>{s}</option>)}
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-500 mb-2">Address</label>
                                    <input 
                                        type="text" 
                                        value={editForm.location} 
                                        onChange={(e) => setEditForm({...editForm, location: e.target.value})}
                                        className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl p-4 font-bold text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 transition-colors" 
                                    />
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-500 mb-2">Price</label>
                                        <input 
                                            type="number" 
                                            value={editForm.price} 
                                            onChange={(e) => setEditForm({...editForm, price: parseFloat(e.target.value)})}
                                            className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl p-4 font-bold text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 transition-colors" 
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-500 mb-2">Waiting Time (mins)</label>
                                        <input 
                                            type="number" 
                                            value={editForm.waitingTime} 
                                            onChange={(e) => setEditForm({...editForm, waitingTime: parseInt(e.target.value)})}
                                            className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl p-4 font-bold text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 transition-colors" 
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-500 mb-2">Bio</label>
                                    <textarea 
                                        value={editForm.bio} 
                                        onChange={(e) => setEditForm({...editForm, bio: e.target.value})}
                                        className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl p-4 font-bold text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 transition-colors h-32" 
                                    />
                                </div>

                                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-900 rounded-xl">
                                    <span className="font-bold text-gray-900 dark:text-white">Status (Available)</span>
                                    <button 
                                        onClick={() => setEditForm({...editForm, available: !editForm.available})}
                                        className={`w-12 h-6 rounded-full relative transition-colors ${editForm.available ? 'bg-blue-600' : 'bg-gray-300'}`}
                                    >
                                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${editForm.available ? 'left-1' : 'right-1'}`}></div>
                                    </button>
                                </div>

                                <button 
                                    onClick={handleProfileUpdate}
                                    className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg"
                                >
                                    {t.save}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
