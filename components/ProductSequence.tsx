'use client';
import { useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import BootLoader from './BootLoader';
import TextOverlays from './TextOverlays';
import { Product } from '@/data/products';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { useCanvasSequence } from '@/hooks/useCanvasSequence';
import { useProductStore } from '@/store/productStore';

interface ProductSequenceProps {
    product: Product;
}

export default function ProductSequence({ product }: ProductSequenceProps) {
    const isMobile = useMediaQuery('(max-width: 768px)');
    const { hasIntroPlayed, setHasIntroPlayed } = useProductStore();
    const containerRef = useRef<HTMLDivElement>(null);

    const {
        canvasRef,
        smoothProgress,
        progress,
        isReady
    } = useCanvasSequence({
        product,
        containerRef,
        isMobile
    });

    useEffect(() => {
        if (isReady && !hasIntroPlayed) {
            setHasIntroPlayed();
        }
    }, [isReady, hasIntroPlayed, setHasIntroPlayed]);

    return (
        <motion.div
            ref={containerRef}
            className="h-[300vh] md:h-[400vh] relative bg-[#050505]"
            initial={{ opacity: 0, filter: "blur(6px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
        >
            <div className="sticky top-0 h-screen w-full overflow-hidden bg-[#050505]">
                <AnimatePresence>
                    {/* Theme Switch Overlay placeholder */}
                </AnimatePresence>

                {/* BootLoader */}
                <BootLoader progress={progress} complete={isReady} skip={hasIntroPlayed} />

                {/* Canvas Layer */}
                <canvas
                    ref={canvasRef}
                    className="absolute inset-0 w-full h-full object-contain pointer-events-none"
                    style={{
                        opacity: isReady ? 1 : 0,
                        transition: 'opacity 0.4s ease-in'
                    }}
                />

                {/* Vignette Overlay */}
                <div className="absolute inset-0 pointer-events-none z-10 bg-[radial-gradient(circle_at_center,transparent_60%,#050505_100%)]" />

                {/* Text Overlays */}
                <TextOverlays scrollYProgress={smoothProgress} product={product} />

                {/* Scroll Indicator — visible on both mobile and desktop */}
                {isReady && hasIntroPlayed && (
                    <motion.div
                        className="absolute bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 z-40 flex flex-col items-center gap-2 pointer-events-none mix-blend-difference"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1 }}
                    >
                        <span className="text-[10px] font-mono tracking-[0.2em] text-white/50">
                            {isMobile ? 'SWIPE UP' : 'SCROLL TO EXPLORE'}
                        </span>
                        <div className="w-[1px] h-6 md:h-8 bg-gradient-to-b from-white/0 via-white/50 to-white/0" />
                    </motion.div>
                )}
            </div>
        </motion.div>
    );
}
