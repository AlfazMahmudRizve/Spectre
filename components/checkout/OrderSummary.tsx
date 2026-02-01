'use client';

import { useCartStore } from '@/store/cartStore';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useEffect, useState } from 'react';

export default function OrderSummary() {
    const { cart } = useCartStore();
    const [subtotal, setSubtotal] = useState(0);

    useEffect(() => {
        setSubtotal(cart.reduce((acc, item) => acc + item.price * item.quantity, 0));
    }, [cart]);

    return (
        <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-lg p-6 font-mono text-sm relative overflow-hidden">
            {/* Holographic Top Bar */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#00F0FF] to-transparent opacity-50" />

            <h2 className="font-grotesk text-xl text-white mb-6 flex items-center gap-2">
                <span className="text-[#00F0FF]">//</span> MANIFEST
            </h2>

            {/* Cart Items */}
            <div className="space-y-4 mb-6 custom-scrollbar max-h-[400px] overflow-y-auto pr-2">
                {cart.map((item) => (
                    <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="group flex gap-4 p-3 bg-white/5 border border-transparent hover:border-[#00F0FF]/30 transition-all rounded-sm relative overflow-hidden"
                    >
                        {/* Glitch Overlay on Hover */}
                        <div className="absolute inset-0 bg-[#00F0FF]/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none mix-blend-overlay" />

                        <div className="w-16 h-16 relative bg-black flex-shrink-0 border border-white/5">
                            <Image
                                src={item.image}
                                alt={item.name}
                                fill
                                className="object-cover opacity-80 group-hover:scale-110 transition-transform duration-500"
                            />
                        </div>
                        <div className="flex-1 flex flex-col justify-between relative z-10">
                            <div>
                                <h3 className="text-white font-bold leading-tight">{item.name}</h3>
                                <p className="text-[10px] text-gray-400 mt-1">{item.edition} x{item.quantity}</p>
                            </div>
                            <div className="text-right">
                                <span className="text-spectre-cyan">${item.price * item.quantity}</span>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Totals */}
            <div className="border-t border-white/10 pt-4 space-y-2 text-xs">
                <div className="flex justify-between text-gray-400">
                    <span>SUBTOTAL_</span>
                    <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                    <span>SHIPPING_</span>
                    <span className="text-[#00F0FF]">CALCULATED</span>
                </div>
                <div className="flex justify-between text-gray-400">
                    <span>TAXES_</span>
                    <span>$0.00</span>
                </div>

                <div className="border-t border-white/10 my-4" />

                <div className="flex justify-between text-lg font-bold text-white items-end">
                    <span>TOTAL_</span>
                    <div className="flex flex-col items-end">
                        <span className="text-[#00F0FF]">${subtotal.toFixed(2)}</span>
                        <span className="text-[10px] font-normal text-gray-500">USD</span>
                    </div>
                </div>
            </div>

            {/* Decor */}
            <div className="absolute bottom-4 right-4 text-[10px] text-white/5 pointer-events-none select-none">
                SECURE_ENCLAVE_V1
            </div>
        </div>
    );
}
