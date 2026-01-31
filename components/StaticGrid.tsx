'use client';
import { motion } from 'framer-motion';

const accessories = [
    {
        id: 'mousepad',
        name: 'SPECTRE MAT',
        price: '$49',
        image: '/images/spectre-carbon/1.webp', // Placeholder
        description: 'Micro-textured speed surface.'
    },
    {
        id: 'stand',
        name: 'HEADSET STAND',
        price: '$79',
        image: '/images/spectre-carbon/30.webp', // Placeholder
        description: 'RGB unified charging station.'
    },
    {
        id: 'cable',
        name: 'COILED CABLE',
        price: '$29',
        image: '/images/spectre-one/20.webp', // Placeholder
        description: 'Double-sleeved aviator connector.'
    }
];

export default function StaticGrid() {
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
                    {accessories.map((item, i) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="group relative bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-[#00F0FF]/50 transition-colors duration-300"
                        >
                            <div className="aspect-square relative overflow-hidden bg-white/5">
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100"
                                />
                            </div>
                            <div className="p-8">
                                <div className="flex justify-between items-baseline mb-2">
                                    <h3 className="text-xl font-bold font-grotesk text-white group-hover:text-[#00F0FF] transition-colors">{item.name}</h3>
                                    <span className="font-mono text-sm text-gray-400">{item.price}</span>
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
