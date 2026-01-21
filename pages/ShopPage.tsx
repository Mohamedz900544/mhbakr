
import React, { useState } from 'react';
import { ShoppingBag, Plus, Star, Search, X, Check, Package, Calendar, Tag, Info } from 'lucide-react';
import { Page, Product } from '../types';
import { Language, translations } from '../lib/translations';

interface ShopPageProps {
  setPage: (page: Page) => void;
  products: Product[]; 
  onAddToCart: (product: Product) => void;
  onOpenCart: () => void;
  cartCount: number;
  onProductClick?: (product: Product) => void; 
  language: Language;
}

const ShopPage: React.FC<ShopPageProps> = ({ setPage, products, onAddToCart, onOpenCart, cartCount, onProductClick, language }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [justAdded, setJustAdded] = useState<string | null>(null);

  const t = translations[language];

  const categoryMap: { [key: string]: string } = {
      'all': t.categories.all,
      'طعام': t.categories.food,
      'عناية': t.categories.care,
      'أدوية': t.categories.meds,
      'اكسسوارات': t.categories.accessories,
      'اشتراكات': t.categories.subscriptions
  };

  const categories = Object.keys(categoryMap);

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    onAddToCart(product);
    setJustAdded(product.id);
    setTimeout(() => setJustAdded(null), 1500);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-slate-950 pt-24 pb-12 transition-colors duration-300 font-sans">
      
      {/* Floating Cart Button */}
      {cartCount > 0 && (
          <div 
            onClick={onOpenCart}
            className={`fixed bottom-8 ${language === 'ar' ? 'left-8' : 'right-8'} z-50 bg-slate-900 dark:bg-white text-white dark:text-slate-900 p-4 pr-6 rounded-full shadow-[0_10px_40px_rgba(0,0,0,0.3)] animate-fade-in flex items-center gap-4 cursor-pointer hover:scale-105 transition-transform border-4 border-white dark:border-slate-800 group`}
          >
              <div className="relative">
                  <ShoppingBag size={24} className="group-hover:animate-bounce"/>
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-slate-900 dark:border-white">
                      {cartCount}
                  </span>
              </div>
              <span className="font-black text-sm">سلة المشتريات</span>
          </div>
      )}

      {/* Hero Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 dark:from-slate-800 dark:to-slate-900 rounded-[3rem] p-10 md:p-16 text-white relative overflow-hidden text-center md:text-right shadow-2xl group">
            <div className="relative z-10 max-w-2xl">
                <span className="text-orange-400 font-bold tracking-[0.2em] uppercase text-xs mb-3 block">{t.shop}</span>
                <h1 className="text-5xl md:text-7xl font-black mb-6 leading-[1.1] text-white tracking-tight">{t.shopTitle}</h1>
                <p className="text-slate-300 text-xl mb-10 font-medium leading-relaxed max-w-lg">{t.shopSubtitle}</p>
                <button 
                    onClick={() => setSelectedCategory('اشتراكات')}
                    className="bg-white text-slate-900 px-10 py-4 rounded-2xl font-black hover:bg-orange-400 hover:text-white transition-all shadow-lg hover:shadow-orange-500/30 hover:-translate-y-1 transform duration-300"
                >
                    {t.viewDetails}
                </button>
            </div>
            
            {/* 3D Elements */}
            <div className="absolute top-0 left-0 w-full h-full opacity-40 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-purple-600 rounded-full mix-blend-multiply filter blur-[120px] animate-blob"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-orange-600 rounded-full mix-blend-multiply filter blur-[120px] animate-blob animation-delay-2000"></div>
            </div>
            
            <img 
                src="https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&q=80&w=600" 
                className={`hidden lg:block absolute -bottom-20 ${language === 'ar' ? '-left-20' : '-right-20'} w-[500px] object-cover rotate-12 rounded-[3rem] border-8 border-slate-800 shadow-2xl transition-transform duration-700 group-hover:scale-105 group-hover:rotate-6`} 
                alt="Happy Dog" 
            />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Sticky Toolbar */}
        <div className="flex flex-col md:flex-row gap-6 mb-12 items-center justify-between sticky top-28 z-40 py-4 px-4 -mx-4 bg-[#f8fafc]/90 dark:bg-slate-950/90 backdrop-blur-xl rounded-[2rem] border border-white/20 shadow-sm transition-all duration-300">
           {/* Search Bar */}
           <div className="relative w-full md:max-w-md group">
              <input 
                type="text" 
                placeholder={t.searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-2xl py-3.5 ${language === 'ar' ? 'pr-12 pl-4' : 'pl-12 pr-4'} focus:outline-none focus:border-emerald-500 dark:focus:border-emerald-500 transition-all font-bold text-slate-800 dark:text-white placeholder-slate-400 shadow-sm`}
              />
              <Search className={`absolute ${language === 'ar' ? 'right-4' : 'left-4'} top-1/2 transform -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors`} size={20} />
              {searchQuery && (
                  <button onClick={() => setSearchQuery('')} className={`absolute ${language === 'ar' ? 'left-4' : 'right-4'} top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-red-500 transition-colors`}>
                      <X size={18} />
                  </button>
              )}
           </div>

           {/* Categories */}
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide w-full md:w-auto">
                {categories.map((catKey) => (
                    <button 
                        key={catKey} 
                        onClick={() => setSelectedCategory(catKey)}
                        className={`whitespace-nowrap px-6 py-3 rounded-2xl font-bold text-sm transition-all flex items-center gap-2 ${
                            selectedCategory === catKey 
                            ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-lg scale-105' 
                            : 'bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-100 dark:border-slate-800'
                        }`}
                    >
                        {catKey === 'اشتراكات' && <Package size={16} />}
                        {categoryMap[catKey]}
                    </button>
                ))}
            </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
            {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                    <div 
                        key={product.id} 
                        onClick={() => onProductClick && onProductClick(product)}
                        className="group bg-white dark:bg-slate-900 rounded-[2.5rem] p-4 shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-2xl hover:border-emerald-200 dark:hover:border-emerald-900/50 transition-all duration-500 flex flex-col h-full hover:-translate-y-2 cursor-pointer relative"
                    >
                        
                        {/* Image Container */}
                        <div className="relative aspect-square overflow-hidden rounded-[2rem] bg-slate-100 dark:bg-slate-800 mb-5">
                            <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                            
                            {/* Tags */}
                            <div className="absolute top-4 left-4 flex flex-col gap-2">
                                {product.oldPrice && (
                                    <span className="bg-red-500 text-white text-[10px] font-black px-2.5 py-1.5 rounded-lg shadow-md flex items-center gap-1 backdrop-blur-md">
                                        <Tag size={10} /> خصم
                                    </span>
                                )}
                                {product.badge && (
                                    <span className="bg-amber-400 text-slate-900 text-[10px] font-black px-2.5 py-1.5 rounded-lg shadow-md">
                                        {product.badge}
                                    </span>
                                )}
                            </div>

                            {/* Overlay */}
                            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                                <span className="text-white font-bold text-sm bg-black/60 px-5 py-2.5 rounded-2xl flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                    <Info size={16} /> {t.viewDetails}
                                </span>
                            </div>
                        </div>
                        
                        {/* Info */}
                        <div className="flex-1 flex flex-col px-2">
                            <div className="mb-3">
                                <div className="flex items-center justify-between mb-2">
                                    <p className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded-lg uppercase tracking-wide">
                                        {categoryMap[product.category] || product.category}
                                    </p>
                                    <div className="flex items-center gap-1">
                                        <Star className="w-3 h-3 text-amber-400 fill-current" />
                                        <span className="text-xs font-bold text-slate-500 dark:text-slate-400">{product.rating}</span>
                                    </div>
                                </div>
                                <h3 className="font-black text-slate-900 dark:text-white text-base leading-snug line-clamp-2 h-11 mb-1">{product.name}</h3>
                            </div>
                            
                            <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800/50 flex items-center justify-between gap-3">
                                <div className="flex flex-col">
                                    {product.oldPrice && <span className="text-xs text-slate-400 line-through font-bold decoration-red-400 decoration-2">{product.oldPrice} {t.currency}</span>}
                                    <span className="text-xl font-black text-slate-900 dark:text-white">{product.price} <span className="text-xs font-bold text-slate-400">{t.currency}</span></span>
                                </div>
                                
                                <button 
                                    onClick={(e) => handleAddToCart(e, product)}
                                    className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg transition-all active:scale-90 duration-300 ${
                                        justAdded === product.id 
                                        ? 'bg-emerald-500 text-white scale-110' 
                                        : 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-emerald-500 dark:hover:bg-emerald-400 hover:text-white'
                                    }`}
                                >
                                    {justAdded === product.id ? <Check size={24} /> : <Plus size={24} />}
                                </button>
                            </div>
                        </div>
                    </div>
                ))
            ) : (
                <div className="col-span-full flex flex-col items-center justify-center py-20 text-center animate-fade-in glass-card rounded-[3rem]">
                    <div className="bg-slate-100 dark:bg-slate-800 p-8 rounded-full mb-6">
                        <ShoppingBag className="h-16 w-16 text-slate-300 dark:text-slate-600" />
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">{t.noResults}</h3>
                    <p className="text-slate-500 dark:text-slate-400 mb-8 font-medium">لم يتم العثور على منتجات تطابق بحثك.</p>
                    <button 
                        onClick={() => {setSearchQuery(''); setSelectedCategory('all');}}
                        className="text-white bg-slate-900 dark:bg-emerald-500 px-8 py-3 rounded-2xl font-bold hover:shadow-lg transition-all"
                    >
                        {t.clearFilters}
                    </button>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default ShopPage;
