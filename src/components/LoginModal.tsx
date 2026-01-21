
import React, { useState, useEffect } from 'react';
import { X, Mail, Lock, LogIn, Heart, Stethoscope, User, ArrowRight, Loader2, ShieldCheck, Smartphone, Shield, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { UserRole, Specialty } from '../types';
import { api } from '../services/api';
import { Language, translations } from '../lib/translations';

interface LoginModalProps {
  onClose: () => void;
  onLogin: (data: any) => void;
  initialRole?: UserRole | null;
  initialMode?: 'login' | 'register';
  language: Language;
}

const LoginModal: React.FC<LoginModalProps> = ({ onClose, onLogin, initialRole, initialMode = 'login', language }) => {
  const [view, setView] = useState<'role' | 'login' | 'forgot' | 'verify' | 'reset'>('role');
  const [selectedRole, setSelectedRole] = useState<UserRole>(initialRole || UserRole.CLIENT);
  const [isRegister, setIsRegister] = useState(initialMode === 'register');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const t = translations[language].auth;
  const tCommon = translations[language];

  // Form Fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  
  // Doctor Specific
  const [specialty, setSpecialty] = useState('');
  const [location, setLocation] = useState('');
  const [phone, setPhone] = useState('');
  const [license, setLicense] = useState('');

  // Forgot Password State
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');

  useEffect(() => {
      if (initialRole) {
          setSelectedRole(initialRole);
          setView('login');
      }
      setIsRegister(initialMode === 'register');
  }, [initialRole, initialMode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
        // --- STRICT ADMIN CHECK ---
        if (selectedRole === UserRole.ADMIN) {
            if (email !== 'admin@vetcare.com' || password !== 'admin123') {
                throw new Error(t.adminError);
            }
        }

        let response;
        const effectiveRole = selectedRole; 

        if (isRegister) {
            // Admins cannot register via public form, they must be created in backend or pre-seeded.
            // But for this demo we allow it only if they pass the check above (which effectively restricts it to the specific email).
            // However, typically Admin registration is disabled. 
            // Since we validated creds above for admin, we can proceed or block registration.
            if (selectedRole === UserRole.ADMIN && email === 'admin@vetcare.com') {
                 // Allow "logging in" even if they clicked create account, simply treat as login
                 response = { 
                     name: 'Super Admin', 
                     email: 'admin@vetcare.com', 
                     role: UserRole.ADMIN,
                     token: 'admin_token'
                 };
            } else {
                response = await api.auth.register({
                    role: effectiveRole,
                    email,
                    password,
                    name: name || (effectiveRole === UserRole.DOCTOR ? 'Doctor' : 'User'),
                    ...(effectiveRole === UserRole.DOCTOR && { specialty, location, phone, license })
                });
            }
        } else {
            response = await api.auth.login({ email, password, role: effectiveRole });
        }

        onLogin({
            ...response,
            role: response.role || effectiveRole, 
            isRegister
        });
        
    } catch (err: any) {
        setError(err.message || 'Authentication failed');
    } finally {
        setLoading(false);
    }
  };

  // Mock Handlers for Reset Flow
  const handleSendResetCode = (e: React.FormEvent) => { e.preventDefault(); setLoading(true); setTimeout(() => { setLoading(false); alert(`Code: 1234`); setView('verify'); }, 1500); };
  const handleVerifyCode = (e: React.FormEvent) => { e.preventDefault(); setLoading(true); setTimeout(() => { setLoading(false); if (resetCode === '1234') { setView('reset'); } else { setError('Invalid Code'); } }, 1000); };
  const handleResetPassword = (e: React.FormEvent) => { e.preventDefault(); setLoading(true); setTimeout(() => { setLoading(false); setView('login'); alert("Password Changed!"); }, 1500); };

  const isDoctor = selectedRole === UserRole.DOCTOR;
  const isAdmin = selectedRole === UserRole.ADMIN;

  const isRtl = language === 'ar';

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/80 backdrop-blur-xl p-4 animate-fade-in" dir={isRtl ? 'rtl' : 'ltr'}>
       
       <div className="relative w-full max-w-5xl h-[650px] bg-white dark:bg-slate-950 rounded-[3rem] shadow-2xl flex overflow-hidden border border-white/10 dark:border-slate-800">
          <button 
             onClick={onClose}
             className={`absolute top-6 p-2 rounded-full bg-slate-100/50 hover:bg-slate-200 dark:bg-slate-800/50 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-300 transition-colors z-50 backdrop-blur-md ${isRtl ? 'left-6' : 'right-6'}`}
           >
             <X size={24} />
           </button>

          {/* Left Side - Visual & Info */}
          <div className={`hidden lg:flex w-1/2 relative flex-col justify-between p-12 text-white overflow-hidden transition-all duration-700 ease-in-out ${isDoctor ? 'bg-blue-600' : isAdmin ? 'bg-slate-900' : 'bg-emerald-500'}`}>
              
              <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] animate-pulse-slow"></div>
              <div className="absolute top-[-20%] right-[-20%] w-[500px] h-[500px] bg-white opacity-10 rounded-full blur-[100px] animate-blob"></div>
              <div className="absolute bottom-[-20%] left-[-20%] w-[500px] h-[500px] bg-black opacity-10 rounded-full blur-[100px] animate-blob animation-delay-4000"></div>
              
              <div className="relative z-10 mt-10">
                  <div className={`w-20 h-20 bg-white/20 backdrop-blur-md rounded-3xl flex items-center justify-center mb-8 shadow-xl border border-white/20 transform transition-transform hover:scale-110 duration-500`}>
                      {isAdmin ? <Shield size={40} className="text-white"/> : isDoctor ? <Stethoscope size={40} className="text-white"/> : <Heart size={40} className="text-white fill-current"/>}
                  </div>
                  <h1 className="text-5xl font-black mb-6 leading-tight tracking-tight">
                      {isAdmin ? t.adminDesc : isDoctor ? t.doctorDesc : t.welcomeBack}
                  </h1>
                  <p className="text-lg opacity-90 font-medium leading-relaxed max-w-sm">
                      {isAdmin 
                        ? t.adminRestricted
                        : isDoctor 
                            ? (language === 'ar' ? 'تواصل مع مربي الحيوانات، أدر مواعيدك، وقم بتنمية عيادتك.' : 'Connect with pet owners, manage appointments, and grow your practice.')
                            : (language === 'ar' ? 'انضم لأكبر مجتمع لمربي الحيوانات. الرعاية المتخصصة على بعد ضغطة زر.' : 'Join the largest community of pet lovers. Expert care is just a click away.')}
                  </p>
              </div>
          </div>

          {/* Right Side - Forms */}
          <div className="w-full lg:w-1/2 p-8 md:p-16 overflow-y-auto relative bg-slate-50 dark:bg-slate-950 flex flex-col justify-center">
             
             {view === 'role' && (
                <div className="h-full flex flex-col justify-center animate-fade-in-up">
                    <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-3 text-center">{t.createAccount}</h2>
                    
                    <div className="space-y-4 max-w-md mx-auto w-full mt-8">
                        <button onClick={() => { setSelectedRole(UserRole.CLIENT); setIsRegister(false); setView('login'); }} className="group w-full bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 hover:border-emerald-500 dark:hover:border-emerald-500 p-5 rounded-[2rem] flex items-center gap-5 transition-all hover:shadow-xl hover:-translate-y-1">
                            <div className="bg-emerald-100 dark:bg-emerald-900/30 p-4 rounded-2xl text-emerald-600 dark:text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white transition-colors"><User size={28} /></div>
                            <div className="text-right flex-1">
                                <h3 className="font-black text-lg text-slate-900 dark:text-white">{t.petOwner}</h3>
                                <p className="text-xs font-bold text-slate-400 group-hover:text-emerald-500/70 transition-colors">{t.petOwnerDesc}</p>
                            </div>
                            {isRtl ? <ArrowLeft className="text-slate-300 group-hover:text-emerald-500 transition-colors" /> : <ArrowRight className="text-slate-300 group-hover:text-emerald-500 transition-colors" />}
                        </button>

                        <button onClick={() => { setSelectedRole(UserRole.DOCTOR); setIsRegister(false); setView('login'); }} className="group w-full bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 p-5 rounded-[2rem] flex items-center gap-5 transition-all hover:shadow-xl hover:-translate-y-1">
                            <div className="bg-blue-100 dark:bg-blue-900/30 p-4 rounded-2xl text-blue-600 dark:text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-colors"><Stethoscope size={28} /></div>
                            <div className="text-right flex-1">
                                <h3 className="font-black text-lg text-slate-900 dark:text-white">{t.doctor}</h3>
                                <p className="text-xs font-bold text-slate-400 group-hover:text-blue-500/70 transition-colors">{t.doctorDesc}</p>
                            </div>
                            {isRtl ? <ArrowLeft className="text-slate-300 group-hover:text-emerald-500 transition-colors" /> : <ArrowRight className="text-slate-300 group-hover:text-emerald-500 transition-colors" />}
                        </button>

                        <button onClick={() => { setSelectedRole(UserRole.ADMIN); setIsRegister(false); setView('login'); }} className="group w-full bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 hover:border-slate-600 dark:hover:border-slate-500 p-5 rounded-[2rem] flex items-center gap-5 transition-all hover:shadow-xl hover:-translate-y-1">
                            <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-2xl text-slate-600 dark:text-slate-400 group-hover:bg-slate-800 group-hover:text-white transition-colors"><ShieldCheck size={28} /></div>
                            <div className="text-right flex-1">
                                <h3 className="font-black text-lg text-slate-900 dark:text-white">{t.admin}</h3>
                                <p className="text-xs font-bold text-slate-400 group-hover:text-slate-500/70 transition-colors">{t.adminDesc}</p>
                            </div>
                            {isRtl ? <ArrowLeft className="text-slate-300 group-hover:text-emerald-500 transition-colors" /> : <ArrowRight className="text-slate-300 group-hover:text-emerald-500 transition-colors" />}
                        </button>
                    </div>
                </div>
             )}

             {view === 'login' && (
                <div className="h-full flex flex-col justify-center animate-fade-in-up max-w-sm mx-auto w-full">
                    <button onClick={() => setView('role')} className="text-xs font-bold text-slate-400 hover:text-slate-700 dark:hover:text-white mb-8 flex items-center gap-2 transition-colors w-fit">
                        {isRtl ? <ArrowRight size={16} /> : <ArrowLeft size={16} />} {t.changeRole}
                    </button>
                    
                    <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-2">
                        {isRegister ? t.signUp : t.welcomeBack}
                    </h2>
                    
                    {error && <div className="mb-6 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-2xl text-sm font-bold flex items-center gap-2 border border-red-100 dark:border-red-900/50"><div className="w-2 h-2 bg-red-500 rounded-full"></div>{error}</div>}

                    <form onSubmit={handleSubmit} className="space-y-4 mt-6">
                        {isRegister && !isAdmin && (
                            <div className="relative group">
                                <User className={`absolute top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors ${isRtl ? 'right-5' : 'left-5'}`} size={20} />
                                <input 
                                    type="text" 
                                    placeholder={t.fullName} 
                                    value={name} 
                                    onChange={e => setName(e.target.value)} 
                                    className={`w-full bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-2xl py-4 pr-4 pl-4 font-bold text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 dark:focus:border-emerald-500 transition-all placeholder:text-slate-400 ${isRtl ? 'pr-14' : 'pl-14'}`} 
                                    required 
                                />
                            </div>
                        )}

                        <div className="relative group">
                            <Mail className={`absolute top-1/2 -translate-y-1/2 text-slate-400 transition-colors ${isDoctor ? 'group-focus-within:text-blue-500' : isAdmin ? 'group-focus-within:text-slate-600' : 'group-focus-within:text-emerald-500'} ${isRtl ? 'right-5' : 'left-5'}`} size={20} />
                            <input 
                                type="email" 
                                placeholder={t.email} 
                                value={email} 
                                onChange={e => setEmail(e.target.value)} 
                                className={`w-full bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-2xl py-4 pr-4 pl-4 font-bold text-slate-900 dark:text-white focus:outline-none transition-all placeholder:text-slate-400 ${isDoctor ? 'focus:border-blue-500' : isAdmin ? 'focus:border-slate-600' : 'focus:border-emerald-500'} ${isRtl ? 'pr-14' : 'pl-14'}`} 
                                required 
                            />
                        </div>

                        <div className="relative group">
                            <Lock className={`absolute top-1/2 -translate-y-1/2 text-slate-400 transition-colors ${isDoctor ? 'group-focus-within:text-blue-500' : isAdmin ? 'group-focus-within:text-slate-600' : 'group-focus-within:text-emerald-500'} ${isRtl ? 'right-5' : 'left-5'}`} size={20} />
                            <input 
                                type={showPassword ? 'text' : 'password'} 
                                placeholder={t.password} 
                                value={password} 
                                onChange={e => setPassword(e.target.value)} 
                                className={`w-full bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-2xl py-4 font-bold text-slate-900 dark:text-white focus:outline-none transition-all placeholder:text-slate-400 ${isDoctor ? 'focus:border-blue-500' : isAdmin ? 'focus:border-slate-600' : 'focus:border-emerald-500'} ${isRtl ? 'pr-14 pl-14' : 'pl-14 pr-14'}`} 
                                required 
                            />
                            <button 
                                type="button" 
                                onClick={() => setShowPassword(!showPassword)} 
                                className={`absolute top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors ${isRtl ? 'left-5' : 'right-5'}`}
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>

                        {/* Doctor Registration Fields */}
                        {isDoctor && isRegister && (
                            <div className="space-y-4 pt-2 animate-fade-in">
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="relative">
                                        <select value={specialty} onChange={e => setSpecialty(e.target.value)} className="w-full bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-2xl py-4 px-4 font-bold text-xs text-slate-900 dark:text-white appearance-none focus:border-blue-500 outline-none" required>
                                            <option value="">{t.specialty}</option>
                                            {Object.values(Specialty).map(s => <option key={s} value={s}>{s}</option>)}
                                        </select>
                                        <div className={`absolute top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 ${isRtl ? 'left-4' : 'right-4'}`}>▼</div>
                                    </div>
                                    <div className="relative">
                                        <Smartphone className={`absolute top-1/2 -translate-y-1/2 text-slate-400 ${isRtl ? 'right-4' : 'left-4'}`} size={16} />
                                        <input type="text" placeholder={t.phone} value={phone} onChange={e => setPhone(e.target.value)} className={`w-full bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-2xl py-4 pr-4 pl-4 font-bold text-xs text-slate-900 dark:text-white focus:border-blue-500 outline-none ${isRtl ? 'pr-10' : 'pl-10'}`} required />
                                    </div>
                                </div>
                                <input type="text" placeholder={t.location} value={location} onChange={e => setLocation(e.target.value)} className="w-full bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-2xl py-4 px-4 font-bold text-xs text-slate-900 dark:text-white focus:border-blue-500 outline-none" required />
                                <input type="text" placeholder={t.license} value={license} onChange={e => setLicense(e.target.value)} className="w-full bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-2xl py-4 px-4 font-bold text-xs text-slate-900 dark:text-white focus:border-blue-500 outline-none" required />
                            </div>
                        )}

                        {!isRegister && (
                            <div className="flex justify-end">
                                <button type="button" onClick={() => setView('forgot')} className="text-xs font-bold text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors">
                                    {t.forgotPass}
                                </button>
                            </div>
                        )}

                        <button 
                            type="submit"
                            disabled={loading}
                            className={`w-full text-white py-4 rounded-2xl font-black text-lg transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 flex items-center justify-center gap-2 mt-4 ${isDoctor ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/30' : isAdmin ? 'bg-slate-800 hover:bg-slate-900 shadow-slate-500/30' : 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/30'}`}
                        >
                            {loading ? <Loader2 className="animate-spin" /> : (isRegister ? t.signUp : t.signIn)}
                        </button>
                    </form>

                    {!isAdmin && (
                        <div className="mt-8 text-center">
                            <p className="text-sm font-bold text-slate-400">
                                {isRegister ? t.haveAccount : t.noAccount}
                                <button onClick={() => setIsRegister(!isRegister)} className={`mx-2 underline transition-colors ${isDoctor ? 'text-blue-600 hover:text-blue-700' : 'text-emerald-600 hover:text-emerald-700'}`}>
                                    {isRegister ? t.signIn : t.signUp}
                                </button>
                            </p>
                        </div>
                    )}
                </div>
             )}

             {/* Simplified Forgot/Verify/Reset Views */}
             {(view === 'forgot' || view === 'verify' || view === 'reset') && (
                 <div className="h-full flex flex-col justify-center animate-fade-in-up max-w-sm mx-auto">
                     <button onClick={() => setView('login')} className="mb-6 text-slate-400 hover:text-slate-600 font-bold flex items-center gap-2">
                        {isRtl ? <ArrowRight size={16}/> : <ArrowLeft size={16}/>} {tCommon.back}
                     </button>
                     
                     {view === 'forgot' && (
                        <>
                            <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Reset Password</h2>
                            <form onSubmit={handleSendResetCode} className="space-y-4">
                                <input type="email" placeholder={t.email} value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-700 rounded-2xl py-4 px-4 font-bold text-slate-900 dark:text-white focus:outline-none focus:border-slate-500" required />
                                <button disabled={loading} className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold shadow-lg hover:bg-slate-800 transition-colors">{loading ? <Loader2 className="animate-spin mx-auto"/> : 'Send Code'}</button>
                            </form>
                        </>
                     )}

                     {view === 'verify' && (
                        <>
                            <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Verify Code</h2>
                            <form onSubmit={handleVerifyCode} className="space-y-4">
                                <input type="text" placeholder="0000" value={resetCode} onChange={e => setResetCode(e.target.value)} className="w-full bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-700 rounded-2xl py-4 text-center text-3xl font-black tracking-[1em] text-slate-900 dark:text-white focus:outline-none focus:border-slate-500" maxLength={4} required />
                                <button disabled={loading} className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold shadow-lg hover:bg-slate-800 transition-colors">{loading ? <Loader2 className="animate-spin mx-auto"/> : 'Verify'}</button>
                            </form>
                        </>
                     )}

                     {view === 'reset' && (
                        <>
                            <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">New Password</h2>
                            <form onSubmit={handleResetPassword} className="space-y-4 mt-6">
                                <input type="password" placeholder={t.password} value={newPassword} onChange={e => setNewPassword(e.target.value)} className="w-full bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-700 rounded-2xl py-4 px-4 font-bold text-slate-900 dark:text-white focus:outline-none focus:border-slate-500" required />
                                <button disabled={loading} className="w-full bg-emerald-500 text-white py-4 rounded-2xl font-bold shadow-lg hover:bg-emerald-600 transition-colors">{loading ? <Loader2 className="animate-spin mx-auto"/> : 'Update Password'}</button>
                            </form>
                        </>
                     )}
                 </div>
             )}

          </div>
       </div>
    </div>
  );
};

export default LoginModal;
