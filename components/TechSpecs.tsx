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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[250px]">
                {activeProduct.specs.map((spec, i) => (
                    <TiltCard key={i} span={i === 0 || i === 4 ? 2 : 1}>
                        <div className="flex flex-col justify-between h-full">
                            <div>
                                <h3 className="text-sm font-mono text-gray-500 uppercase tracking-widest mb-2">{spec.label}</h3>
                                <div className="text-3xl md:text-5xl font-grotesk font-bold text-white break-words">
                                    {spec.value}
                                </div>
                            </div>

                            {/* Decorative Elements based on index */}
                            <div className="w-full h-1 bg-white/5 mt-4 overflow-hidden relative">
                                <div
                                    className="absolute inset-0 h-full w-1/2"
                                    style={{ backgroundColor: activeProduct.accentColor, opacity: 0.5 }}
                                />
                            </div>
                        </div>
                    </TiltCard>
                ))}
            </div>
        </SectionWrapper>
    );
}
