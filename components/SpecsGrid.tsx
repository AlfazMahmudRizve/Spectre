'use client';
import { SPECTRE_SPECS } from '../data/spectre';
import { motion } from 'framer-motion';

export default function SpecsGrid() {
    return (
        <section className="bg-spectre-black py-32 px-4 md:px-12 relative overflow-hidden min-h-screen flex items-center">
            {/* Background Grid Lines - Cyberpunk Style */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#1a1a1a_1px,transparent_1px),linear-gradient(to_bottom,#1a1a1a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20 pointer-events-none" />

            <div className="max-w-7xl mx-auto relative z-10 w-full">
                <motion.h3
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-4xl md:text-7xl font-grotesk font-bold mb-24 text-center text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-spectre-grey opacity-90"
                >
                    TECHNICAL SPECIFICATIONS
                </motion.h3>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {SPECTRE_SPECS.specs.map((spec, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="group relative min-h-[180px] flex flex-col justify-between p-8 border border-white/5 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all duration-500 overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-20 h-20 bg-spectre-cyan/10 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                            <span className="font-mono text-xs text-spectre-cyan/70 uppercase tracking-[0.2em] border-l border-spectre-cyan/50 pl-3">
                                0{i + 1} // {spec.label}
                            </span>
                            <span className="text-3xl md:text-4xl font-grotesk font-bold text-white group-hover:text-spectre-cyan transition-colors mt-auto">
                                {spec.value}
                            </span>
                        </motion.div>
                    ))}

                    {/* Price / CTA Card */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.6 }}
                        className="col-span-1 md:col-span-2 lg:col-span-1 p-8 border border-spectre-cyan/30 bg-spectre-cyan/5 flex flex-col justify-center items-center text-center relative group overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-spectre-cyan/5 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                        <span className="text-5xl font-bold font-grotesk text-spectre-cyan mb-2 relative z-10">{SPECTRE_SPECS.price}</span>
                        <span className="font-mono text-xs text-spectre-cyan/80 tracking-widest relative z-10">LIMITED BATCH DROP</span>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}
