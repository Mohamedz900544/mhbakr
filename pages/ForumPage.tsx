
import React, { useState } from 'react';
import { Page, ForumTopic } from '../types';
import { 
  MessageCircle, 
  Search, 
  Plus, 
  ArrowRight, 
  Clock, 
  Eye, 
  MessageSquare, 
  User, 
  Tag, 
  Send,
  Heart,
  MoreHorizontal,
  ThumbsUp,
  Share2,
  Sparkles
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

interface ForumPageProps {
  setPage: (page: Page) => void;
  posts: ForumTopic[]; // Received from App State
  onAddPost: (post: ForumTopic) => void; // Handler to update App State
}

const ForumPage: React.FC<ForumPageProps> = ({ setPage, posts, onAddPost }) => {
  const [view, setView] = useState<'feed' | 'create'>('feed');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('الكل');
  
  // Translation state
  const [translatedPosts, setTranslatedPosts] = useState<{[key: string]: string}>({});
  const [translatingId, setTranslatingId] = useState<string | number | null>(null);

  const categories = ['الكل', 'نصائح طبية', 'قصص نجاح', 'استفسارات', 'تغذية', 'سلوك'];

  // New Post State
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newTag, setNewTag] = useState('استفسارات');

  const handleCreatePost = () => {
      if(!newTitle || !newContent) return;
      const newPost: ForumTopic = {
          id: Date.now(),
          author: 'مستخدم جديد',
          authorRole: 'مربي',
          lastActive: 'الآن',
          title: newTitle,
          content: newContent,
          tag: newTag,
          likes: 0,
          replies: 0,
          views: 0
      };
      
      onAddPost(newPost);
      setView('feed');
      setNewTitle('');
      setNewContent('');
  };

  const handleTranslatePost = async (post: ForumTopic) => {
      if (translatedPosts[post.id]) {
          // Toggle off
          const newTrans = {...translatedPosts};
          delete newTrans[post.id];
          setTranslatedPosts(newTrans);
          return;
      }

      setTranslatingId(post.id);
      try {
          if (!process.env.API_KEY) throw new Error("API Key missing");
          const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
          const prompt = `Translate this forum post content to English (if Arabic) or Arabic (if English): "${post.content}"`;
          const response = await ai.models.generateContent({
              model: "gemini-3-flash-preview",
              contents: prompt
          });
          setTranslatedPosts(prev => ({...prev, [post.id]: response.text || ''}));
      } catch (e) {
          alert("Translation failed. Check API Key.");
      } finally {
          setTranslatingId(null);
      }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 pt-24 pb-12 transition-colors duration-300 font-sans">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Area */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-8">
            <div>
                <h1 className="text-3xl font-black text-gray-900 dark:text-white flex items-center gap-3">
                    <MessageCircle className="text-emerald-500" /> منتدى البيطار
                </h1>
                <p className="text-gray-500 dark:text-gray-400 mt-2 text-lg">مجتمع حيوي لتبادل الخبرات والنصائح البيطرية</p>
            </div>
            <button 
                onClick={() => setView('create')}
                className="bg-gray-900 dark:bg-emerald-600 text-white px-6 py-3 rounded-2xl font-bold shadow-lg hover:bg-emerald-600 dark:hover:bg-emerald-700 transition-all flex items-center gap-2"
            >
                <Plus size={20} /> موضوع جديد
            </button>
        </div>

        {/* View Switcher */}
        {view === 'create' ? (
            <div className="max-w-3xl mx-auto animate-fade-in-up">
                <button onClick={() => setView('feed')} className="mb-4 text-gray-500 font-bold flex items-center gap-2 hover:text-emerald-600">
                    <ArrowRight size={18} /> العودة للمنتدى
                </button>
                <div className="bg-white dark:bg-slate-800 rounded-[2rem] p-8 shadow-xl border border-gray-100 dark:border-slate-700">
                    <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-6">نشر موضوع جديد</h2>
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-600 dark:text-gray-400 mb-2">عنوان الموضوع</label>
                            <input 
                                type="text" 
                                value={newTitle}
                                onChange={(e) => setNewTitle(e.target.value)}
                                className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl p-4 font-bold text-gray-900 dark:text-white focus:outline-none focus:border-emerald-500"
                                placeholder="اكتب عنواناً جذاباً..."
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-600 dark:text-gray-400 mb-2">التصنيف</label>
                            <div className="flex gap-2 flex-wrap">
                                {categories.slice(1).map(cat => (
                                    <button 
                                        key={cat}
                                        onClick={() => setNewTag(cat)}
                                        className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${newTag === cat ? 'bg-emerald-500 text-white' : 'bg-gray-100 dark:bg-slate-700 text-gray-500 dark:text-gray-400'}`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-600 dark:text-gray-400 mb-2">المحتوى</label>
                            <textarea 
                                value={newContent}
                                onChange={(e) => setNewContent(e.target.value)}
                                className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl p-4 min-h-[200px] font-medium text-gray-900 dark:text-white focus:outline-none focus:border-emerald-500"
                                placeholder="شاركنا تجربتك أو استفسارك بالتفصيل..."
                            ></textarea>
                        </div>
                        <button 
                            onClick={handleCreatePost}
                            className="w-full bg-emerald-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-emerald-700 transition-colors shadow-lg"
                        >
                            نشر الآن
                        </button>
                    </div>
                </div>
            </div>
        ) : (
            <div className="grid lg:grid-cols-4 gap-8">
                
                {/* Sidebar Filters (Desktop) */}
                <div className="hidden lg:block space-y-6">
                    <div className="bg-white dark:bg-slate-800 rounded-[2rem] p-6 shadow-sm border border-gray-100 dark:border-slate-700 sticky top-28">
                        <div className="relative mb-6">
                            <input 
                                type="text" 
                                placeholder="بحث..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl py-3 pr-10 pl-4 text-sm font-bold focus:outline-none focus:border-emerald-500"
                            />
                            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        </div>
                        
                        <h3 className="font-bold text-gray-900 dark:text-white mb-4">التصنيفات</h3>
                        <div className="space-y-2">
                            {categories.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setActiveCategory(cat)}
                                    className={`w-full text-right px-4 py-3 rounded-xl text-sm font-bold transition-all flex justify-between items-center ${
                                        activeCategory === cat 
                                        ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800' 
                                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-700'
                                    }`}
                                >
                                    {cat}
                                    {activeCategory === cat && <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Main Feed */}
                <div className="lg:col-span-3 space-y-6">
                    {posts.filter(p => activeCategory === 'الكل' || p.tag === activeCategory).map(post => (
                        <div key={post.id} className="bg-white dark:bg-slate-800 rounded-[2rem] p-6 shadow-sm border border-gray-100 dark:border-slate-700 hover:shadow-md transition-shadow animate-fade-in">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-black text-white text-lg shadow-sm ${post.authorRole?.includes('طبيب') ? 'bg-blue-600' : 'bg-gradient-to-tr from-emerald-500 to-teal-400'}`}>
                                        {post.author.charAt(0)}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-bold text-gray-900 dark:text-white">{post.author}</h3>
                                            {post.authorRole?.includes('طبيب') && <span className="bg-blue-100 text-blue-700 text-[10px] px-2 py-0.5 rounded-full font-bold">طبيب معتمد</span>}
                                        </div>
                                        <p className="text-xs text-gray-400 font-medium">{post.lastActive}</p>
                                    </div>
                                </div>
                                <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                                    <MoreHorizontal size={20} />
                                </button>
                            </div>

                            <div className="mb-4">
                                <span className={`inline-block px-3 py-1 rounded-lg text-xs font-bold mb-3 ${post.tag === 'نصائح طبية' ? 'bg-blue-50 text-blue-600' : 'bg-orange-50 text-orange-600'}`}>
                                    {post.tag}
                                </span>
                                <h2 className="text-xl font-black text-gray-900 dark:text-white mb-2 leading-tight">{post.title}</h2>
                                <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm">
                                    {translatedPosts[post.id] || post.content || '...'}
                                </p>
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t border-gray-50 dark:border-slate-700">
                                <div className="flex gap-4">
                                    <button 
                                        className={`flex items-center gap-1.5 text-sm font-bold transition-colors ${post.isLiked ? 'text-red-500' : 'text-gray-500 dark:text-gray-400 hover:text-red-500'}`}
                                    >
                                        <Heart size={18} className={post.isLiked ? 'fill-current' : ''} />
                                        {post.likes || 0}
                                    </button>
                                    <button className="flex items-center gap-1.5 text-sm font-bold text-gray-500 dark:text-gray-400 hover:text-blue-500 transition-colors">
                                        <MessageSquare size={18} />
                                        {post.replies}
                                    </button>
                                </div>
                                <div className="flex gap-3">
                                    <button 
                                        onClick={() => handleTranslatePost(post)}
                                        className="text-xs text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded flex items-center gap-1 hover:bg-emerald-100 transition-colors"
                                    >
                                        <Sparkles size={12}/> {translatingId === post.id ? '...' : (translatedPosts[post.id] ? 'Original' : 'AI Translate')}
                                    </button>
                                    <button className="text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors">
                                        <Share2 size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        )}

      </div>
    </div>
  );
};

export default ForumPage;
