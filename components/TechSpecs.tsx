'use client';
import { useRef, MouseEvent } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import SectionWrapper from './ui/SectionWrapper';
import { useProductStore } from '@/store/productStore';

const TiltCard = ({ children, className = "", span = 1 }: { children: React.ReactNode, className?: string, span?: number }) => {
    const ref = useRef<HTMLDivElement>(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseXSpring = useSpring(x);
    const mouseYSpring = useSpring(y);

    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["17.5deg", "-17.5deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-17.5deg", "17.5deg"]);

    const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();

        const width = rect.width;
        const height = rect.height;

        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const xPct = mouseX / width - 0.5;
        const yPct = mouseY / height - 0.5;

        x.set(xPct);
        y.set(yPct);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
            className={`relative rounded-xl border border-white/10 bg-white/5 backdrop-blur-lg p-8 overflow-hidden group ${className} ${span === 2 ? 'md:col-span-2' : ''}`}
        >
            <div style={{ transform: "translateZ(50px)" }} className="relative z-10 h-full flex flex-col justify-between">
                {children}
            </div>

            {/* Gradient Shine */}
            <div className="absolute inset-0 z-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </motion.div>
    );
};

export default function TechSpecs() {
    const { activeProduct } = useProductStore();

    return (
        <SectionWrapper className="bg-spectre-black z-10">
            <div className="mb-16">
                <h2 className="text-4xl md:text-6xl font-grotesk font-bold text-white mb-4">
                    TECHNICAL <span style={{ color: activeProduct.accentColor }}>SPECIFICATIONS</span>
                </h2>
                <p className="font-mono text-spectre-grey text-sm md:text-base max-w-xl">
                    ENGINEERED FOR PERFORMANCE. CALIBRATED FOR PERFECTION.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px]">
                {/* Card 1: Gasket / Mounting */}
                <TiltCard span={2}>
                    <div>
                        <h3 className="text-2xl font-bold font-grotesk text-white mb-2">ZERO GRAVITY GASKET</h3>
                        <p className="text-gray-400 font-mono text-sm leading-relaxed max-w-md">
                            Our proprietary silicone mounting system isolates the PCB from the chassis,
                            creating a typing experience that feels like floating on air.
                        </p>
                    </div>
                    <div className="w-full h-32 bg-white/5 rounded-lg mt-4 border border-white/10 flex items-center justify-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
                        <span className="font-mono text-xs" style={{ color: activeProduct.accentColor }}>
                            {activeProduct.specs.material} CHASSIS
                        </span>
                    </div>
                </TiltCard>

                {/* Card 2: Polling / Actuation */}
                <TiltCard>
                    <div className="flex flex-col items-center justify-center h-full text-center">
                        <h3 className="text-sm font-mono text-gray-400 uppercase tracking-widest mb-4">ACTUATION FORCE</h3>
                        <div className="text-7xl font-bold font-grotesk text-transparent bg-clip-text bg-gradient-to-b from-white to-white/20">
                            {activeProduct.specs.actuation}
                        </div>
                        <span className="font-bold text-xl mt-2" style={{ color: activeProduct.accentColor }}>
                            {activeProduct.specs.switch}
                        </span>
                    </div>
                </TiltCard>

                {/* Card 3: Triple Mode */}
                <TiltCard>
                    <div>
                        <h3 className="text-xl font-bold font-grotesk text-white mb-6">CONNECTIVITY</h3>
                        <div className="space-y-4 font-mono text-sm text-gray-400">
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full shadow-[0_0_10px_currentColor]" style={{ backgroundColor: activeProduct.accentColor, color: activeProduct.accentColor }} />
                                <span>2.4GHz WIRELESS</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full bg-blue-500" />
                                <span>BLUETOOTH 5.3</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full bg-white" />
                                <span>WIRED USB-C</span>
                            </div>
                        </div>
                    </div>
                </TiltCard>

                {/* Card 4: Acoustic Foam */}
                <TiltCard span={2}>
                    <div className="flex flex-col md:flex-row gap-8 h-full">
                        <div className="flex-1 flex flex-col justify-between">
                            <div>
                                <h3 className="text-2xl font-bold font-grotesk text-white mb-2">ACOUSTIC DAMPENING</h3>
                                <p className="text-gray-400 font-mono text-sm leading-relaxed">
                                    Layered IXPE switch pads and PORON casing foam absorb high-frequency reverberations.
                                </p>
                            </div>
                            <div className="flex gap-4 mt-4">
                                <div className="px-3 py-1 rounded-full border border-white/10 text-xs font-mono text-white">PORON</div>
                                <div className="px-3 py-1 rounded-full border border-white/10 text-xs font-mono text-white">IXPE</div>
                            </div>
                        </div>
                        <div className="flex-1 bg-white/5 rounded-lg border border-white/5 relative overflow-hidden flex items-center justify-center">
                            {/* Waveform Visual */}
                            <div className="flex gap-1 items-end h-12">
                                {[40, 75, 30, 85, 50, 95, 25, 60, 45, 80].map((h, i) => (
                                    <div key={i} className="w-2 rounded-t-sm" style={{ height: `${h}%`, backgroundColor: activeProduct.accentColor }} />
                                ))}
                            </div>
                        </div>
                    </div>
                </TiltCard>
            </div>
        </SectionWrapper>
    );
}
