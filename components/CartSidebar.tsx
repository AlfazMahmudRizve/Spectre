'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { ShoppingBag, X, Plus, Minus, Trash2, ArrowRight } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useEffect, useState } from 'react';
import Image from 'next/image';

export default function CartSidebar() {
    const { cart, isOpen, toggleCart, removeFromCart, updateQuantity } = useCartStore();
    const [subtotal, setSubtotal] = useState(0);

    // Calculate subtotal
    useEffect(() => {
        const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
        setSubtotal(total);
    }, [cart]);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => toggleCart()}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 cursor-pointer"
                    />

                    {/* Sidebar Panel */}
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="fixed top-0 right-0 h-full w-full max-w-md bg-[#050505] border-l border-[#00F0FF]/30 z-[60] shadow-[-20px_0_50px_rgba(0,0,0,0.8)] flex flex-col"
                    >
                        {/* Header */}
                        <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
                            <div className="flex items-center gap-3">
                                <ShoppingBag className="text-[#00F0FF]" size={20} />
                                <span className="font-mono tracking-widest text-sm text-white">SYSTEM_CART // {cart.length.toString().padStart(2, '0')}</span>
                            </div>
                            <button
                                onClick={() => toggleCart()}
                                className="p-2 hover:bg-white/10 rounded-full transition-colors group"
                            >
                                <X size={20} className="text-gray-400 group-hover:text-white" />
                            </button>
                        </div>

                        {/* Cart Items List */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                            {cart.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center opacity-50 space-y-4">
                                    <ShoppingBag size={48} className="text-gray-600 mb-4" />
                                    <h3 className="font-grotesk text-xl text-white">SYSTEM EMPTY</h3>
                                    <p className="font-mono text-xs text-gray-400 max-w-[200px]">NO ASSETS DETECTED. INITIATE PROCUREMENT.</p>
                                </div>
                            ) : (
                                cart.map((item) => (
                                    <motion.div
                                        layout
                                        key={item.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="flex gap-4 p-4 bg-white/5 border border-white/5 rounded-lg group hover:border-[#00F0FF]/30 transition-colors"
                                    >
                                        {/* Image */}
                                        <div className="w-20 h-20 relative bg-black rounded-md overflow-hidden flex-shrink-0">
                                            <Image
                                                src={item.image}
                                                alt={item.name}
                                                fill
                                                className="object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                                            />
                                        </div>

                                        {/* info */}
                                        <div className="flex-1 flex flex-col justify-between">
                                            <div>
                                                <div className="flex justify-between items-start">
                                                    <h4 className="font-grotesk font-bold text-white text-sm leading-tight">{item.name}</h4>
                                                    <button
                                                        onClick={() => removeFromCart(item.id)}
                                                        className="text-gray-500 hover:text-red-500 transition-colors"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                                <p className="font-mono text-[10px] text-spectre-cyan mt-1">{item.edition}</p>
                                            </div>

                                            <div className="flex justify-between items-end">
                                                <div className="flex items-center gap-3 bg-black/50 rounded px-2 py-1 border border-white/10">
                                                    <button
                                                        onClick={() => updateQuantity(item.id, -1)}
                                                        className="text-gray-400 hover:text-white"
                                                    >
                                                        <Minus size={12} />
                                                    </button>
                                                    <span className="font-mono text-xs w-4 text-center">{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(item.id, 1)}
                                                        className="text-gray-400 hover:text-white"
                                                    >
                                                        <Plus size={12} />
                                                    </button>
                                                </div>
                                                <span className="font-mono text-sm text-white">${item.price * item.quantity}</span>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </div>

                        {/* Footer */}
                        {cart.length > 0 && (
                            <div className="p-6 border-t border-white/10 bg-black/20 backdrop-blur-md">
                                <div className="space-y-4 mb-6">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-gray-400 font-mono">SUBTOTAL</span>
                                        <span className="text-white font-mono font-bold">${subtotal}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-xs">
                                        <span className="text-gray-500 font-mono">SHIPPING</span>
                                        <span className="text-gray-500 font-mono">CALCULATED AT CHECKOUT</span>
                                    </div>
                                </div>

                                <button
                                    onClick={() => {
                                        toggleCart(); // Close cart
                                        window.location.href = '/checkout';
                                    }}
                                    className="w-full group relative overflow-hidden bg-[#00F0FF] text-black font-bold font-mono py-4 px-6 flex items-center justify-center gap-3 clip-path-polygon hover:bg-[#00F0FF]/90 transition-all"
                                >
                                    <span className="relative z-10 tracking-widest">INITIATE CHECKOUT</span>
                                    <ArrowRight size={18} className="relative z-10 group-hover:translate-x-1 transition-transform" />

                                    {/* Scanline effect */}
                                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-[-100%] transition-transform duration-700 ease-in-out" />
                                </button>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
