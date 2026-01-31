'use client';
import { AnimatePresence, motion } from 'framer-motion';
import { useCartStore } from '@/store/cartStore';
import { X, Plus, Minus, Trash2 } from 'lucide-react';
import GhostButton from './ui/GhostButton';

export default function CartDrawer() {
    const { isOpen, cart, toggleCart, updateQuantity, removeFromCart, addDummyItem } = useCartStore();

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={toggleCart}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className="fixed right-0 top-0 h-full w-full max-w-md bg-black/95 border-l border-spectre-cyan/20 z-[51] shadow-[-20px_0_50px_rgba(0,0,0,0.5)] flex flex-col font-sans"
                    >
                        {/* Header */}
                        <div className="p-6 border-b border-white/10 flex justify-between items-center">
                            <div>
                                <h2 className="text-xl font-grotesk font-bold text-white tracking-wider">SYSTEM_CART</h2>
                                <p className="text-xs font-mono text-spectre-cyan">ITEMS: {cart.length}</p>
                            </div>
                            <GhostButton onClick={toggleCart} variant="ghost" className="!p-2 rounded-full">
                                <X size={24} />
                            </GhostButton>
                        </div>

                        {/* Items */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            {cart.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-spectre-grey font-mono space-y-4">
                                    <p>CART_EMPTY</p>
                                    <button
                                        onClick={addDummyItem}
                                        className="text-xs text-spectre-cyan underline hover:text-white"
                                    >
                                        [DEBUG: ADD_MOCK]
                                    </button>
                                </div>
                            ) : (
                                cart.map((item) => (
                                    <motion.div
                                        key={item.id}
                                        layout
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        className="flex gap-4 p-4 bg-white/5 border border-white/5 rounded-lg group hover:border-spectre-cyan/30 transition-colors relative"
                                    >
                                        {/* Image Placeholder */}
                                        <div className="w-20 h-20 bg-gradient-to-br from-gray-800 to-black rounded border border-white/10 flex-shrink-0" />

                                        <div className="flex-1">
                                            <div className="flex justify-between items-start mb-1">
                                                <h3 className="font-bold text-white tracking-wide">{item.name}</h3>
                                                <GhostButton
                                                    onClick={() => removeFromCart(item.id)}
                                                    variant="ghost"
                                                    size="sm"
                                                    className="!p-1 text-spectre-dark-grey hover:text-red-500"
                                                >
                                                    <Trash2 size={16} />
                                                </GhostButton>
                                            </div>
                                            <p className="text-xs font-mono text-spectre-dark-grey mb-4">{item.edition}</p>

                                            <div className="flex justify-between items-center">
                                                <div className="flex items-center gap-3 bg-black/50 border border-white/10 rounded px-2 py-1">
                                                    <GhostButton
                                                        onClick={() => updateQuantity(item.id, -1)}
                                                        variant="ghost"
                                                        size="sm"
                                                        className="!p-0 text-white hover:text-spectre-cyan"
                                                    >
                                                        <Minus size={14} />
                                                    </GhostButton>
                                                    <span className="text-sm font-mono text-white w-4 text-center">{item.quantity}</span>
                                                    <GhostButton
                                                        onClick={() => updateQuantity(item.id, 1)}
                                                        variant="ghost"
                                                        size="sm"
                                                        className="!p-0 text-white hover:text-spectre-cyan"
                                                    >
                                                        <Plus size={14} />
                                                    </GhostButton>
                                                </div>
                                                <p className="font-mono text-spectre-cyan">${item.price * item.quantity}</p>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </div>

                        {/* Footer */}
                        <div className="p-6 border-t border-white/10 bg-black/50 backdrop-blur-md">
                            <div className="flex justify-between items-end mb-6 font-mono">
                                <span className="text-spectre-dark-grey">SUBTOTAL</span>
                                <span className="text-2xl text-white font-bold">
                                    ${cart.reduce((t, i) => t + i.price * i.quantity, 0)}
                                </span>
                            </div>
                            <GhostButton className="w-full" variant="solid" size="lg">
                                INITIALIZE PAYMENT
                            </GhostButton>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
