'use client';
import { motion } from 'framer-motion';
import { useProductStore } from '@/store/productStore';
import { products } from '@/data/products';

export default function ModelSelector() {
    const { activeProduct, setActiveProduct } = useProductStore();

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
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
