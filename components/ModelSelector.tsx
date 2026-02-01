'use client';
import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion';
import { useProductStore } from '@/store/productStore';
import { products } from '@/data/products';
import { useState, useEffect } from 'react';

export default function ModelSelector() {
    const { activeProduct, setActiveProduct } = useProductStore();
    const { scrollY } = useScroll();
    const [pageHeight, setPageHeight] = useState(0);

    // Fade out as we scroll past the hero section (approx 2 viewport heights)
    // We use a state to ensure we have window access, defaulting to large number
    const fadeEnd = typeof window !== 'undefined' ? window.innerHeight * 1.8 : 1500;
    const opacity = useTransform(scrollY, [0, fadeEnd], [1, 0]);
    const pointerEvents = useTransform(scrollY, (v) => v > fadeEnd ? 'none' : 'auto');

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            style={{ opacity, pointerEvents }}
            animate={{ y: 0 }}
            transition={{ delay: 1 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 bg-black/50 backdrop-blur-md p-2 rounded-full border border-white/10"
        >
            {products.map((product) => (
                <button
                    key={product.id}
                    onClick={() => setActiveProduct(product.id)}
                    className="relative px-6 py-2 rounded-full text-xs font-mono font-bold tracking-widest transition-all duration-300 overflow-hidden group"
                    style={{
                        color: activeProduct.id === product.id ? '#000000' : '#FFFFFF',
                    }}
                >
                    {/* Background Fill for Active */}
                    {activeProduct.id === product.id && (
                        <motion.div
                            layoutId="activeModelBg"
                            className="absolute inset-0 w-full h-full"
                            style={{ backgroundColor: activeProduct.accentColor }}
                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        />
                    )}

                    {/* Hover Glow for Inactive */}
                    {activeProduct.id !== product.id && (
                        <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-full" />
                    )}

                    <span className="relative z-10 flex items-center gap-2">
                        {product.name.replace('SPECTRE ', '')}
                        {activeProduct.id === product.id && (
                            <div className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                        )}
                    </span>
                </button>
            ))}
        </motion.div>
    );
}
