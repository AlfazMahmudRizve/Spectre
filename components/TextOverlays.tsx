'use client';
import { MotionValue, motion, useTransform } from 'framer-motion';
import HyperText from './HyperText';
import { Product } from '@/data/products';

export default function TextOverlays({ scrollYProgress, product }: { scrollYProgress: MotionValue<number>, product: Product }) {

    // Beat A: Intro (0 - 20%)
    const opacity1 = useTransform(scrollYProgress, [0, 0.1, 0.2], [1, 1, 0]);
    const y1 = useTransform(scrollYProgress, [0, 0.2], [0, -40]);

    // Beat B: Phase 1 (25 - 45%)
    const opacity2 = useTransform(scrollYProgress, [0.25, 0.3, 0.4, 0.45], [0, 1, 1, 0]);
    const x2 = useTransform(scrollYProgress, [0.25, 0.45], [-30, 0]);

    // Beat C: Phase 2 (50 - 70%)
    const opacity3 = useTransform(scrollYProgress, [0.5, 0.55, 0.65, 0.7], [0, 1, 1, 0]);
    const y3 = useTransform(scrollYProgress, [0.5, 0.7], [30, 0]);

    // Beat D: CTA (75 - 95%)
    const opacity4 = useTransform(scrollYProgress, [0.75, 0.8, 0.95], [0, 1, 1]);
    const scale4 = useTransform(scrollYProgress, [0.75, 0.95], [0.97, 1]);

    return (
        <div className="absolute inset-0 pointer-events-none z-10 w-full h-full font-sans">
            {/* SECTION 1: Intro */}
            <motion.div
                style={{ opacity: opacity1, y: y1 }}
                className={`absolute top-20 md:top-24 z-20 max-w-[90vw] md:max-w-xl pointer-events-none ${product.visuals?.textAlignment === 'right' ? 'right-4 md:right-16 text-right' : 'left-4 md:left-16 text-left'}`}
            >
                <div className="p-4 md:p-8 rounded-2xl bg-black/40 backdrop-blur-md border border-white/5 shadow-2xl">
                    <h1 className="text-4xl md:text-8xl leading-none font-grotesk font-bold tracking-tighter text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                        <HyperText text={product.heroName} />
                    </h1>
                    <h1 className="text-4xl md:text-8xl leading-none font-grotesk font-bold tracking-tighter drop-shadow-[0_0_10px_currentColor]" style={{ color: product.accentColor }}>
                        <HyperText text={product.modelName} />
                    </h1>
                    <p className="text-xs md:text-base font-mono tracking-[0.2em] md:tracking-[0.3em] mt-4 md:mt-6 text-white/80 uppercase">
                        <HyperText text={product.tagline} duration={1000} />
                    </p>
                    <p className="text-[11px] md:text-xs font-mono text-gray-400 mt-3 md:mt-4 max-w-md leading-relaxed">
                        {product.subHeadline}
                    </p>
                </div>
            </motion.div>

            {/* SECTION 2: Phase 1 */}
            <motion.div style={{ opacity: opacity2, x: x2 }} className="absolute top-1/2 left-4 md:left-16 -translate-y-1/2 z-20 pointer-events-none max-w-[85vw] md:max-w-none">
                <div className="p-4 md:p-8 rounded-xl bg-black/50 backdrop-blur-md border-l-4 shadow-xl" style={{ borderColor: product.accentColor }}>
                    <h2 className="text-2xl md:text-6xl font-grotesk font-bold leading-tight text-white mb-1 md:mb-2">
                        <HyperText text={product.phases[0].title} />
                    </h2>
                    <h2 className="text-lg md:text-4xl font-grotesk font-bold leading-tight text-white/50 mb-2 md:mb-4">
                        <HyperText text={product.phases[0].subtitle} />
                    </h2>
                    <p className="max-w-xs font-mono text-[11px] md:text-xs leading-relaxed border-l border-white/20 pl-3 md:pl-4 py-1" style={{ color: product.accentColor }}>
                        {product.phases[0].description}
                    </p>
                </div>
            </motion.div>

            {/* SECTION 3: Phase 2 */}
            <motion.div style={{ opacity: opacity3, y: y3 }} className="absolute top-1/2 right-4 md:right-16 -translate-y-1/2 text-right z-20 pointer-events-none max-w-[85vw] md:max-w-none">
                <div className="p-4 md:p-8 rounded-xl bg-black/50 backdrop-blur-md border-r-4 border-white shadow-xl flex flex-col items-end">
                    <h2 className="text-3xl md:text-7xl font-grotesk font-bold text-white mb-1 md:mb-2">
                        <HyperText text={product.phases[1].title} />
                    </h2>
                    <h2 className="text-xl md:text-5xl font-grotesk font-bold text-transparent bg-clip-text bg-gradient-to-l from-white to-white/10 mb-2 md:mb-4">
                        <HyperText text={product.phases[1].subtitle} />
                    </h2>
                    <p className="max-w-xs font-mono text-[11px] md:text-xs leading-relaxed text-gray-300">
                        {product.phases[1].description}
                    </p>
                </div>
            </motion.div>

            {/* SECTION 4: CTA */}
            <motion.div style={{ opacity: opacity4, scale: scale4 }} className="absolute bottom-16 md:bottom-24 left-4 right-4 md:left-auto md:right-16 z-30 pointer-events-auto">
                <div className="p-6 md:p-10 rounded-2xl bg-black/70 backdrop-blur-xl border shadow-[0_0_40px_rgba(0,0,0,0.5)] flex flex-col items-center text-center" style={{ borderColor: `${product.accentColor}30` }}>
                    <h2 className="text-2xl md:text-5xl font-grotesk font-bold mb-2 text-white">
                        <HyperText text={product.phases[2].title} />
                    </h2>
                    <p className="text-xs md:text-sm font-mono text-gray-400 mb-4 md:mb-6 max-w-xs">
                        {product.phases[2].description}
                    </p>
                    <button
                        onClick={() => {
                            const imagePath = `${product.folder}/0001.${product.fileExtension}`;
                            import('@/store/cartStore').then(({ useCartStore }) => {
                                useCartStore.getState().addToCart({
                                    id: product.id,
                                    name: product.name,
                                    price: product.price,
                                    image: imagePath,
                                    quantity: 1,
                                    edition: product.modelName
                                });
                            });
                        }}
                        className="group relative px-8 md:px-10 py-3 bg-white/5 hover:bg-white/10 overflow-hidden inline-block border transition-all duration-300 cursor-pointer"
                        style={{ borderColor: product.accentColor }}
                    >
                        <span className="relative font-mono tracking-widest text-sm md:text-base font-bold group-hover:tracking-[0.2em] transition-all duration-300" style={{ color: product.accentColor }}>
                            PRE-ORDER NOW
                        </span>
                    </button>
                </div>
            </motion.div>
        </div>
    )
}
