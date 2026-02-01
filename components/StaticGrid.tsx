'use client';
import { motion } from 'framer-motion';
import { useCartStore } from '@/store/cartStore';

import { useState, useEffect } from 'react';

const defaultAccessories = [
    {
        id: 'mousepad',
        name: 'SPECTRE MAT',
        price: '49',
        image: '/images/spectre-carbon/1.webp',
        description: 'Micro-textured speed surface.'
    }
];

export default function StaticGrid() {
    const [items, setItems] = useState<any[]>(defaultAccessories);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await fetch('/api/products');
                if (res.ok) {
                    const dbProducts = await res.json();
                    // Filter out core products if needed, or just append everything unique
                    // For now, let's just append custom added products
                    const formattedDetails = dbProducts.map((p: any) => ({
                        id: p.id,
                        name: p.name,
                        price: p.price.toString(),
                        image: p.image || '/images/spectre-one/20.webp', // Fallback
                        description: p.description || 'Classified specs.'
                    }));

                    // Simple merge (avoiding ID collision if possible)
                    setItems([...defaultAccessories, ...formattedDetails.filter((p: any) => !['spectre-carbon', 'spectre-one', 'spectre-mat'].includes(p.id))]);
                }
            } catch (e) {
                console.error("Failed to load inventory", e);
            }
        };
        fetchProducts();
    }, []);

    return (
        <section id="accessories" className="py-32 px-6 bg-black relative z-10 border-t border-white/10">
            <div className="max-w-7xl mx-auto">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="text-4xl md:text-6xl font-grotesk font-bold text-white mb-16 text-center"
                >
                    ESSENTIALS
                </motion.h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {items.map((item, i) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="group relative bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-[#00F0FF]/50 transition-colors duration-300 cursor-pointer"
                            onClick={() => {
                                useCartStore.getState().addToCart({
                                    id: item.id,
                                    name: item.name,
                                    price: parseInt(item.price),
                                    image: item.image,
                                    quantity: 1,
                                    edition: 'STANDARD ISSUE'
                                });
                            }}
                        >
                            <div className="aspect-square relative overflow-hidden bg-white/5">
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100"
                                />
                                {/* Add overlay hint */}
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <span className="text-[#00F0FF] font-mono text-sm tracking-widest border border-[#00F0FF] px-4 py-2 bg-black/80 backdrop-blur">ADD TO CART</span>
                                </div>
                            </div>
                            <div className="p-8">
                                <div className="flex justify-between items-baseline mb-2">
                                    <h3 className="text-xl font-bold font-grotesk text-white group-hover:text-[#00F0FF] transition-colors">{item.name}</h3>
                                    <span className="font-mono text-sm text-gray-400">${item.price}</span>
                                </div>
                                <p className="text-sm font-mono text-gray-500">{item.description}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
