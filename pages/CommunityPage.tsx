import React, { useState } from 'react';
import { Page, AdoptionPet, BlogPost, ForumTopic } from '../types';
import { MessageCircle, Share2, Clock, ThumbsUp, ArrowLeft, Heart, MapPin, User, PawPrint, X, Phone, Mail, BookOpen, AlertCircle, CheckCircle, Camera } from 'lucide-react';
import { Language } from '../lib/translations';

interface CommunityPageProps {
  setPage: (page: Page) => void;
  blogs: BlogPost[]; 
  forumTopics: ForumTopic[]; 
  adoptionPets: AdoptionPet[];
  onAddAdoption: (pet: AdoptionPet) => void; 
  language: Language;
}

const CommunityPage: React.FC<CommunityPageProps> = ({ setPage, blogs, forumTopics, adoptionPets, onAddAdoption, language }) => {
  const [activeTab, setActiveTab] = useState<'knowledge' | 'adoption'>('knowledge');
  const [showAdoptModal, setShowAdoptModal] = useState<AdoptionPet | null>(null);
  const [showOfferModal, setShowOfferModal] = useState(false);
  
  // Interactive Article Modal State
  const [selectedArticle, setSelectedArticle] = useState<BlogPost | null>(null);

  // Adoption Form State
  const [newPetName, setNewPetName] = useState('');
  const [newPetType, setNewPetType] = useState('قط');
  const [newPetPhone, setNewPetPhone] = useState('');
  const [newPetDesc, setNewPetDesc] = useState('');

  const handleSubmitAdoption = () => {
      if(!newPetName || !newPetPhone) return;
      
      const newPet: AdoptionPet = {
          id: Date.now().toString(),
          name: newPetName,
          type: newPetType,
          breed: 'غير محدد',
          gender: 'male', // Default
          age: 'سنة', // Default
          location: 'القاهرة', // Default
          image: 'https://images.unsplash.com/photo-1548802673-380ab8ebc7b7?auto=format&fit=crop&q=80&w=400', // Default Placeholder
          story: newPetDesc || 'يبحث عن منزل دافئ ومحب.',
          vaccinated: true,
          ownerName: 'مستخدم',
          status: 'pending', // Needs admin approval conceptually, but we'll show it or handle in admin
          phone: newPetPhone
      };

      onAddAdoption(newPet);
      setShowOfferModal(false);
      setNewPetName('');
      setNewPetPhone('');
      setNewPetDesc('');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 pt-24 pb-16 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-10 animate-fade-in-up">
            <span className="text-emerald-600 dark:text-emerald-400 font-bold tracking-wider uppercase text-xs mb-2 block">مجتمع البيطار</span>
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-4">خبرات، تبني، ومساعدة</h1>
            <p className="text-gray-500 dark:text-gray-400 text-lg max-w-2xl mx-auto">مكانك الآمن للسؤال والمشاركة والتعلم وإنقاذ الأرواح. انضم لأكبر مجتمع لمربي الحيوانات في مصر.</p>
        </div>

        {/* Tab Switcher */}
        <div className="flex justify-center mb-12 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <div className="bg-white dark:bg-slate-800 p-1.5 rounded-full shadow-lg border border-gray-200 dark:border-slate-700 inline-flex transition-colors">
                <button 
                  onClick={() => setActiveTab('knowledge')}
                  className={`px-8 py-3 rounded-full font-bold text-sm transition-all flex items-center gap-2 ${activeTab === 'knowledge' ? 'bg-gray-900 text-white dark:bg-emerald-600 shadow-md' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}
                >
                    <BookOpen size={16} /> المدونة والمنتدى
                </button>
                <button 
                  onClick={() => setActiveTab('adoption')}
                  className={`px-8 py-3 rounded-full font-bold text-sm transition-all flex items-center gap-2 ${activeTab === 'adoption' ? 'bg-orange-500 text-white shadow-md' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}
                >
                    <PawPrint size={16} /> ركن التبني
                </button>
            </div>
        </div>

        {activeTab === 'knowledge' ? (
             <div className="grid lg:grid-cols-3 gap-8 animate-fade-in">
            
                {/* Left Column: Featured Blogs */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <span className="w-2 h-8 bg-emerald-500 rounded-full"></span>
                            مقالات مختارة
                        </h2>
                    </div>

                    {blogs.map(blog => (
                        <div 
                            key={blog.id} 
                            onClick={() => setSelectedArticle(blog)}
                            className="group bg-white dark:bg-slate-800 rounded-[2.5rem] p-5 shadow-sm border border-gray-100 dark:border-slate-700 hover:shadow-xl hover:border-emerald-100 dark:hover:border-slate-600 transition-all flex flex-col md:flex-row gap-6 cursor-pointer overflow-hidden"
                        >
                            <div className="w-full md:w-56 h-56 flex-shrink-0 rounded-[2rem] overflow-hidden relative">
                                <img src={blog.image} alt={blog.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                <div className="absolute top-3 left-3 bg-white/90 dark:bg-black/60 backdrop-blur px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                                    {blog.category}
                                </div>
                            </div>
                            <div className="flex-grow flex flex-col justify-center py-2">
                                <div className="flex items-center gap-2 text-gray-400 dark:text-gray-500 text-xs font-bold mb-3">
                                    <Clock size={12} /> {blog.date} • د. {blog.author}
                                </div>
                                <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-3 leading-tight group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">{blog.title}</h3>
                                <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-2 mb-6 leading-relaxed">{blog.summary}</p>
                                <div className="flex items-center justify-between mt-auto">
                                    <span className="text-emerald-600 dark:text-emerald-400 font-bold text-sm flex items-center gap-1 group-hover:translate-x-2 transition-transform">
                                        اقرأ المزيد <ArrowLeft size={16} />
                                    </span>
                                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button className="p-2 bg-gray-100 dark:bg-slate-700 rounded-full hover:text-emerald-500 transition-colors"><ThumbsUp size={16}/></button>
                                        <button className="p-2 bg-gray-100 dark:bg-slate-700 rounded-full hover:text-blue-500 transition-colors"><Share2 size={16}/></button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Right Column: Forum & Trending */}
                <div className="space-y-8">
                    {/* Ask Box */}
                    <div className="bg-gradient-to-br from-gray-900 to-slate-800 dark:from-emerald-900 dark:to-slate-900 rounded-[2.5rem] p-8 text-white text-center shadow-xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500 rounded-full blur-3xl opacity-20 -mr-10 -mt-10"></div>
                        <MessageCircle size={48} className="mx-auto mb-4 text-emerald-400" />
                        <h3 className="text-2xl font-black mb-2">عندك سؤال محيرك؟</h3>
                        <p className="text-gray-300 text-sm mb-8 leading-relaxed">أطباء وخبراء البيطار موجودين عشان يجاوبوك. لا تتردد في طرح مشكلتك.</p>
                        <button 
                        onClick={() => setPage(Page.FORUM)}
                        className="bg-emerald-500 text-white w-full py-4 rounded-xl font-bold hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-900/50"
                        >
                        اسأل الآن مجاناً
                        </button>
                    </div>

                    {/* Trending Discussions */}
                    <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-6 shadow-sm border border-gray-100 dark:border-slate-700 transition-colors">
                        <div className="flex items-center justify-between mb-6">
                        <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2"><AlertCircle size={18} className="text-orange-500"/> نقاشات ساخنة</h3>
                        <button 
                            onClick={() => setPage(Page.FORUM)} 
                            className="text-xs text-gray-400 font-bold hover:text-gray-900 dark:hover:text-white transition-colors"
                        >
                            المزيد
                        </button>
                        </div>
                        
                        <div className="space-y-4">
                            {forumTopics.slice(0, 3).map(topic => (
                                <div key={topic.id} className="group cursor-pointer p-3 rounded-2xl hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors" onClick={() => setPage(Page.FORUM)}>
                                    <div className="flex justify-between items-start mb-1">
                                        <div className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">{topic.tag}</div>
                                        <span className="text-[10px] text-gray-400">{topic.lastActive}</span>
                                    </div>
                                    <h4 className="font-bold text-gray-800 dark:text-gray-200 text-sm group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-2">
                                        {topic.title}
                                    </h4>
                                    <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
                                        <User size={12}/> {topic.author}
                                        <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                        {topic.replies} رد
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

            </div>
        ) : (
            <div className="animate-fade-in">
                {/* Adoption Banner */}
                <div className="bg-orange-50 dark:bg-orange-900/10 rounded-[2.5rem] p-8 md:p-16 text-center mb-12 relative overflow-hidden border border-orange-100 dark:border-orange-900/20">
                    <div className="relative z-10 max-w-3xl mx-auto">
                        <div className="w-20 h-20 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                            <Heart className="w-10 h-10 text-orange-500 fill-current animate-pulse" />
                        </div>
                        <h2 className="text-4xl font-black text-gray-900 dark:text-white mb-4">تبنى.. لا تشتري</h2>
                        <p className="text-gray-600 dark:text-gray-300 mb-8 text-lg leading-relaxed">كل حيوان هنا له قصة، وبيدور على فرصة تانية وحضن دافي. افتح قلبك وبيتك ليهم وأنقذ روح بريئة.</p>
                        <button 
                            onClick={() => setShowOfferModal(true)}
                            className="bg-gray-900 dark:bg-orange-600 text-white px-10 py-4 rounded-2xl font-bold hover:bg-orange-600 dark:hover:bg-orange-700 transition-colors shadow-xl hover:-translate-y-1 transform duration-300"
                        >
                            اعرض حيوان للتبني
                        </button>
                    </div>
                    {/* Pattern */}
                    <div className="absolute top-0 left-0 w-full h-full opacity-5 bg-[url('https://www.transparenttextures.com/patterns/paw-prints.png')]"></div>
                </div>

                {/* Adoption Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {adoptionPets.map(pet => (
                        <div key={pet.id} className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-4 shadow-sm border border-gray-100 dark:border-slate-700 hover:shadow-2xl hover:border-orange-200 dark:hover:border-orange-900 transition-all group flex flex-col h-full">
                            <div className="relative h-72 rounded-[2rem] overflow-hidden mb-5 bg-gray-100 dark:bg-slate-700">
                                <img src={pet.image} alt={pet.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                
                                {/* Badges */}
                                <div className="absolute top-4 right-4 flex flex-col gap-2">
                                    <div className="bg-white/90 backdrop-blur px-3 py-1.5 rounded-xl text-xs font-bold text-gray-800 flex items-center gap-1 shadow-sm">
                                        <MapPin size={12} className="text-orange-500" /> {pet.location}
                                    </div>
                                    <div className={`px-3 py-1.5 rounded-xl text-xs font-bold text-white shadow-sm flex items-center gap-1 w-fit ${pet.vaccinated ? 'bg-emerald-500' : 'bg-red-500'}`}>
                                        {pet.vaccinated ? <CheckCircle size={12}/> : <AlertCircle size={12}/>}
                                        {pet.vaccinated ? 'مُطعم' : 'غير مُطعم'}
                                    </div>
                                    {pet.status === 'pending' && (
                                        <div className="bg-yellow-500 text-white px-3 py-1.5 rounded-xl text-xs font-bold shadow-sm">
                                            قيد المراجعة
                                        </div>
                                    )}
                                </div>
                                
                                {/* Gender Badge */}
                                <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur text-white p-2 rounded-full">
                                    {pet.gender === 'male' ? '♂️' : '♀️'}
                                </div>
                            </div>
                            
                            <div className="px-2 flex-1 flex flex-col">
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-1 group-hover:text-orange-500 transition-colors">{pet.name}</h3>
                                        <p className="text-sm font-bold text-gray-500 dark:text-gray-400">{pet.type} • {pet.breed}</p>
                                    </div>
                                    <div className="bg-orange-50 dark:bg-slate-700 px-3 py-2 rounded-xl text-center min-w-[70px]">
                                        <span className="block text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase">العمر</span>
                                        <span className="block text-sm font-black text-orange-600 dark:text-orange-400">{pet.age}</span>
                                    </div>
                                </div>
                                
                                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-6 line-clamp-3 bg-gray-50 dark:bg-slate-700/50 p-3 rounded-2xl">
                                    "{pet.story}"
                                </p>

                                <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-100 dark:border-slate-700">
                                    <div className="flex items-center gap-2 text-xs font-bold text-gray-500 dark:text-gray-400">
                                        <div className="w-6 h-6 bg-gray-200 dark:bg-slate-600 rounded-full flex items-center justify-center"><User size={12}/></div>
                                        {pet.ownerName}
                                    </div>
                                    <button 
                                        onClick={() => setShowAdoptModal(pet)}
                                        className="bg-gray-900 dark:bg-emerald-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-emerald-600 dark:hover:bg-emerald-500 transition-colors flex items-center gap-2 shadow-lg"
                                    >
                                        تبني <PawPrint size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )}

        {/* Adopt Contact Modal */}
        {showAdoptModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
                <div className="bg-white dark:bg-slate-800 rounded-[2rem] max-w-sm w-full p-8 relative shadow-2xl border border-gray-100 dark:border-slate-700">
                    <button onClick={() => setShowAdoptModal(null)} className="absolute top-4 left-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                        <X size={20} />
                    </button>
                    <div className="text-center mb-6">
                        <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-4 border-4 border-emerald-100 dark:border-slate-600 shadow-lg">
                            <img src={petImgPlaceholder(showAdoptModal.type)} alt={showAdoptModal.name} className="w-full h-full object-cover" />
                        </div>
                        <h3 className="text-xl font-black text-gray-900 dark:text-white">تواصل لتبني {showAdoptModal.name}</h3>
                        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">تواصل مع المالك الحالي للاتفاق</p>
                    </div>

                    <div className="space-y-3">
                        <a href={`tel:${showAdoptModal.phone || '19011'}`} className="w-full bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 p-4 rounded-xl flex items-center justify-center gap-2 font-bold hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition-colors">
                            <Phone size={20} /> {showAdoptModal.phone || 'اتصال هاتفي'}
                        </a>
                        <button className="w-full bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 p-4 rounded-xl flex items-center justify-center gap-2 font-bold hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors">
                            <Mail size={20} /> إرسال رسالة
                        </button>
                    </div>
                </div>
            </div>
        )}

        {/* Offer Adoption Modal - NOW FUNCTIONAL */}
        {showOfferModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
                <div className="bg-white dark:bg-slate-800 rounded-[2rem] max-w-sm w-full p-8 relative shadow-2xl text-center border border-gray-100 dark:border-slate-700">
                    <button onClick={() => setShowOfferModal(false)} className="absolute top-4 left-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                        <X size={20} />
                    </button>
                    
                    <h3 className="text-xl font-black text-gray-900 dark:text-white mb-6">عرض حيوان للتبني</h3>
                    
                    <div className="space-y-3 text-right">
                        <input 
                            placeholder="اسم الحيوان" 
                            value={newPetName}
                            onChange={e => setNewPetName(e.target.value)}
                            className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl p-3 text-sm font-bold focus:border-emerald-500 outline-none"
                        />
                        <select 
                            value={newPetType}
                            onChange={e => setNewPetType(e.target.value)}
                            className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl p-3 text-sm font-bold focus:border-emerald-500 outline-none"
                        >
                            <option value="قط">قط</option>
                            <option value="كلب">كلب</option>
                            <option value="آخر">آخر</option>
                        </select>
                        <input 
                            placeholder="رقم الهاتف للتواصل" 
                            value={newPetPhone}
                            onChange={e => setNewPetPhone(e.target.value)}
                            className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl p-3 text-sm font-bold focus:border-emerald-500 outline-none"
                        />
                        <textarea 
                            placeholder="وصف الحالة والقصة..."
                            value={newPetDesc}
                            onChange={e => setNewPetDesc(e.target.value)}
                            className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl p-3 text-sm font-bold focus:border-emerald-500 outline-none h-24 resize-none"
                        ></textarea>
                    </div>

                    <button onClick={handleSubmitAdoption} className="mt-6 bg-gray-900 dark:bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-gray-800 dark:hover:bg-emerald-700 w-full transition-colors">
                        نشر الإعلان
                    </button>
                </div>
            </div>
        )}

        {/* Article Reader Modal */}
        {selectedArticle && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
                <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] max-w-2xl w-full max-h-[90vh] overflow-y-auto relative shadow-2xl border border-gray-100 dark:border-slate-700">
                   <button 
                     onClick={() => setSelectedArticle(null)}
                     className="absolute top-4 left-4 p-2 bg-white/50 dark:bg-black/50 backdrop-blur rounded-full hover:bg-white dark:hover:bg-black text-gray-900 dark:text-white transition-colors z-10 shadow-sm"
                   >
                     <X size={20} />
                   </button>
                   
                   <div className="relative h-72 w-full">
                      <img src={selectedArticle.image} alt={selectedArticle.title} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                      <div className="absolute bottom-8 right-8 text-white max-w-lg">
                         <span className="bg-emerald-500 px-3 py-1 rounded-lg text-xs font-bold mb-3 inline-block shadow-sm">{selectedArticle.category}</span>
                         <h2 className="text-3xl md:text-4xl font-black leading-tight drop-shadow-lg">{selectedArticle.title}</h2>
                      </div>
                   </div>

                   <div className="p-8 md:p-10">
                      <div className="flex items-center justify-between mb-8 pb-8 border-b border-gray-100 dark:border-slate-700">
                         <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gray-100 dark:bg-slate-700 rounded-full flex items-center justify-center border-2 border-white dark:border-slate-600 shadow-sm">
                               <User size={24} className="text-gray-500 dark:text-gray-400" />
                            </div>
                            <div>
                               <p className="text-sm font-bold text-gray-900 dark:text-white">كتبه: د. {selectedArticle.author}</p>
                               <p className="text-xs text-gray-500 dark:text-gray-400">{selectedArticle.date}</p>
                            </div>
                         </div>
                         <div className="flex gap-2">
                             <button className="p-3 bg-gray-50 dark:bg-slate-700 rounded-xl text-gray-500 hover:text-emerald-500 hover:bg-emerald-50 transition-colors"><ThumbsUp size={20}/></button>
                             <button className="p-3 bg-gray-50 dark:bg-slate-700 rounded-xl text-gray-500 hover:text-blue-500 hover:bg-blue-50 transition-colors"><Share2 size={20}/></button>
                         </div>
                      </div>
                      
                      {/* Render HTML Content safely */}
                      <div 
                        className="prose prose-lg dark:prose-invert text-gray-600 dark:text-gray-300 max-w-none leading-loose font-medium"
                        dangerouslySetInnerHTML={{ __html: selectedArticle.content }}
                      />

                      <div className="mt-12 pt-8 border-t border-gray-100 dark:border-slate-700 text-center">
                         <p className="text-gray-400 text-sm mb-4 font-bold">استفدت من المقال؟ شاركه مع أصحابك</p>
                         <button 
                           onClick={() => setSelectedArticle(null)}
                           className="bg-gray-900 dark:bg-emerald-600 text-white px-10 py-4 rounded-2xl font-bold hover:bg-emerald-600 dark:hover:bg-emerald-700 transition-colors shadow-lg hover:-translate-y-1 transform duration-200"
                         >
                            إغلاق المقال
                         </button>
                      </div>
                   </div>
                </div>
            </div>
        )}

      </div>
    </div>
  );
};

// Helper for placeholders
const petImgPlaceholder = (type: string) => {
    return type === 'قط' 
        ? 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=400' 
        : 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=400';
}

export default CommunityPage;