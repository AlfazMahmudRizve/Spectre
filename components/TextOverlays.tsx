'use client';
import { MotionValue, motion, useTransform } from 'framer-motion';
import HyperText from './HyperText';

export default function TextOverlays({ scrollYProgress }: { scrollYProgress: MotionValue<number> }) {
    // Screen 1: Intro (0 - 20%)
    const opacity1 = useTransform(scrollYProgress, [0, 0.1, 0.2], [1, 1, 0]);
    const y1 = useTransform(scrollYProgress, [0, 0.2], [0, -50]);
    const scale1 = useTransform(scrollYProgress, [0, 0.2], [1, 0.8]);

    // Screen 2: Explosion (30 - 50%)
    const opacity2 = useTransform(scrollYProgress, [0.25, 0.35, 0.45, 0.55], [0, 1, 1, 0]);
    const x2 = useTransform(scrollYProgress, [0.25, 0.55], [-50, 0]);

    // Screen 3: Details (60 - 80%)
    const opacity3 = useTransform(scrollYProgress, [0.6, 0.7, 0.8], [0, 1, 0]);
    const y3 = useTransform(scrollYProgress, [0.6, 0.8], [50, 0]);

    // Screen 4: Reassembly (90 - 100%)
    const opacity4 = useTransform(scrollYProgress, [0.85, 0.95], [0, 1]);
    const scale4 = useTransform(scrollYProgress, [0.85, 1], [0.9, 1]);

    return (
        <div className="absolute inset-0 pointer-events-none z-10 w-full h-full font-sans">
            {/* SECTION 1: Intro - Top Left */}
            <motion.div style={{ opacity: opacity1, y: y1, scale: scale1 }} className="absolute top-24 left-8 md:left-16 z-20 max-w-xl text-left pointer-events-none">
                <div className="inline-block p-8 rounded-2xl bg-black/40 backdrop-blur-md border border-white/5 shadow-2xl">
                    <h1 className="text-6xl md:text-8xl leading-none font-grotesk font-bold tracking-tighter text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                        <HyperText text="SPECTRE" />
                    </h1>
                    <h1 className="text-6xl md:text-8xl leading-none font-grotesk font-bold tracking-tighter text-spectre-cyan drop-shadow-[0_0_10px_rgba(0,240,255,0.4)]">
                        <HyperText text="ONE" />
                    </h1>
                    <p className="text-sm md:text-base font-mono tracking-[0.3em] mt-6 text-white/80 uppercase">
                        <HyperText text="The Ultimate Mechanical Experience" duration={1000} />
                    </p>
                </div>
            </motion.div>

            {/* SECTION 2: Zero Gravity - Middle Left */}
            <motion.div style={{ opacity: opacity2, x: x2 }} className="absolute top-1/2 left-8 md:left-16 -translate-y-1/2 z-20 pointer-events-none">
                <div className="p-8 rounded-xl bg-black/50 backdrop-blur-md border-l-4 border-spectre-cyan shadow-xl">
                    <h2 className="text-4xl md:text-6xl font-grotesk font-bold leading-tight text-white mb-2">
                        <HyperText text="ZERO GRAVITY" />
                    </h2>
                    <h2 className="text-4xl md:text-6xl font-grotesk font-bold leading-tight text-white/50 mb-4">
                        <HyperText text="MOUNTING" />
                    </h2>
                    <p className="text-spectre-cyan max-w-xs font-mono text-xs leading-relaxed border-l border-white/20 pl-4 py-1">
                        PRECISION ENGINEERED GASKET SYSTEM ELIMINATES VIBRTATION FOR PURE SOUND.
                    </p>
                </div>
            </motion.div>

            {/* SECTION 3: Acoustic - Middle Right */}
            <motion.div style={{ opacity: opacity3, y: y3 }} className="absolute top-1/2 right-8 md:right-16 -translate-y-1/2 text-right z-20 pointer-events-none">
                <div className="p-8 rounded-xl bg-black/50 backdrop-blur-md border-r-4 border-white shadow-xl flex flex-col items-end">
                    <h2 className="text-5xl md:text-7xl font-grotesk font-bold text-white mb-2">
                        <HyperText text="ACOUSTIC" />
                    </h2>
                    <h2 className="text-5xl md:text-7xl font-grotesk font-bold text-transparent bg-clip-text bg-gradient-to-l from-white to-white/10">
                        <HyperText text="PERFECTION" />
                    </h2>
                </div>
            </motion.div>

            {/* SECTION 4: CTA - Bottom Right */}
            <motion.div style={{ opacity: opacity4, scale: scale4 }} className="absolute bottom-24 right-8 md:right-16 z-30 pointer-events-auto">
                <div className="p-10 rounded-2xl bg-black/70 backdrop-blur-xl border border-spectre-cyan/30 shadow-[0_0_40px_rgba(0,240,255,0.15)] flex flex-col items-center text-center">
                    <h2 className="text-3xl md:text-5xl font-grotesk font-bold mb-6 text-white">
                        <HyperText text="READY?" />
                    </h2>
                    <a
                        href="#"
                        className="group relative px-10 py-3 bg-spectre-cyan/10 hover:bg-spectre-cyan/20 overflow-hidden inline-block border border-spectre-cyan transition-all duration-300"
                    >
                        <span className="relative font-mono text-spectre-cyan tracking-widest font-bold group-hover:tracking-[0.2em] transition-all duration-300">
                            ASSEMBLE YOURS
                        </span>
                    </a>
                </div>
            </motion.div>
        </div>
    )
}
