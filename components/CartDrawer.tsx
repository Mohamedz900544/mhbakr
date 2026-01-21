
import React, { useState } from 'react';
import { X, Minus, Plus, ShoppingBag, Trash2, CreditCard, CheckCircle, MapPin, Phone } from 'lucide-react';
import { CartItem, Order } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onRemove: (id: string) => void;
  onUpdateQuantity: (id: string, delta: number) => void;
  onClearCart: () => void;
  onAddOrder: (order: Order) => void; 
}

const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose, items, onRemove, onUpdateQuantity, onClearCart, onAddOrder }) => {
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'details' | 'processing' | 'success'>('cart');
  
  // Checkout Form State
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card'>('cash');

  const total = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  const handleProceedToDetails = () => {
      setCheckoutStep('details');
  };

  const handleConfirmOrder = () => {
    if (!address || !phone) return;

    setCheckoutStep('processing');
    
    const newOrder: Order = {
        id: Date.now().toString(),
        date: new Date().toLocaleDateString('ar-EG'),
        status: 'processing',
        items: items.map(i => `${i.name} (x${i.quantity})`),
        total: total,
        address: address,
        phone: phone,
        paymentMethod: paymentMethod
    };

    onAddOrder(newOrder);

    setTimeout(() => {
        setCheckoutStep('success');
        setTimeout(() => {
            onClearCart();
            setCheckoutStep('cart');
            setAddress('');
            setPhone('');
            onClose();
        }, 3000);
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
        onClick={onClose}
      ></div>
      <div className="fixed top-0 left-0 bottom-0 w-full max-w-md bg-white dark:bg-slate-900 z-[60] shadow-2xl animate-fade-in flex flex-col border-r border-gray-100 dark:border-slate-800 transition-colors duration-300">
        
        {/* Header */}
        <div className="p-6 border-b border-gray-100 dark:border-slate-800 flex items-center justify-between bg-gray-50/50 dark:bg-slate-900">
          <div className="flex items-center gap-3">
             <ShoppingBag className="text-gray-900 dark:text-white" />
             <h2 className="text-xl font-black text-gray-900 dark:text-white">
                 {checkoutStep === 'cart' && 'سلة المشتريات'}
                 {checkoutStep === 'details' && 'بيانات التوصيل'}
                 {(checkoutStep === 'processing' || checkoutStep === 'success') && 'إتمام الطلب'}
             </h2>
             {checkoutStep === 'cart' && <span className="bg-emerald-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">{items.length}</span>}
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-colors text-gray-500 dark:text-gray-400">
             <X size={20} />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6">
            
            {/* STEP 1: CART ITEMS */}
            {checkoutStep === 'cart' && (
                items.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center text-gray-400 dark:text-slate-600">
                        <ShoppingBag size={64} className="mb-4 opacity-20" />
                        <p className="font-bold text-lg text-gray-500 dark:text-gray-400">السلة فاضية!</p>
                        <button onClick={onClose} className="mt-6 text-emerald-600 dark:text-emerald-400 font-bold hover:underline">
                        العودة للمتجر
                        </button>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {items.map(item => (
                            <div key={item.id} className="flex gap-4">
                                <div className="w-20 h-20 rounded-xl bg-gray-100 dark:bg-slate-800 flex-shrink-0 overflow-hidden border border-gray-200 dark:border-slate-700">
                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-bold text-gray-900 dark:text-white text-sm line-clamp-2 mb-1">{item.name}</h3>
                                    <p className="text-emerald-600 dark:text-emerald-400 font-bold text-sm mb-3">{item.price * item.quantity} ج.م</p>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3 bg-gray-50 dark:bg-slate-800 rounded-lg p-1 border border-gray-100 dark:border-slate-700">
                                            <button onClick={() => onUpdateQuantity(item.id, -1)} className="w-6 h-6 flex items-center justify-center bg-white dark:bg-slate-700 rounded shadow-sm text-gray-600 dark:text-gray-300 hover:text-red-500 disabled:opacity-50" disabled={item.quantity <= 1}>
                                                <Minus size={12} />
                                            </button>
                                            <span className="text-xs font-bold w-4 text-center text-gray-900 dark:text-white">{item.quantity}</span>
                                            <button onClick={() => onUpdateQuantity(item.id, 1)} className="w-6 h-6 flex items-center justify-center bg-white dark:bg-slate-700 rounded shadow-sm text-gray-600 dark:text-gray-300 hover:text-emerald-500">
                                                <Plus size={12} />
                                            </button>
                                        </div>
                                        <button onClick={() => onRemove(item.id)} className="text-gray-400 hover:text-red-500 transition-colors p-2">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )
            )}

            {/* STEP 2: DETAILS FORM */}
            {checkoutStep === 'details' && (
                <div className="space-y-6 animate-fade-in">
                    <div>
                        <label className="block text-sm font-bold text-gray-500 mb-2">العنوان بالتفصيل</label>
                        <div className="relative">
                            <input 
                                type="text" 
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                placeholder="المنطقة، الشارع، رقم العمارة"
                                className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl py-3 px-4 pl-10 text-sm font-bold focus:outline-none focus:border-emerald-500 transition-colors dark:text-white"
                            />
                            <MapPin size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-500 mb-2">رقم الهاتف</label>
                        <div className="relative">
                            <input 
                                type="tel" 
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                placeholder="01xxxxxxxxx"
                                className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl py-3 px-4 pl-10 text-sm font-bold focus:outline-none focus:border-emerald-500 transition-colors dark:text-white"
                            />
                            <Phone size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-500 mb-2">طريقة الدفع</label>
                        <div className="grid grid-cols-2 gap-3">
                            <button 
                                onClick={() => setPaymentMethod('cash')}
                                className={`p-4 rounded-xl border-2 text-sm font-bold transition-all ${paymentMethod === 'cash' ? 'border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400' : 'border-gray-100 dark:border-slate-700 text-gray-500'}`}
                            >
                                الدفع عند الاستلام
                            </button>
                            <button 
                                onClick={() => setPaymentMethod('card')}
                                className={`p-4 rounded-xl border-2 text-sm font-bold transition-all ${paymentMethod === 'card' ? 'border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400' : 'border-gray-100 dark:border-slate-700 text-gray-500'}`}
                            >
                                بطاقة ائتمان (قريباً)
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* STEP 3: PROCESSING */}
            {checkoutStep === 'processing' && (
                <div className="flex flex-col items-center justify-center h-full text-center animate-fade-in">
                    <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">جاري تأكيد الطلب...</h3>
                    <p className="text-gray-500 dark:text-gray-400 mt-2">برجاء الانتظار قليلاً</p>
                </div>
            )}

            {/* STEP 4: SUCCESS */}
            {checkoutStep === 'success' && (
                <div className="flex flex-col items-center justify-center h-full text-center animate-fade-in">
                    <div className="w-24 h-24 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mb-6 animate-bounce">
                        <CheckCircle size={48} className="text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <h3 className="text-2xl font-black text-gray-900 dark:text-white">تم استلام الطلب!</h3>
                    <p className="text-gray-500 dark:text-gray-400 mt-2 text-lg">سيتصل بك المندوب قريباً لتأكيد العنوان.</p>
                </div>
            )}
        </div>

        {/* Footer Actions */}
        {items.length > 0 && checkoutStep !== 'processing' && checkoutStep !== 'success' && (
          <div className="p-6 border-t border-gray-100 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-900">
             <div className="flex justify-between items-center mb-4 text-sm">
                <span className="text-gray-500 dark:text-gray-400 font-bold">الإجمالي</span>
                <span className="text-2xl font-black text-gray-900 dark:text-white">{total} ج.م</span>
             </div>
             
             {checkoutStep === 'cart' ? (
                 <button 
                    onClick={handleProceedToDetails}
                    className="w-full bg-gray-900 dark:bg-emerald-600 text-white py-4 rounded-xl font-bold hover:bg-emerald-600 dark:hover:bg-emerald-700 transition-colors shadow-lg flex items-center justify-center gap-2"
                 >
                    متابعة الشراء
                 </button>
             ) : (
                 <div className="flex gap-3">
                     <button 
                        onClick={() => setCheckoutStep('cart')}
                        className="flex-1 bg-gray-200 dark:bg-slate-700 text-gray-600 dark:text-gray-300 py-4 rounded-xl font-bold hover:bg-gray-300 dark:hover:bg-slate-600 transition-colors"
                     >
                        رجوع
                     </button>
                     <button 
                        onClick={handleConfirmOrder}
                        disabled={!address || !phone}
                        className={`flex-[2] py-4 rounded-xl font-bold text-white transition-colors shadow-lg flex items-center justify-center gap-2 ${!address || !phone ? 'bg-gray-400 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-700'}`}
                     >
                        <CreditCard size={18} />
                        تأكيد الطلب
                     </button>
                 </div>
             )}
          </div>
        )}

      </div>
    </>
  );
};

export default CartDrawer;
