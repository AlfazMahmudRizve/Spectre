'use client';

import { useState } from 'react';
import { Shield, Activity, Users, Box, Search, Plus, Package, LayoutDashboard, ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function DashboardClient({ initialData, user }: { initialData: any, user: any }) {
    const [activeTab, setActiveTab] = useState('overview');
    const [products, setProducts] = useState(initialData.products);
    const [orders, setOrders] = useState(initialData.orders);

    // Form State
    const [isAdding, setIsAdding] = useState(false);
    const [newProduct, setNewProduct] = useState({ name: '', price: '', stock: '', image: '', description: '' });

    const handleAddProduct = async (e: React.FormEvent) => {
        e.preventDefault();
        const res = await fetch('/api/products', {
            method: 'POST',
            body: JSON.stringify(newProduct),
        });
        if (res.ok) {
            const data = await res.json();
            setProducts([...products, data.product]);
            setIsAdding(false);
            setNewProduct({ name: '', price: '', stock: '', image: '', description: '' });
            alert('UNIT DEPLOYED SUCCESSFULLY');
        } else {
            alert('DEPLOYMENT FAILED');
        }
    };

    const stats = [
        { label: 'TOTAL REVENUE', value: `$${orders.reduce((acc: any, o: any) => acc + (o.total || 0), 0).toFixed(2)}`, icon: Box, color: 'text-white' },
        { label: 'ACTIVE SIGNALS', value: initialData.users.length.toString(), icon: Users, color: 'text-[#00F0FF]' },
        { label: 'UNITS DEPLOYED', value: orders.reduce((acc: any, o: any) => acc + (o.items?.length || 0), 0).toString(), icon: Activity, color: 'text-[#10b981]' },
        { label: 'INVENTORY', value: products.length.toString(), icon: Package, color: 'text-purple-500' },
    ];

    return (
        <div className="min-h-screen bg-[#050505] text-white selection:bg-[#00F0FF] selection:text-black font-mono">
            {/* Nav */}
            <nav className="border-b border-white/10 bg-black/50 backdrop-blur-md sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-4 group cursor-pointer">
                        <ArrowLeft className="text-gray-500 group-hover:text-white transition-colors" size={20} />
                        <div className="w-8 h-8 relative">
                            <Image src="/images/logo.png" alt="Spectre" fill className="object-contain" />
                        </div>
                        <span className="font-grotesk font-bold tracking-widest text-sm group-hover:text-[#00F0FF] transition-colors">COMMAND_CENTER</span>
                    </Link>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 px-3 py-1 bg-[#00F0FF]/10 border border-[#00F0FF]/30 rounded-full">
                            <div className="w-2 h-2 bg-[#00F0FF] rounded-full animate-pulse" />
                            <span className="text-[10px] text-[#00F0FF]">SYSTEM_ONLINE</span>
                        </div>
                        <div className="flex items-center gap-2 opacity-70">
                            <Shield size={14} />
                            <span className="text-xs">{user?.email}</span>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-6 py-8">
                {/* Tabs */}
                <div className="flex gap-4 mb-8 border-b border-white/10">
                    <button
                        onClick={() => setActiveTab('overview')}
                        className={`pb-4 px-2 text-sm font-bold tracking-widest transition-colors relative ${activeTab === 'overview' ? 'text-[#00F0FF]' : 'text-gray-500 hover:text-white'}`}
                    >
                        <LayoutDashboard size={14} className="inline mr-2 mb-1" />
                        OVERVIEW
                        {activeTab === 'overview' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#00F0FF]" />}
                    </button>
                    <button
                        onClick={() => setActiveTab('inventory')}
                        className={`pb-4 px-2 text-sm font-bold tracking-widest transition-colors relative ${activeTab === 'inventory' ? 'text-[#00F0FF]' : 'text-gray-500 hover:text-white'}`}
                    >
                        <Package size={14} className="inline mr-2 mb-1" />
                        INVENTORY_OPS
                        {activeTab === 'inventory' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#00F0FF]" />}
                    </button>
                </div>

                {activeTab === 'overview' ? (
                    <>
                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                            {stats.map((stat, i) => (
                                <div key={i} className="bg-white/5 border border-white/10 p-6 rounded relative overflow-hidden group hover:border-[#00F0FF]/30 transition-colors">
                                    <div className="flex justify-between items-start mb-4">
                                        <span className="text-[10px] text-gray-500 tracking-widest">{stat.label}</span>
                                        <stat.icon size={16} className={`opacity-50 ${stat.color}`} />
                                    </div>
                                    <h3 className="text-2xl font-bold font-grotesk">{stat.value}</h3>
                                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                                </div>
                            ))}
                        </div>

                        {/* Live Feed */}
                        <div className="bg-white/5 border border-white/10 rounded overflow-hidden">
                            <div className="p-6 border-b border-white/10 flex justify-between items-center">
                                <h2 className="font-grotesk font-bold text-lg">INTERCEPTED TRANSMISSIONS</h2>
                                <div className="relative">
                                    <Search className="absolute left-3 top-2 text-gray-600" size={14} />
                                    <input
                                        type="text"
                                        placeholder="SEARCH_LOGS..."
                                        className="bg-black/20 border border-white/10 rounded py-1.5 pl-9 pr-4 text-xs focus:outline-none focus:border-[#00F0FF] w-64 text-white"
                                    />
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-xs">
                                    <thead className="bg-white/5 text-gray-400">
                                        <tr>
                                            <th className="px-6 py-4 font-normal tracking-wider">ID_HASH</th>
                                            <th className="px-6 py-4 font-normal tracking-wider">OPERATIVE</th>
                                            <th className="px-6 py-4 font-normal tracking-wider">REQUISITION</th>
                                            <th className="px-6 py-4 font-normal tracking-wider">STATUS</th>
                                            <th className="px-6 py-4 font-normal tracking-wider text-right">VALUE</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {orders.map((order: any) => (
                                            <tr key={order.id} className="hover:bg-white/5 transition-colors">
                                                <td className="px-6 py-4 font-mono text-[#00F0FF]">{order.id}</td>
                                                <td className="px-6 py-4">{order.email}</td>
                                                <td className="px-6 py-4 text-gray-300">
                                                    {order.items?.map((item: any) => `${item.name} (x${item.quantity})`).join(', ') || 'Classified'}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-2 py-1 rounded text-[10px] font-bold ${order.status === 'DELIVERED' ? 'bg-[#10b981]/20 text-[#10b981]' :
                                                            order.status === 'SHIPPED' ? 'bg-blue-500/20 text-blue-500' :
                                                                order.status === 'PROCESSING' ? 'bg-yellow-500/20 text-yellow-500' :
                                                                    'bg-gray-500/20 text-gray-500'
                                                        }`}>
                                                        {order.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right font-bold">${order.total?.toFixed(2)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </>
                ) : (
                    /* Inventory Tab */
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h2 className="font-grotesk font-bold text-lg">ARMORY INVENTORY</h2>
                            <button
                                onClick={() => setIsAdding(!isAdding)}
                                className="bg-[#00F0FF] hover:bg-[#00F0FF]/90 text-black px-4 py-2 rounded text-xs font-bold tracking-widest flex items-center gap-2 transition-colors"
                            >
                                <Plus size={16} />
                                {isAdding ? 'CANCEL_PROTOCOL' : 'DEPLOY_NEW_UNIT'}
                            </button>
                        </div>

                        {isAdding && (
                            <form onSubmit={handleAddProduct} className="bg-white/5 border border-[#00F0FF]/30 p-6 rounded-lg animate-in fade-in slide-in-from-top-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    <input
                                        placeholder="UNIT_DESIGNATION (Name)"
                                        className="bg-black/40 border border-white/10 rounded p-3 text-xs text-white focus:border-[#00F0FF] outline-none"
                                        value={newProduct.name}
                                        onChange={e => setNewProduct({ ...newProduct, name: e.target.value })}
                                        required
                                    />
                                    <input
                                        placeholder="REQ_COST (Price)"
                                        type="number"
                                        className="bg-black/40 border border-white/10 rounded p-3 text-xs text-white focus:border-[#00F0FF] outline-none"
                                        value={newProduct.price}
                                        onChange={e => setNewProduct({ ...newProduct, price: e.target.value })}
                                        required
                                    />
                                    <input
                                        placeholder="STOCK_LEVEL"
                                        type="number"
                                        className="bg-black/40 border border-white/10 rounded p-3 text-xs text-white focus:border-[#00F0FF] outline-none"
                                        value={newProduct.stock}
                                        onChange={e => setNewProduct({ ...newProduct, stock: e.target.value })}
                                        required
                                    />
                                    <input
                                        placeholder="VISUAL_DATA_LINK (Image URL)"
                                        className="bg-black/40 border border-white/10 rounded p-3 text-xs text-white focus:border-[#00F0FF] outline-none"
                                        value={newProduct.image}
                                        onChange={e => setNewProduct({ ...newProduct, image: e.target.value })}
                                    />
                                    <input
                                        placeholder="TECH_SPECS (Description)"
                                        className="bg-black/40 border border-white/10 rounded p-3 text-xs text-white focus:border-[#00F0FF] outline-none md:col-span-2"
                                        value={newProduct.description}
                                        onChange={e => setNewProduct({ ...newProduct, description: e.target.value })}
                                    />
                                </div>
                                <button className="w-full bg-[#00F0FF]/20 hover:bg-[#00F0FF]/30 text-[#00F0FF] py-3 rounded text-xs font-bold border border-[#00F0FF]/50 transition-all">
                                    INITIATE DEPLOYMENT
                                </button>
                            </form>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {products.map((p: any) => (
                                <div key={p.id} className="bg-white/5 border border-white/10 rounded p-4 flex gap-4">
                                    <div className="w-20 h-20 bg-black/40 rounded flex items-center justify-center overflow-hidden">
                                        {p.image ? (
                                            <img src={p.image} className="object-cover w-full h-full" alt={p.name} />
                                        ) : (
                                            <Package className="text-gray-600" />
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-bold text-sm text-white">{p.name}</h3>
                                        <p className="text-xs text-gray-500 font-mono mb-2">{p.id}</p>
                                        <div className="flex justify-between items-end">
                                            <span className="text-[#00F0FF] font-mono text-sm">${p.price}</span>
                                            <span className="text-[10px] bg-white/10 px-2 py-1 rounded text-gray-300">STOCK: {p.stock}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
