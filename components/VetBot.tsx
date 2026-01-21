
import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, Loader2, Sparkles, AlertTriangle, Minimize2, Maximize2 } from 'lucide-react';
import { GoogleGenAI, Chat } from "@google/genai";
import { MOCK_DOCTORS, MOCK_PRODUCTS } from '../constants';
import { UserRole } from '../types';
import { Language, translations } from '../lib/translations';

interface VetBotProps {
    userRole: UserRole | null;
    language: Language;
}

interface Message {
  id: number;
  text: string;
  sender: 'bot' | 'user';
  time: string;
  isError?: boolean;
}

const VetBot: React.FC<VetBotProps> = ({ userRole, language }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [chatSession, setChatSession] = useState<Chat | null>(null);
  
  const t = translations[language];

  const [messages, setMessages] = useState<Message[]>([
    { 
      id: 1, 
      text: userRole === UserRole.DOCTOR 
        ? (language === 'ar' ? 'أهلاً دكتور 👋. أنا جاهز لمساعدتك في التشخيص واقتراح الأدوية.' : 'Hello Doctor 👋. Ready to assist with diagnosis and medication.')
        : t.botWelcome, 
      sender: 'bot', 
      time: new Date().toLocaleTimeString(language === 'ar' ? 'ar-EG' : 'en-US', { hour: '2-digit', minute: '2-digit' }) 
    }
  ]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Suggestions based on role
  const suggestions = userRole === UserRole.DOCTOR 
    ? ["Drug Dosage", "Parvo Symptoms", "Mange Treatment", "Interactions"]
    : language === 'ar' 
        ? ["قطتي لا تأكل 😿", "أحسن دكتور عظام؟ 🦴", "أكل للقطط المعقمة", "سعر الكشف كام؟ 💰"]
        : ["My cat won't eat 😿", "Best ortho vet? 🦴", "Sterilized cat food", "Consultation price? 💰"];

  // Initialize Gemini Chat Session with Role-Based Context
  useEffect(() => {
    const initChat = async () => {
      try {
        if (!process.env.API_KEY) {
            console.warn("Gemini API Key missing. Bot will operate in simulation mode.");
            return;
        }

        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        
        let systemInstruction = '';

        if (userRole === UserRole.DOCTOR) {
            systemInstruction = `
                You are a highly advanced Veterinary CDSS (Clinical Decision Support System).
                User: Professional Veterinarian.
                Language: ${language === 'ar' ? 'Arabic' : 'English'}.
                Task: Differential Diagnosis, Dosage Calculation, Medical Terminology. Be concise.
            `;
        } else {
            const doctorsContext = MOCK_DOCTORS.map(d => 
                `- Dr. ${d.name} (${d.specialty}) in ${d.location}, Price: ${d.price}. Available: ${d.available}`
            ).join('\n');

            const productsContext = MOCK_PRODUCTS.map(p =>
                `- ${p.name} (${p.category}) Price: ${p.price}`
            ).join('\n');

            systemInstruction = `
                You are "VetCare Assistant", a smart assistant for pet owners on the "VetCare" app.
                User: Pet Owner.
                Language: ${language === 'ar' ? 'Arabic (Egyptian dialect preferred)' : 'English'}.
                
                App Context:
                Doctors: ${doctorsContext}
                Products: ${productsContext}
                
                Tasks:
                1. Simple triage/advice.
                2. Recommend doctors from the list based on specialty/location.
                3. Recommend products from the list.
                4. Warn about emergencies.
            `;
        }

        const chat = ai.chats.create({
          model: 'gemini-3-flash-preview',
          config: {
            systemInstruction: systemInstruction,
            temperature: 0.7,
          },
        });
        
        setChatSession(chat);
      } catch (error) {
        console.error("Failed to initialize VetBot AI:", error);
      }
    };

    if (isOpen && !chatSession) { 
        initChat();
    }
  }, [isOpen, userRole, language]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen, isTyping]);

  const handleSend = async (textOverride?: string) => {
    const userText = textOverride || input;
    if (!userText.trim()) return;

    const userMsg: Message = {
      id: Date.now(),
      text: userText,
      sender: 'user',
      time: new Date().toLocaleTimeString(language === 'ar' ? 'ar-EG' : 'en-US', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      let responseText = "";

      if (chatSession) {
        const result = await chatSession.sendMessage({ message: userText });
        responseText = result.text || "Error retrieving response.";
      } else {
        // Fallback Simulation Mode
        await new Promise(resolve => setTimeout(resolve, 1500)); // Fake delay
        if (userText.toLowerCase().includes('doctor') || userText.includes('دكتور')) {
             responseText = language === 'ar' 
                ? "لدينا نخبة من أفضل الأطباء مثل د. محمد يحيى للجراحة. يمكنك الحجز من صفحة 'العيادات'."
                : "We have top doctors like Dr. Mohamed Yehia for surgery. You can book via the 'Clinics' page.";
        } else if (userText.toLowerCase().includes('food') || userText.includes('أكل')) {
             responseText = language === 'ar'
                ? "يوجد لدينا رويال كانين وميرا في المتجر. تصفح قسم 'طعام' في المتجر."
                : "We stock Royal Canin and Mera. Check the 'Food' section in the Store.";
        } else {
             responseText = language === 'ar'
                ? "أنا أعمل حالياً في الوضع التجريبي. يرجى إضافة مفتاح API لتفعيل الذكاء الاصطناعي الكامل."
                : "I am currently in demo mode. Please add an API Key to enable full AI capabilities.";
        }
      }

      const botMsg: Message = {
        id: Date.now() + 1,
        text: responseText,
        sender: 'bot',
        time: new Date().toLocaleTimeString(language === 'ar' ? 'ar-EG' : 'en-US', { hour: '2-digit', minute: '2-digit' })
      };
      
      setMessages(prev => [...prev, botMsg]);

    } catch (error) {
      const errorMsg: Message = {
        id: Date.now() + 1,
        text: language === 'ar' ? "عذراً، حدث خطأ في الاتصال." : "Sorry, connection error.",
        sender: 'bot',
        time: new Date().toLocaleTimeString(language === 'ar' ? 'ar-EG' : 'en-US', { hour: '2-digit', minute: '2-digit' }),
        isError: true
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  if (!isOpen) {
      return (
        <div className="fixed bottom-6 right-6 z-[90] flex flex-col items-end pointer-events-auto font-sans">
            {/* Tooltip Bubble */}
            <div className="bg-white dark:bg-slate-800 px-4 py-2 rounded-2xl rounded-br-none shadow-lg mb-3 animate-bounce-slow border border-gray-100 dark:border-slate-700 hidden md:block">
                <p className="text-xs font-bold text-gray-700 dark:text-gray-200">
                    {language === 'ar' ? 'محتار؟ اسألني!' : 'Need help? Ask me!'}
                </p>
            </div>
            <button
                onClick={() => setIsOpen(true)}
                className={`flex items-center justify-center w-16 h-16 rounded-full shadow-2xl transition-all duration-500 ease-out transform hover:scale-110 active:scale-95 group ${userRole === UserRole.DOCTOR ? 'bg-blue-600' : 'bg-gradient-to-tr from-gray-900 to-emerald-900'}`}
            >
                <div className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-20 transition-opacity"></div>
                <MessageSquare size={32} className="text-white fill-current relative z-10" />
                <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 border-2 border-white rounded-full animate-pulse"></span>
            </button>
        </div>
      );
  }

  return (
    <div className={`fixed bottom-6 ${language === 'ar' ? 'left-6 md:left-auto md:right-6' : 'right-6'} z-[120] font-sans flex flex-col items-end`}>
        <div 
            className={`
                bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl border border-gray-100 dark:border-slate-800 
                flex flex-col overflow-hidden transition-all duration-500 ease-in-out origin-bottom-right
                ${isMinimized ? 'w-72 h-16' : 'w-[90vw] md:w-[400px] h-[600px] max-h-[80vh]'}
            `}
        >
          {/* Header */}
          <div 
            onClick={() => setIsMinimized(!isMinimized)}
            className={`p-4 flex justify-between items-center text-white relative overflow-hidden cursor-pointer ${userRole === UserRole.DOCTOR ? 'bg-gradient-to-r from-blue-900 to-indigo-900' : 'bg-gradient-to-r from-slate-900 to-emerald-900'}`}
          >
            {/* Background Effects */}
            <div className="absolute top-0 left-0 w-full h-full opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
            
            <div className="flex items-center gap-3 relative z-10">
              <div className="relative">
                <div className={`p-2 rounded-full ${userRole === UserRole.DOCTOR ? 'bg-blue-500' : 'bg-emerald-500'} shadow-lg`}>
                    <Bot size={24} className="text-white" />
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 border-2 border-slate-900 rounded-full"></span>
              </div>
              <div>
                <h3 className="font-black text-base tracking-wide">{t.botTitle}</h3>
                {!isMinimized && (
                    <div className="flex items-center gap-1 opacity-80">
                        <Sparkles size={10} className="text-yellow-300" /> 
                        <p className="text-[10px] font-bold uppercase tracking-wider">{t.botSubtitle}</p>
                    </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 relative z-10">
                <button 
                    onClick={(e) => { e.stopPropagation(); setIsMinimized(!isMinimized); }} 
                    className="p-1.5 hover:bg-white/10 rounded-full transition-colors"
                >
                    {isMinimized ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
                </button>
                <button 
                    onClick={(e) => { e.stopPropagation(); setIsOpen(false); }} 
                    className="p-1.5 hover:bg-red-500/80 rounded-full transition-colors"
                >
                    <X size={18} />
                </button>
            </div>
          </div>

          {/* Messages Area (Hidden if minimized) */}
          {!isMinimized && (
              <>
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 dark:bg-slate-950/50 scrollbar-hide">
                    {messages.map((msg) => (
                    <div 
                        key={msg.id} 
                        className={`flex gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'} items-end animate-slide-up`}
                    >
                        {msg.sender === 'bot' && (
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm mb-1 ${msg.isError ? 'bg-red-100 text-red-500' : 'bg-white dark:bg-slate-800 text-emerald-600'}`}>
                                {msg.isError ? <AlertTriangle size={14} /> : <Bot size={16} />}
                            </div>
                        )}
                        
                        <div className={`max-w-[80%] p-3.5 rounded-2xl text-sm font-medium leading-relaxed shadow-sm relative ${
                        msg.sender === 'user' 
                            ? 'bg-slate-900 text-white rounded-br-none' 
                            : msg.isError 
                                ? 'bg-red-50 text-red-600 border border-red-100 rounded-bl-none'
                                : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-200 border border-gray-100 dark:border-slate-700 rounded-bl-none'
                        }`}>
                        {msg.text}
                        <span className={`text-[9px] block mt-1 opacity-60 ${msg.sender === 'user' ? 'text-right text-gray-300' : 'text-left'}`}>
                                {msg.time}
                        </span>
                        </div>
                    </div>
                    ))}
                    
                    {isTyping && (
                    <div className="flex gap-3 animate-pulse">
                        <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-slate-800 flex items-center justify-center">
                            <Bot size={14} className="text-gray-500" />
                        </div>
                        <div className="bg-white dark:bg-slate-800 px-4 py-3 rounded-2xl rounded-bl-none shadow-sm flex items-center gap-1.5 border border-gray-100 dark:border-slate-700">
                            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce"></span>
                            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce delay-100"></span>
                            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce delay-200"></span>
                        </div>
                    </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Suggestions */}
                <div className="bg-white dark:bg-slate-900 px-4 py-3 border-t border-gray-100 dark:border-slate-800 overflow-x-auto whitespace-nowrap scrollbar-hide flex gap-2">
                    {suggestions.map((s, i) => (
                        <button 
                            key={i} 
                            onClick={() => handleSend(s)}
                            className="inline-flex items-center px-3 py-1.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-full text-xs font-bold text-gray-600 dark:text-gray-300 hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200 transition-all"
                        >
                            {s}
                        </button>
                    ))}
                </div>

                {/* Input */}
                <div className="p-4 bg-white dark:bg-slate-900 border-t border-gray-100 dark:border-slate-800">
                    <form 
                    onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                    className="flex items-center gap-2 bg-gray-100 dark:bg-slate-950 rounded-full px-2 py-2 border border-transparent focus-within:border-emerald-500/50 focus-within:bg-white dark:focus-within:bg-slate-900 transition-all"
                    >
                    <input 
                        type="text" 
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder={t.botPlaceholder}
                        className="flex-1 bg-transparent border-none outline-none text-sm px-3 text-gray-900 dark:text-white placeholder-gray-400 font-bold"
                    />
                    <button 
                        type="submit" 
                        disabled={!input.trim() || isTyping}
                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-all transform duration-200 ${input.trim() ? 'bg-emerald-600 text-white shadow-lg hover:scale-105 active:scale-95' : 'bg-gray-200 dark:bg-slate-800 text-gray-400 cursor-not-allowed'}`}
                    >
                        {isTyping ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} className={input.trim() && language === 'ar' ? 'ml-1' : ''} />}
                    </button>
                    </form>
                </div>
              </>
          )}
        </div>
    </div>
  );
};

export default VetBot;
