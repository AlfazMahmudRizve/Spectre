'use client';

import { useState } from 'react';
import { Shield, Activity, Users, Box, Search, Plus, Package, LayoutDashboard, ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function DashboardClient({
    initialOrders,
    initialUsers,
    initialProducts,
    userRole,
    userName
}: {
    initialOrders: any[],
    initialUsers: any[],
    initialProducts: any[],
    userRole: string,
    userName: string
}) {
    const [activeTab, setActiveTab] = useState('overview');
    const [orders, setOrders] = useState(initialOrders);
    const [products, setProducts] = useState(initialProducts); // Local state for products

    // Search / Filter States
    const [searchQuery, setSearchQuery] = useState('');

    // Add Product Form State
    const [isAddingProduct, setIsAddingProduct] = useState(false);
    const [newProduct, setNewProduct] = useState({
        name: '',
        price: '',
        stock: '',
        image: '',
        description: ''
    });

    const filteredOrders = orders.filter(order =>
        order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleAddProduct = async (e: React.FormEvent) => {
        e.preventDefault();
        // In a real app, upload image -> get URL.
        // Here we just use the text field.

        try {
            const res = await fetch('/api/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: newProduct.name,
                    price: parseFloat(newProduct.price),
                    stock: parseInt(newProduct.stock),
                    image: newProduct.image || '/images/spectre-carbon/1.webp', // Fallback
                    description: newProduct.description
                })
            });

            if (res.ok) {
                const addedProduct = await res.json();
                setProducts([...products, addedProduct]); // Update local list
                setIsAddingProduct(false);
                setNewProduct({ name: '', price: '', stock: '', image: '', description: '' });
                alert('Arsenal Updated.');
            } else {
                alert('Failed to authorize new asset.');
            }
        } catch (error) {
            console.error(error);
            alert('System Error.');
        }
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white font-mono selection:bg-[#00F0FF] selection:text-black">
            {/* Sidebar */}
            <aside className="fixed left-0 top-0 h-full w-64 bg-black/40 backdrop-blur-xl border-r border-white/10 z-50">
                <div className="p-8 border-b border-white/10">
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="relative w-8 h-8">
                            <Image src="/images/logo.png" alt="Spectre" fill className="object-contain" />
                        </div>
                        <span className="font-grotesk font-bold text-lg tracking-widest group-hover:text-[#00F0FF] transition-colors">SPECTRE</span>
                    </Link>
                </div>

                <nav className="p-4 space-y-2">
                    <button
                        onClick={() => setActiveTab('overview')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded text-xs tracking-widest transition-all ${activeTab === 'overview' ? 'bg-[#00F0FF]/10 text-[#00F0FF] border border-[#00F0FF]/20' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                    >
                        <LayoutDashboard size={14} />
                        OVERVIEW
                    </button>
                    <button
                        onClick={() => setActiveTab('orders')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded text-xs tracking-widest transition-all ${activeTab === 'orders' ? 'bg-[#00F0FF]/10 text-[#00F0FF] border border-[#00F0FF]/20' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                    >
                        <Activity size={14} />
                        ORDERS
                        <span className="ml-auto bg-white/10 px-1.5 py-0.5 rounded text-[10px] text-white">{orders.length}</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('inventory')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded text-xs tracking-widest transition-all ${activeTab === 'inventory' ? 'bg-[#00F0FF]/10 text-[#00F0FF] border border-[#00F0FF]/20' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                    >
                        <Box size={14} />
                        INVENTORY
                    </button>
                    <button
                        onClick={() => setActiveTab('users')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded text-xs tracking-widest transition-all ${activeTab === 'users' ? 'bg-[#00F0FF]/10 text-[#00F0FF] border border-[#00F0FF]/20' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                    >
                        <Users size={14} />
                        OPERATIVES
                        <span className="ml-auto bg-white/10 px-1.5 py-0.5 rounded text-[10px] text-white">{initialUsers.length}</span>
                    </button>
                </nav>

                <div className="absolute bottom-0 w-full p-6 border-t border-white/10">
                    <div className="flex items-center gap-3 opacity-50">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-[10px] uppercase">System Online</span>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="ml-64 p-8">
                {/* Header */}
                <header className="flex justify-between items-end mb-12">
                    <div>
                        <h1 className="text-3xl font-grotesk font-bold text-white mb-2">COMMAND CENTER</h1>
                        <p className="text-xs text-gray-400 tracking-widest">WELCOME BACK, {userName.toUpperCase()}</p>
                    </div>
                    {activeTab === 'inventory' && (
                        <button
                            onClick={() => setIsAddingProduct(true)}
                            className="bg-[#00F0FF] text-black px-6 py-2 text-xs font-bold rounded flex items-center gap-2 hover:bg-white transition-colors"
                        >
                            <Plus size={14} />
                            ADD ASSET
                        </button>
                    )}
                </header>

                {/* Dashboard Stats (Overview) */}
                {activeTab === 'overview' && (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                        {[
                            { label: 'TOTAL ORDERS', value: orders.length, icon: Package },
                            { label: 'REVENUE', value: `$${orders.reduce((acc, o) => acc + o.total, 0).toLocaleString()}`, icon: Activity },
                            { label: 'ACTIVE USERS', value: initialUsers.length, icon: Users },
                            { label: 'SECURITY LEVEL', value: 'MAXIMUM', icon: Shield },
                        ].map((stat) => (
                            <div key={stat.label} className="p-6 bg-white/5 border border-white/10 rounded overflow-hidden relative group">
                                <div className="absolute top-0 left-0 w-1 h-full bg-[#00F0FF] opacity-0 group-hover:opacity-100 transition-opacity" />
                                <div className="flex justify-between items-start mb-4">
                                    <span className="text-[10px] text-gray-500 tracking-widest">{stat.label}</span>
                                    <stat.icon className="text-[#00F0FF]" size={16} />
                                </div>
                                <div className="text-2xl font-bold font-grotesk">{stat.value}</div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Inventory Tab */}
                {activeTab === 'inventory' && (
                    <div className="space-y-6">
                        {isAddingProduct && (
                            <div className="p-6 bg-white/5 border border-[#00F0FF]/30 rounded mb-8 animate-in fade-in slide-in-from-top-4">
                                <h3 className="text-sm font-bold text-[#00F0FF] mb-6">NEW ASSET ENTRY</h3>
                                <form onSubmit={handleAddProduct} className="grid grid-cols-2 gap-6">
                                    <div className="col-span-2 md:col-span-1">
                                        <label className="text-[10px] text-gray-500 block mb-2">PRODUCT NAME</label>
                                        <input
                                            value={newProduct.name}
                                            onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                                            className="w-full bg-black border border-white/20 p-2 text-xs text-white focus:border-[#00F0FF] outline-none"
                                            placeholder="SPECTRE X-1"
                                            required
                                        />
                                    </div>
                                    <div className="col-span-2 md:col-span-1">
                                        <label className="text-[10px] text-gray-500 block mb-2">PRICE (USD)</label>
                                        <input
                                            type="number"
                                            value={newProduct.price}
                                            onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                                            className="w-full bg-black border border-white/20 p-2 text-xs text-white focus:border-[#00F0FF] outline-none"
                                            placeholder="999"
                                            required
                                        />
                                    </div>
                                    <div className="col-span-2 md:col-span-1">
                                        <label className="text-[10px] text-gray-500 block mb-2">STOCK COUNT</label>
                                        <input
                                            type="number"
                                            value={newProduct.stock}
                                            onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                                            className="w-full bg-black border border-white/20 p-2 text-xs text-white focus:border-[#00F0FF] outline-none"
                                            placeholder="50"
                                            required
                                        />
                                    </div>
                                    <div className="col-span-2 md:col-span-1">
                                        <label className="text-[10px] text-gray-500 block mb-2">IMAGE URL</label>
                                        <input
                                            value={newProduct.image}
                                            onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
                                            className="w-full bg-black border border-white/20 p-2 text-xs text-white focus:border-[#00F0FF] outline-none"
                                            placeholder="/images/..."
                                        />
                                    </div>
                                    <div className="col-span-2">
                                        <label className="text-[10px] text-gray-500 block mb-2">DESCRIPTION</label>
                                        <textarea
                                            value={newProduct.description}
                                            onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                                            className="w-full bg-black border border-white/20 p-2 text-xs text-white focus:border-[#00F0FF] outline-none h-20"
                                            placeholder="Detailed specs..."
                                        />
                                    </div>
                                    <div className="col-span-2 flex gap-4 mt-2">
                                        <button type="submit" className="bg-[#00F0FF] text-black px-6 py-2 text-xs font-bold hover:bg-white transition-colors">AUTHORIZE ASSET</button>
                                        <button type="button" onClick={() => setIsAddingProduct(false)} className="text-gray-500 text-xs hover:text-white transition-colors">CANCEL</button>
                                    </div>
                                </form>
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {products.map((product) => (
                                <div key={product.id} className="bg-white/5 border border-white/10 rounded p-4 flex gap-4 group hover:border-[#00F0FF]/50 transition-colors">
                                    <div className="w-20 h-20 bg-black rounded relative overflow-hidden">
                                        <Image src={product.image || '/images/spectre-carbon/1.webp'} alt={product.name} fill className="object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white text-sm">{product.name}</h4>
                                        <p className="text-[#00F0FF] text-xs font-mono mt-1">${product.price}</p>
                                        <div className="flex items-center gap-2 mt-2">
                                            <div className={`w-1.5 h-1.5 rounded-full ${product.stock > 0 ? 'bg-green-500' : 'bg-red-500'}`} />
                                            <span className="text-[10px] text-gray-400">{product.stock} UNITS</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Orders Tab (Existing) */}
                {(activeTab === 'orders' || activeTab === 'overview') && (
                    <>
                        {activeTab === 'orders' && (
                            <div className="relative mb-6">
                                <Search className="absolute left-4 top-3 text-gray-500" size={14} />
                                <input
                                    type="text"
                                    placeholder="SEARCH ORDER ID OR EMAIL..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded py-2.5 pl-10 pr-4 text-xs focus:outline-none focus:border-[#00F0FF] transition-colors"
                                />
                            </div>
                        )}

                        <div className="space-y-4">
                            {/* Table Header */}
                            <div className="grid grid-cols-12 gap-4 px-4 py-2 text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                                <div className="col-span-3">Order ID</div>
                                <div className="col-span-3">Operative</div>
                                <div className="col-span-2">Date</div>
                                <div className="col-span-2">Status</div>
                                <div className="col-span-2 text-right">Value</div>
                            </div>

                            {filteredOrders.map((order) => (
                                <div key={order.id} className="grid grid-cols-12 gap-4 px-4 py-4 bg-white/5 border border-white/10 rounded items-center hover:bg-white/10 transition-colors group">
                                    <div className="col-span-3 font-mono text-xs text-white group-hover:text-[#00F0FF] transition-colors">{order.id}</div>
                                    <div className="col-span-3 text-xs text-gray-300">{order.email}</div>
                                    <div className="col-span-2 text-[10px] text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</div>
                                    <div className="col-span-2">
                                        <span className={`px-2 py-1 rounded text-[10px] font-bold ${order.status === 'SHIPPED' ? 'bg-green-500/20 text-green-500' :
                                            order.status === 'PROCESSING' ? 'bg-blue-500/20 text-blue-500' :
                                                'bg-yellow-500/20 text-yellow-500'
                                            }`}>
                                            {order.status}
                                        </span>
                                    </div>
                                    <div className="col-span-2 text-right font-mono text-xs text-white">${order.total}</div>
                                </div>
                            ))}

                            {filteredOrders.length === 0 && (
                                <div className="text-center py-12 text-gray-500 text-xs">NO DATA FOUND</div>
                            )}
                        </div>
                    </>
                )}
            </main>
        </div>
    );
}
