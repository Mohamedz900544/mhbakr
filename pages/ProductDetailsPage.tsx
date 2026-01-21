import React, { useState } from 'react';
import { Page, Product } from '../types';
import { ArrowRight, Star, ShoppingBag, Plus, Minus, Tag, CheckCircle, Truck, ShieldCheck, Share2, Heart } from 'lucide-react';
import { Language } from '../lib/translations';

interface ProductDetailsPageProps {
  product: Product | null;
  setPage: (page: Page) => void;
  onAddToCart: (product: Product) => void;
  allProducts: Product[];
  onProductClick: (product: Product) => void;
  language: Language;
}

const ProductDetailsPage: React.FC<ProductDetailsPageProps> = ({ product, setPage, onAddToCart, allProducts, onProductClick, language }) => {
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);

  if (!product) return <div className="min-h-screen flex items-center justify-center">جاري التحميل...</div>;

  // Mock data for description if not present
  const description = product.description || `استمتع بأفضل جودة مع ${product.name}. هذا المنتج مصمم خصيصاً لتلبية احتياجات حيوانك الأليف، مع مكونات آمنة وصحية. يوفر تغذية متوازنة وعناية فائقة.`;
  
  // Mock additional images if not present
  const images = product.images && product.images.length > 0 ? [product.image, ...product.images] : [product.image, product.image, product.image];

  const relatedProducts = allProducts
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const handleAddToCart = () => {
    // Add multiple times based on quantity
    for(let i=0; i<quantity; i++) {
        onAddToCart(product);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-slate-950 pt-24 pb-12 font-sans transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb / Back */}
        <button 
            onClick={() => setPage(Page.SHOP)} 
            className="flex items-center gap-2 text-gray-500 hover:text-emerald-600 mb-8 font-bold text-sm transition-colors"
        >
            <ArrowRight size={18} /> العودة للمتجر
        </button>

        <div className="grid lg:grid-cols-2 gap-12 mb-16">
            
            {/* Image Gallery */}
            <div className="space-y-4">
                <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-4 border border-gray-100 dark:border-slate-800 shadow-lg relative overflow-hidden group">
                    <img 
                        src={images[activeImage]} 
                        alt={product.name} 
                        className="w-full h-[400px] object-contain transition-transform duration-500 group-hover:scale-105" 
                    />
                    {product.badge && (
                        <span className="absolute top-4 right-4 bg-orange-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                            {product.badge}
                        </span>
                    )}
                </div>
                <div className="flex gap-4 overflow-x-auto pb-2">
                    {images.map((img, idx) => (
                        <button 
                            key={idx} 
                            onClick={() => setActiveImage(idx)}
                            className={`w-20 h-20 rounded-2xl border-2 overflow-hidden flex-shrink-0 transition-all ${activeImage === idx ? 'border-emerald-500 scale-105' : 'border-transparent opacity-70 hover:opacity-100'}`}
                        >
                            <img src={img} className="w-full h-full object-cover" alt={`view ${idx}`} />
                        </button>
                    ))}
                </div>
            </div>

            {/* Product Info */}
            <div className="flex flex-col">
                <div className="mb-6">
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold text-sm bg-emerald-50 dark:bg-emerald-900/20 px-3 py-1 rounded-lg mb-3 inline-block">
                        {product.category}
                    </span>
                    <h1 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white mb-4 leading-tight">
                        {product.name}
                    </h1>
                    <div className="flex items-center gap-4 mb-6">
                        <div className="flex items-center gap-1 text-yellow-500 bg-yellow-50 dark:bg-yellow-900/10 px-3 py-1.5 rounded-xl border border-yellow-100 dark:border-yellow-900/30">
                            <Star className="fill-current" size={16} />
                            <span className="font-bold text-sm text-gray-700 dark:text-gray-200">{product.rating}</span>
                        </div>
                        <span className="text-gray-400 text-sm font-bold">• 120 تقييم</span>
                        <span className="text-emerald-600 font-bold text-sm flex items-center gap-1">
                            <CheckCircle size={16} /> متوفر في المخزون
                        </span>
                    </div>
                    
                    <div className="flex items-end gap-3 mb-8">
                        <span className="text-4xl font-black text-gray-900 dark:text-white">{product.price} <span className="text-lg text-emerald-600">ج.م</span></span>
                        {product.oldPrice && (
                            <span className="text-xl text-gray-400 line-through decoration-red-400 mb-1">{product.oldPrice} ج.م</span>
                        )}
                    </div>

                    <p className="text-gray-600 dark:text-gray-300 leading-loose text-base font-medium mb-8 border-b border-gray-100 dark:border-slate-800 pb-8">
                        {description}
                    </p>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-4 mb-8">
                        <div className="flex items-center bg-gray-100 dark:bg-slate-800 rounded-2xl p-1.5 border border-gray-200 dark:border-slate-700 w-fit">
                            <button 
                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                className="w-10 h-10 flex items-center justify-center bg-white dark:bg-slate-700 rounded-xl shadow-sm text-gray-600 dark:text-gray-300 hover:text-emerald-600 transition-colors"
                            >
                                <Minus size={18} />
                            </button>
                            <span className="w-12 text-center font-black text-lg text-gray-900 dark:text-white">{quantity}</span>
                            <button 
                                onClick={() => setQuantity(quantity + 1)}
                                className="w-10 h-10 flex items-center justify-center bg-white dark:bg-slate-700 rounded-xl shadow-sm text-gray-600 dark:text-gray-300 hover:text-emerald-600 transition-colors"
                            >
                                <Plus size={18} />
                            </button>
                        </div>

                        <button 
                            onClick={handleAddToCart}
                            className="flex-1 bg-gray-900 dark:bg-emerald-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-emerald-600 dark:hover:bg-emerald-700 transition-all shadow-lg hover:-translate-y-1 flex items-center justify-center gap-3"
                        >
                            <ShoppingBag size={22} /> إضافة للسلة
                        </button>
                        
                        <button className="p-4 rounded-2xl bg-gray-100 dark:bg-slate-800 text-gray-500 hover:text-red-500 transition-colors">
                            <Heart size={24} />
                        </button>
                    </div>

                    {/* Features */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-900/10 rounded-2xl border border-blue-100 dark:border-blue-900/30">
                            <Truck className="text-blue-500" size={24} />
                            <div className="flex flex-col">
                                <span className="font-bold text-blue-900 dark:text-blue-300 text-sm">توصيل سريع</span>
                                <span className="text-[10px] text-blue-700/70 dark:text-blue-400/70 font-bold">خلال 24 ساعة</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-4 bg-purple-50 dark:bg-purple-900/10 rounded-2xl border border-purple-100 dark:border-purple-900/30">
                            <ShieldCheck className="text-purple-500" size={24} />
                            <div className="flex flex-col">
                                <span className="font-bold text-purple-900 dark:text-purple-300 text-sm">منتج أصلي</span>
                                <span className="text-[10px] text-purple-700/70 dark:text-purple-400/70 font-bold">ضمان الجودة 100%</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* Related Products */}
        <div className="border-t border-gray-200 dark:border-slate-800 pt-12">
            <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-8">منتجات مشابهة</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {relatedProducts.map((p) => (
                    <div 
                        key={p.id} 
                        onClick={() => { onProductClick(p); window.scrollTo({top: 0, behavior: 'smooth'}); }}
                        className="group bg-white dark:bg-slate-900 rounded-[2rem] p-4 border border-gray-100 dark:border-slate-800 hover:border-emerald-200 dark:hover:border-emerald-900 transition-all cursor-pointer hover:-translate-y-1"
                    >
                        <div className="bg-gray-50 dark:bg-slate-800 rounded-2xl h-40 mb-4 overflow-hidden relative">
                            <img src={p.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={p.name} />
                        </div>
                        <h4 className="font-bold text-gray-900 dark:text-white text-sm line-clamp-2 mb-2 h-10">{p.name}</h4>
                        <div className="flex justify-between items-center">
                            <span className="font-black text-emerald-600 dark:text-emerald-400">{p.price} ج.م</span>
                            <div className="flex items-center gap-1 text-xs font-bold text-gray-500">
                                <Star size={10} className="fill-yellow-400 text-yellow-400" /> {p.rating}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>

      </div>
    </div>
  );
};

export default ProductDetailsPage;