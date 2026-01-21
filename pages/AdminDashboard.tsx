
import React, { useState } from 'react';
import { Page, User, Doctor, SystemSettings, Product, Order, BlogPost, ForumTopic, AdoptionPet } from '../types';
import { 
    LayoutDashboard, Users, Settings, LogOut, 
    Activity, AlertCircle, Search, 
    Shield, DollarSign, Stethoscope, CheckCircle, Clock, Package, FileText, ShoppingBag, Trash2, Plus, PenTool, PawPrint, ArrowRight
} from 'lucide-react';
import { Language, translations } from '../lib/translations';

interface AdminDashboardProps {
    setPage: (page: Page) => void;
    users: User[];
    doctors: Doctor[];
    settings: SystemSettings;
    products: Product[];
    orders: Order[];
    blogs: BlogPost[];
    forumTopics: ForumTopic[];
    adoptionPets: AdoptionPet[];
    onUpdateSettings: (settings: SystemSettings) => void;
    onVerifyDoctor: (id: string) => void;
    onDeleteDoctor: (id: string) => void;
    onBanUser: (id: string) => void;
    onAddProduct: (product: Product) => void;
    onDeleteProduct: (id: string) => void;
    onUpdateOrderStatus: (id: string, status: string) => void;
    onAddBlogPost: (post: BlogPost) => void;
    onEditBlogPost: (post: BlogPost) => void;
    onDeleteBlogPost: (id: string) => void;
    onDeleteForumTopic: (id: string | number) => void;
    onDeleteAdoption: (id: string) => void;
    onLogout: () => void;
    language: Language;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
    setPage, users, doctors, settings, products, orders, blogs, forumTopics, adoptionPets,
    onUpdateSettings, onVerifyDoctor, onDeleteDoctor, onBanUser, 
    onAddProduct, onDeleteProduct, onUpdateOrderStatus,
    onAddBlogPost, onEditBlogPost, onDeleteBlogPost, onDeleteForumTopic, onDeleteAdoption, onLogout,
    language
}) => {
    const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'doctors' | 'store' | 'content' | 'adoption' | 'settings'>('overview');
    const [storeSubTab, setStoreSubTab] = useState<'products' | 'orders'>('products');
    const [contentSubTab, setContentSubTab] = useState<'blogs' | 'forum'>('blogs');
    const [searchQuery, setSearchQuery] = useState('');
    
    const t = translations[language];
    
    // Settings Local State
    const [localSettings, setLocalSettings] = useState<SystemSettings>(settings);

    // Forms State
    const [isAddingProduct, setIsAddingProduct] = useState(false);
    const [newProduct, setNewProduct] = useState({ name: '', price: '', category: 'طعام', image: '' });

    // Blog Editing
    const [isWritingBlog, setIsWritingBlog] = useState(false);
    const [editingBlog, setEditingBlog] = useState<BlogPost | null>(null);
    const [blogForm, setBlogForm] = useState({ title: '', summary: '', content: '', category: 'نصائح طبية', image: '' });

    // --- Derived Stats ---
    const totalRevenue = 154300 + orders.reduce((acc, o) => acc + o.total, 0); 
    const pendingOrders = orders.filter(o => o.status === 'processing').length;
    const pendingDoctors = doctors.filter(d => !d.verified).length;

    // --- Actions ---
    const handleSaveProduct = () => {
        if(!newProduct.name || !newProduct.price) return;
        const product: Product = {
            id: Date.now().toString(),
            name: newProduct.name,
            price: parseFloat(newProduct.price),
            category: newProduct.category,
            image: newProduct.image || 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&q=80&w=300',
            rating: 5
        };
        onAddProduct(product);
        setIsAddingProduct(false);
        setNewProduct({ name: '', price: '', category: 'طعام', image: '' });
    };

    const handleSaveBlog = () => {
        if(!blogForm.title || !blogForm.content) return;
        
        if (editingBlog) {
            // Update Existing
            const updatedPost: BlogPost = {
                ...editingBlog,
                title: blogForm.title,
                summary: blogForm.summary,
                content: blogForm.content,
                category: blogForm.category,
                image: blogForm.image || editingBlog.image
            };
            onEditBlogPost(updatedPost);
        } else {
            // Create New
            const post: BlogPost = {
                id: Date.now().toString(),
                title: blogForm.title,
                summary: blogForm.summary,
                content: blogForm.content,
                category: blogForm.category,
                image: blogForm.image || 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=400',
                date: new Date().toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-US'),
                author: 'Admin'
            };
            onAddBlogPost(post);
        }
        
        setIsWritingBlog(false);
        setEditingBlog(null);
        setBlogForm({ title: '', summary: '', content: '', category: 'نصائح طبية', image: '' });
    };

    const startEditBlog = (blog: BlogPost) => {
        setEditingBlog(blog);
        setBlogForm({ 
            title: blog.title, 
            summary: blog.summary, 
            content: blog.content, 
            category: blog.category, 
            image: blog.image 
        });
        setIsWritingBlog(true);
    };

    const SidebarItem = ({ id, label, icon: Icon, badge }: any) => (
        <button 
            onClick={() => setActiveTab(id)}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-bold transition-all group mb-1 ${activeTab === id ? 'bg-slate-800 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'}`}
        >
            <div className="flex items-center gap-3">
                <Icon size={20} className={activeTab === id ? 'text-emerald-400' : 'text-slate-500 group-hover:text-emerald-500'} />
                {label}
            </div>
            {badge > 0 && <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">{badge}</span>}
        </button>
    );

    const isRtl = language === 'ar';

    return (
        <div className="min-h-screen bg-[#0f172a] text-slate-100 flex font-sans selection:bg-emerald-500 selection:text-white" dir={isRtl ? 'rtl' : 'ltr'}>
            
            {/* --- ADMIN SIDEBAR --- */}
            <aside className={`w-72 bg-slate-900 border-l border-slate-800 flex flex-col fixed h-full z-50 ${isRtl ? 'right-0 border-l' : 'left-0 border-r'}`}>
                <div className="p-6">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="bg-emerald-600 p-2 rounded-lg shadow-lg shadow-emerald-500/20">
                            <Shield className="text-white" size={24} />
                        </div>
                        <div>
                            <h1 className="text-xl font-black text-white tracking-tight">VetCare</h1>
                            <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Admin Panel v2.0</p>
                        </div>
                    </div>
                    <div className="h-px bg-slate-800 mb-6"></div>
                    
                    <nav className="space-y-1">
                        <SidebarItem id="overview" label={t.dashboard.overview} icon={LayoutDashboard} />
                        <SidebarItem id="users" label="Users" icon={Users} />
                        <SidebarItem id="doctors" label={t.doctors} icon={Stethoscope} badge={pendingDoctors} />
                        <SidebarItem id="store" label={t.shop} icon={ShoppingBag} badge={pendingOrders} />
                        <SidebarItem id="content" label="Content" icon={FileText} />
                        <SidebarItem id="adoption" label="Adoption" icon={PawPrint} />
                        <SidebarItem id="settings" label={t.dashboard.settings} icon={Settings} />
                    </nav>
                </div>

                <div className="mt-auto p-6 border-t border-slate-800 bg-slate-900/50">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center font-bold shadow-lg">A</div>
                        <div>
                            <p className="text-sm font-bold text-white">Super Admin</p>
                            <p className="text-xs text-slate-500">admin@vetcare.com</p>
                        </div>
                    </div>
                    <button onClick={onLogout} className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-red-400 bg-red-500/10 hover:bg-red-500/20 transition-all border border-red-500/20">
                        <LogOut size={18} /> {t.logout}
                    </button>
                </div>
            </aside>

            {/* --- MAIN CONTENT AREA --- */}
            <main className={`flex-1 p-8 lg:p-10 overflow-y-auto bg-[#0f172a] ${isRtl ? 'mr-72' : 'ml-72'}`}>
                
                {/* Header */}
                <header className="flex justify-between items-center mb-10">
                    <div>
                        <h2 className="text-3xl font-black text-white mb-1">
                            {activeTab === 'overview' && t.dashboard.overview}
                            {activeTab === 'store' && t.shop}
                            {activeTab === 'content' && 'Content Management'}
                            {activeTab === 'adoption' && 'Adoption Requests'}
                            {activeTab === 'doctors' && t.doctors}
                            {activeTab === 'users' && 'User Management'}
                            {activeTab === 'settings' && t.dashboard.settings}
                        </h2>
                        <p className="text-slate-400 text-sm">Welcome back to the command center.</p>
                    </div>
                    
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <input 
                                type="text" 
                                placeholder={language === 'ar' ? "بحث سريع..." : "Quick search..."}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className={`bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 w-64 focus:outline-none focus:border-emerald-500 text-sm font-bold text-white placeholder-slate-500 ${isRtl ? 'pl-10' : 'pr-10'}`}
                            />
                            <Search className={`absolute top-1/2 -translate-y-1/2 text-slate-500 ${isRtl ? 'left-3' : 'right-3'}`} size={16} />
                        </div>
                        <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center text-slate-400 border border-slate-700 relative">
                            <AlertCircle size={20} />
                            {pendingOrders > 0 && <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-slate-800"></span>}
                        </div>
                    </div>
                </header>

                {/* --- DASHBOARD CONTENT --- */}
                
                {activeTab === 'overview' && (
                    <div className="space-y-8 animate-fade-in">
                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            {[
                                { title: t.dashboard.totalPatients, val: users.length, icon: Users, color: 'bg-blue-500' },
                                { title: t.doctors, val: doctors.length, icon: Stethoscope, color: 'bg-emerald-500' },
                                { title: t.dashboard.revenue, val: `${(totalRevenue/1000).toFixed(1)}k`, icon: DollarSign, color: 'bg-orange-500' },
                                { title: t.dashboard.todayReq, val: pendingOrders, icon: Package, color: 'bg-purple-500' }
                            ].map((stat, i) => (
                                <div key={i} className="bg-slate-800 p-6 rounded-2xl border border-slate-700 relative overflow-hidden group">
                                    <div className={`absolute top-0 right-0 w-20 h-20 opacity-10 rounded-bl-3xl ${stat.color}`}></div>
                                    <div className="relative z-10">
                                        <div className={`w-12 h-12 rounded-xl ${stat.color} bg-opacity-20 flex items-center justify-center mb-4 text-white`}>
                                            <stat.icon size={24} className={stat.color.replace('bg-', 'text-')} />
                                        </div>
                                        <h3 className="text-3xl font-black text-white mb-1">{stat.val}</h3>
                                        <p className="text-slate-400 text-xs font-bold">{stat.title}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Revenue Visualization (CSS Bar Chart) */}
                        <div className="bg-slate-800 rounded-3xl p-8 border border-slate-700">
                            <div className="flex justify-between items-center mb-8">
                                <h3 className="text-lg font-bold text-white flex items-center gap-2"><Activity size={20} className="text-emerald-500"/> Activity (Last 7 Days)</h3>
                            </div>
                            <div className="flex items-end justify-between gap-4 h-48 w-full">
                                {[45, 70, 30, 85, 55, 65, 90].map((h, i) => (
                                    <div key={i} className="w-full bg-slate-700/50 rounded-t-xl relative group overflow-hidden">
                                        <div className="absolute bottom-0 w-full bg-emerald-500 hover:bg-emerald-400 transition-all duration-500 rounded-t-xl" style={{ height: `${h}%` }}></div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* --- STORE MANAGEMENT --- */}
                {activeTab === 'store' && (
                    <div className="space-y-6 animate-fade-in">
                        <div className="flex gap-4 border-b border-slate-800 pb-1">
                            <button onClick={() => setStoreSubTab('products')} className={`pb-3 text-sm font-bold transition-all border-b-2 ${storeSubTab === 'products' ? 'border-emerald-500 text-emerald-400' : 'border-transparent text-slate-400 hover:text-white'}`}>Products</button>
                            <button onClick={() => setStoreSubTab('orders')} className={`pb-3 text-sm font-bold transition-all border-b-2 ${storeSubTab === 'orders' ? 'border-emerald-500 text-emerald-400' : 'border-transparent text-slate-400 hover:text-white'}`}>Orders ({pendingOrders})</button>
                        </div>

                        {storeSubTab === 'products' && (
                            <>
                                <div className="flex justify-end">
                                    <button onClick={() => setIsAddingProduct(true)} className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-2 transition-colors">
                                        <Plus size={16} /> Add Product
                                    </button>
                                </div>

                                {isAddingProduct && (
                                    <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 mb-6 animate-slide-up">
                                        <h4 className="font-bold mb-4 text-white">New Product</h4>
                                        <div className="grid grid-cols-2 gap-4 mb-4">
                                            <input placeholder="Name" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} className="bg-slate-900 border border-slate-700 rounded-lg p-3 text-white text-sm" />
                                            <input placeholder="Price" type="number" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} className="bg-slate-900 border border-slate-700 rounded-lg p-3 text-white text-sm" />
                                            <select value={newProduct.category} onChange={e => setNewProduct({...newProduct, category: e.target.value})} className="bg-slate-900 border border-slate-700 rounded-lg p-3 text-white text-sm">
                                                <option>طعام</option><option>أدوية</option><option>اكسسوارات</option><option>عناية</option>
                                            </select>
                                            <input placeholder="Image URL" value={newProduct.image} onChange={e => setNewProduct({...newProduct, image: e.target.value})} className="bg-slate-900 border border-slate-700 rounded-lg p-3 text-white text-sm" />
                                        </div>
                                        <div className="flex gap-2">
                                            <button onClick={handleSaveProduct} className="bg-emerald-600 text-white px-6 py-2 rounded-lg font-bold text-sm">Save</button>
                                            <button onClick={() => setIsAddingProduct(false)} className="text-slate-400 px-4 py-2 text-sm">Cancel</button>
                                        </div>
                                    </div>
                                )}

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {products.map(product => (
                                        <div key={product.id} className="bg-slate-800 rounded-xl p-4 border border-slate-700 flex gap-4 group">
                                            <img src={product.image} className="w-16 h-16 rounded-lg object-cover bg-slate-700" alt={product.name}/>
                                            <div className="flex-1">
                                                <h4 className="font-bold text-white text-sm line-clamp-1">{product.name}</h4>
                                                <p className="text-xs text-slate-400 mb-2">{product.category}</p>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-emerald-400 font-bold">{product.price} {t.currency}</span>
                                                    <button onClick={() => onDeleteProduct(product.id)} className="text-red-400 p-1.5 hover:bg-red-500/10 rounded-lg transition-colors"><Trash2 size={16}/></button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}

                        {storeSubTab === 'orders' && (
                            <div className="bg-slate-800 rounded-2xl overflow-hidden border border-slate-700">
                                <table className={`w-full text-sm ${isRtl ? 'text-right' : 'text-left'}`}>
                                    <thead className="bg-slate-900 text-slate-400 font-bold">
                                        <tr>
                                            <th className="p-4">ID</th>
                                            <th className="p-4">Date</th>
                                            <th className="p-4">Items</th>
                                            <th className="p-4">Total</th>
                                            <th className="p-4">Status</th>
                                            <th className="p-4">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-700">
                                        {orders.map(order => (
                                            <tr key={order.id} className="hover:bg-slate-700/30 transition-colors">
                                                <td className="p-4 font-bold">{order.id}</td>
                                                <td className="p-4 text-slate-400">{order.date}</td>
                                                <td className="p-4 text-slate-300">{order.items.join(', ')}</td>
                                                <td className="p-4 font-bold text-emerald-400">{order.total} {t.currency}</td>
                                                <td className="p-4">
                                                    <span className={`px-2 py-1 rounded text-xs font-bold ${order.status === 'delivered' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-blue-500/10 text-blue-400'}`}>
                                                        {order.status}
                                                    </span>
                                                </td>
                                                <td className="p-4">
                                                    {order.status !== 'delivered' && (
                                                        <button onClick={() => onUpdateOrderStatus(order.id, 'delivered')} className="bg-emerald-600 text-white px-3 py-1 rounded-lg text-xs font-bold hover:bg-emerald-500">
                                                            Deliver
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}

                {/* --- CONTENT MANAGEMENT --- */}
                {activeTab === 'content' && (
                    <div className="space-y-6 animate-fade-in">
                        <div className="flex gap-4 border-b border-slate-800 pb-1">
                            <button onClick={() => setContentSubTab('blogs')} className={`pb-3 text-sm font-bold transition-all border-b-2 ${contentSubTab === 'blogs' ? 'border-emerald-500 text-emerald-400' : 'border-transparent text-slate-400 hover:text-white'}`}>Blogs</button>
                            <button onClick={() => setContentSubTab('forum')} className={`pb-3 text-sm font-bold transition-all border-b-2 ${contentSubTab === 'forum' ? 'border-emerald-500 text-emerald-400' : 'border-transparent text-slate-400 hover:text-white'}`}>Forum</button>
                        </div>

                        {contentSubTab === 'blogs' && (
                            <>
                                <div className="flex justify-end">
                                    <button onClick={() => { setIsWritingBlog(true); setEditingBlog(null); setBlogForm({ title: '', summary: '', content: '', category: 'نصائح طبية', image: '' }); }} className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-2 transition-colors">
                                        <PenTool size={16} /> Write Blog
                                    </button>
                                </div>

                                {isWritingBlog && (
                                    <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 mb-6 animate-slide-up">
                                        <h4 className="font-bold mb-4 text-white">{editingBlog ? 'Edit Blog' : 'New Blog'}</h4>
                                        <input placeholder="Title" value={blogForm.title} onChange={e => setBlogForm({...blogForm, title: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white text-sm mb-3" />
                                        <input placeholder="Summary" value={blogForm.summary} onChange={e => setBlogForm({...blogForm, summary: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white text-sm mb-3" />
                                        <textarea placeholder="Content..." value={blogForm.content} onChange={e => setBlogForm({...blogForm, content: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white text-sm mb-3 h-32" />
                                        <div className="flex gap-2">
                                            <button onClick={handleSaveBlog} className="bg-purple-600 text-white px-6 py-2 rounded-lg font-bold text-sm">Publish</button>
                                            <button onClick={() => setIsWritingBlog(false)} className="text-slate-400 px-4 py-2 text-sm">Cancel</button>
                                        </div>
                                    </div>
                                )}

                                <div className="space-y-4">
                                    {blogs.map(blog => (
                                        <div key={blog.id} className="flex gap-4 bg-slate-800 p-4 rounded-xl border border-slate-700">
                                            <img src={blog.image} className="w-24 h-24 rounded-lg object-cover bg-slate-700" alt=""/>
                                            <div className="flex-1">
                                                <h3 className="font-bold text-white text-lg">{blog.title}</h3>
                                                <p className="text-slate-400 text-sm line-clamp-2 mt-1">{blog.summary}</p>
                                                <div className="mt-2 flex justify-between items-center">
                                                    <div className="flex gap-4 text-xs text-slate-500">
                                                        <span>{blog.date}</span>
                                                        <span>{blog.author}</span>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <button onClick={() => startEditBlog(blog)} className="text-blue-400 bg-blue-500/10 px-3 py-1 rounded text-xs hover:bg-blue-500/20">Edit</button>
                                                        <button onClick={() => onDeleteBlogPost(blog.id)} className="text-red-400 bg-red-500/10 px-3 py-1 rounded text-xs hover:bg-red-500/20">Delete</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}

                        {contentSubTab === 'forum' && (
                            <div className="space-y-4">
                                {forumTopics.map(topic => (
                                    <div key={topic.id} className="bg-slate-800 p-4 rounded-xl border border-slate-700 flex justify-between items-center">
                                        <div>
                                            <h4 className="font-bold text-white text-sm">{topic.title}</h4>
                                            <p className="text-xs text-slate-400 mt-1">By: {topic.author} • {topic.replies} replies</p>
                                        </div>
                                        <button onClick={() => onDeleteForumTopic(topic.id)} className="bg-red-500/10 text-red-400 p-2 rounded-lg hover:bg-red-500/20 transition-colors">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* --- ADOPTION MANAGEMENT --- */}
                {activeTab === 'adoption' && (
                    <div className="space-y-6 animate-fade-in">
                        <h3 className="font-bold text-white mb-4">Current Adoption Requests</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {adoptionPets.map(pet => (
                                <div key={pet.id} className="bg-slate-800 rounded-xl overflow-hidden border border-slate-700">
                                    <div className="relative h-40">
                                        <img src={pet.image} alt={pet.name} className="w-full h-full object-cover" />
                                        <div className="absolute top-2 right-2 bg-black/60 px-2 py-1 rounded text-xs font-bold text-white">{pet.status}</div>
                                    </div>
                                    <div className="p-4">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <h4 className="font-bold text-white">{pet.name}</h4>
                                                <p className="text-xs text-slate-400">{pet.type} • {pet.age}</p>
                                            </div>
                                            <button onClick={() => onDeleteAdoption(pet.id)} className="text-red-400 bg-red-500/10 p-2 rounded hover:bg-red-500/20">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                        <p className="text-xs text-slate-500 mb-2">Owner: {pet.ownerName}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* --- USERS & DOCTORS --- */}
                {(activeTab === 'users' || activeTab === 'doctors') && (
                    <div className="bg-slate-800 rounded-2xl overflow-hidden border border-slate-700 animate-fade-in">
                        <table className={`w-full text-sm ${isRtl ? 'text-right' : 'text-left'}`}>
                            <thead className="bg-slate-900 text-slate-400 font-bold">
                                <tr>
                                    <th className="p-4">Name</th>
                                    {activeTab === 'doctors' && <th className="p-4">Specialty</th>}
                                    <th className="p-4">Status</th>
                                    <th className="p-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-700 text-slate-200">
                                {(activeTab === 'users' ? users : doctors).map((item: any) => (
                                    <tr key={item.id} className="hover:bg-slate-700/30">
                                        <td className="p-4 font-bold">{item.name}</td>
                                        {activeTab === 'doctors' && <td className="p-4 text-slate-400">{item.specialty}</td>}
                                        <td className="p-4">
                                            {item.verified ? <span className="text-emerald-400 flex items-center gap-1"><CheckCircle size={12}/> Verified</span> : 
                                             item.status === 'banned' ? <span className="text-red-400">Banned</span> :
                                             <span className="text-orange-400 flex items-center gap-1"><Clock size={12}/> Pending</span>}
                                        </td>
                                        <td className="p-4 flex gap-2">
                                            {activeTab === 'doctors' && !item.verified && (
                                                <button onClick={() => onVerifyDoctor(item.id)} className="text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded text-xs hover:bg-emerald-500/20">Verify</button>
                                            )}
                                            {activeTab === 'doctors' && (
                                                <button onClick={() => onDeleteDoctor(item.id)} className="text-red-400 bg-red-500/10 px-3 py-1 rounded text-xs hover:bg-red-500/20">Delete</button>
                                            )}
                                            {activeTab === 'users' && (
                                                <button onClick={() => onBanUser(item.id)} className="text-red-400 bg-red-500/10 px-3 py-1 rounded text-xs hover:bg-red-500/20">Ban</button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* --- SETTINGS --- */}
                {activeTab === 'settings' && (
                    <div className="max-w-2xl bg-slate-800 rounded-2xl p-8 border border-slate-700 animate-fade-in">
                        <h3 className="font-bold text-white text-lg mb-6 flex items-center gap-2"><Settings size={20}/> System Settings</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-2">Site Name</label>
                                <input value={localSettings.siteName} onChange={e => setLocalSettings({...localSettings, siteName: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white text-sm" />
                            </div>
                            <div className="flex items-center justify-between p-4 bg-slate-900 rounded-xl border border-slate-700">
                                <span className="font-bold text-sm">Maintenance Mode</span>
                                <button onClick={() => setLocalSettings({...localSettings, maintenanceMode: !localSettings.maintenanceMode})} className={`w-10 h-5 rounded-full relative transition-colors ${localSettings.maintenanceMode ? 'bg-emerald-500' : 'bg-slate-600'}`}>
                                    <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${localSettings.maintenanceMode ? 'left-1' : 'right-1'}`}></div>
                                </button>
                            </div>
                            <button onClick={() => onUpdateSettings(localSettings)} className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-500 mt-4">Save Changes</button>
                        </div>
                    </div>
                )}

            </main>
        </div>
    );
};

export default AdminDashboard;
