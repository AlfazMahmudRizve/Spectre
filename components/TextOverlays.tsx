'use client';
import { MotionValue, motion, useTransform } from 'framer-motion';

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
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center mix-blend-difference z-10 w-full h-full">
            {/* SECTION 1 */}
            <motion.div style={{ opacity: opacity1, y: y1, scale: scale1 }} className="text-center absolute w-full px-4">
                <h1 className="text-[12vw] leading-none font-grotesk font-bold tracking-tighter text-white">
                    SPECTRE ONE
                </h1>
                <p className="text-xl md:text-2xl font-mono tracking-[0.5em] mt-4 text-spectre-cyan">
                    THE ULTIMATE MECHANICAL EXPERIENCE
                </p>
            </motion.div>

            {/* SECTION 2 */}
            <motion.div style={{ opacity: opacity2, x: x2 }} className="absolute top-1/2 left-4 md:left-24 -translate-y-1/2 text-left">
                <h2 className="text-5xl md:text-8xl font-grotesk font-bold leading-tight text-white/90">
                    ZERO<br />GRAVITY<br />MOUNT
                </h2>
                <p className="text-spectre-cyan mt-4 max-w-sm font-mono text-sm border-l-2 border-spectre-cyan pl-4">
                    PRECISION ENGINEERED GASKET MOUNTING SYSTEM FOR FLOATING ACOUSTICS.
                </p>
            </motion.div>

            {/* SECTION 3 */}
            <motion.div style={{ opacity: opacity3, y: y3 }} className="text-center absolute bottom-12 md:bottom-24 w-full px-4">
                <h2 className="text-6xl md:text-[10rem] leading-none font-grotesk font-bold text-transparent bg-clip-text bg-gradient-to-b from-white to-spectre-grey opacity-20 hover:opacity-100 transition-opacity duration-500">
                    ACOUSTIC<br />PERFECTION
                </h2>
            </motion.div>

            {/* SECTION 4 */}
            <motion.div style={{ opacity: opacity4, scale: scale4 }} className="text-center absolute pointer-events-auto flex flex-col items-center">
                <h2 className="text-5xl md:text-7xl font-grotesk font-bold mb-8 text-white">
                    ASSEMBLE YOURS
                </h2>
                <a
                    href="#"
                    className="group relative px-12 py-4 bg-transparent overflow-hidden"
                >
                    <span className="absolute inset-0 w-full h-full bg-spectre-cyan/10 group-hover:bg-spectre-cyan/20 transition-all duration-300"></span>
                    <span className="absolute top-0 left-0 w-full h-[1px] bg-spectre-cyan"></span>
                    <span className="absolute bottom-0 left-0 w-full h-[1px] bg-spectre-cyan"></span>
                    <span className="relative font-mono text-spectre-cyan tracking-widest group-hover:tracking-[0.2em] transition-all duration-300">
                        PRE-ORDER NOW
                    </span>
                </a>
            </motion.div>
        </div>
    )
}
