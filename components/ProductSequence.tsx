'use client';
import { useEffect, useRef, useState, useCallback } from 'react';
import { useScroll, AnimatePresence, motion, useSpring, useTransform } from 'framer-motion';
import BootLoader from './BootLoader';
import TextOverlays from './TextOverlays';
import { Product } from '@/data/products';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { useSequenceLoader } from '@/hooks/useSequenceLoader';

import { useProductStore } from '@/store/productStore';

// Simple debounce utility
function debounce(fn: Function, ms: number) {
    let timer: NodeJS.Timeout;
    return (...args: any[]) => {
        clearTimeout(timer);
        timer = setTimeout(() => fn(...args), ms);
    };
}

interface ProductSequenceProps {
    product: Product;
}

export default function ProductSequence({ product }: ProductSequenceProps) {
    const isMobile = useMediaQuery('(max-width: 768px)');
    const { hasIntroPlayed, setHasIntroPlayed } = useProductStore();

    // Custom Hook for Progressive Loading (Desktop Only)
    // Critical Path: Load first 25 frames (Hero Loop) immediately.
    // Background: Load rest silently.
    const {
        frames: framesRef,
        progress,
        isCriticalLoaded,
        isFullLoaded
    } = useSequenceLoader(
        product.folder,
        product.frameCount,
        product.fileExtension,
        25 // Increased slightly to cover initial scroll impulse
    );

    // Refs
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // State
    const [isLoadingTheme, setIsLoadingTheme] = useState(false);
    const [mobileLoaded, setMobileLoaded] = useState(false);

    // Store Subscription

    // Store Subscription

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    // Buttery Smooth Scroll Physics
    const smoothProgress = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    // Scroll Indicator Opacity (Fades out quickly)
    const scrollIndicatorOpacity = useTransform(smoothProgress, [0, 0.1], [1, 0]);

    // --- Mobile: Video Logic ---
    const handleVideoLoad = () => {
        if (!mobileLoaded) {
            setMobileLoaded(true);
            if (!hasIntroPlayed) setHasIntroPlayed();
        }
    };

    // Fallback: Force mobile load after 2 seconds if video fails/stalls
    useEffect(() => {
        if (isMobile && !mobileLoaded) {
            const timer = setTimeout(() => {
                console.log("Mobile video load timeout - forcing access");
                handleVideoLoad();
            }, 2500);
            return () => clearTimeout(timer);
        }
    }, [isMobile, mobileLoaded]);

    // Effect: Load Assets based on Device
    // This useEffect is now simplified as useSequenceLoader handles desktop loading
    useEffect(() => {
        if (isMobile) {
            // Reset for mobile
            setMobileLoaded(false);
            // Video loading is handled by onCanPlayThrough
        }
        // Desktop loading is handled by useSequenceLoader
    }, [isMobile, product.folder, product.fileExtension]); // Re-run if product folder changes

    // Effect: Sync Scroll (Desktop & Mobile)
    useEffect(() => {
        // Desktop Draw Loop
        let rafId: number;

        const renderCanvas = (index: number) => {
            // Safety check
            if (!canvasRef.current || !framesRef.current) return;

            // Fallback Logic:
            // If frame[index] is missing (not loaded yet), search backwards
            // for the nearest loaded frame to prevent flickering.
            let drawImg = framesRef.current[index];
            if (!drawImg) {
                for (let i = index - 1; i >= 0; i--) {
                    if (framesRef.current[i]) {
                        drawImg = framesRef.current[i];
                        break;
                    }
                }
            }

            if (!drawImg) return; // Should not happen if critical frames are loaded

            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            const canvasRatio = canvas.width / canvas.height;
            const imgRatio = drawImg.width / drawImg.height;
            let drawWidth, drawHeight, offsetX, offsetY;

            if (imgRatio > canvasRatio) {
                drawWidth = canvas.width;
                drawHeight = canvas.width / imgRatio;
                offsetX = 0;
                offsetY = (canvas.height - drawHeight) / 2;
            } else {
                drawWidth = canvas.height * imgRatio;
                drawHeight = canvas.height;
                offsetX = (canvas.width - drawWidth) / 2;
                offsetY = 0;
            }

            // Apply Visual Adjustments (Scale & Offset)
            const scale = product.visuals?.scale || 1;
            const yOffset = (product.visuals?.yOffset || 0) * canvas.height;

            drawWidth *= scale;
            drawHeight *= scale;

            // Re-center after scaling
            offsetX = (canvas.width - drawWidth) / 2;
            offsetY = (canvas.height - drawHeight) / 2 + yOffset;

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(drawImg, offsetX, offsetY, drawWidth, drawHeight);
        };

        const handleResize = debounce(() => {
            if (canvasRef.current) {
                canvasRef.current.width = window.innerWidth;
                canvasRef.current.height = window.innerHeight;
                const currentScroll = smoothProgress.get();
                const maxFrame = product.frameCount - 1;
                const index = Math.min(maxFrame, Math.floor(currentScroll * maxFrame));
                renderCanvas(index);
            }
        }, 100);

        if (!isMobile) {
            if (canvasRef.current) {
                canvasRef.current.width = window.innerWidth;
                canvasRef.current.height = window.innerHeight;
            }
            window.addEventListener('resize', handleResize);
        }

        const unsubscribe = smoothProgress.on("change", (latest) => {
            if (isMobile) {
                // Mobile Video Sync
                if (videoRef.current && videoRef.current.duration) {
                    requestAnimationFrame(() => {
                        if (videoRef.current) {
                            videoRef.current.currentTime = videoRef.current.duration * latest;
                        }
                    });
                }
            } else {
                // Desktop Canvas Sync
                const maxFrame = product.frameCount - 1;
                const index = Math.min(maxFrame, Math.floor(latest * maxFrame));
                rafId = requestAnimationFrame(() => renderCanvas(index));
            }
        });

        // Initial Paint loop to ensure first frame renders as soon as available
        if (!isMobile && isCriticalLoaded) {
            renderCanvas(0);
            if (!hasIntroPlayed) setHasIntroPlayed();
        }

        return () => {
            unsubscribe();
            window.removeEventListener('resize', handleResize);
            if (rafId) cancelAnimationFrame(rafId);
        };
    }, [smoothProgress, isMobile, isCriticalLoaded, framesRef]); // Re-bind when critical loaded

    // Determine Loading State
    const isReady = isMobile ? mobileLoaded : isCriticalLoaded;
    const progressValue = isMobile ? (mobileLoaded ? 100 : 0) : progress;

    return (
        <motion.div
            ref={containerRef}
            className="h-[400vh] relative bg-[#050505] snap-y snap-mandatory"
            initial={{ opacity: 0, scale: 0.98, filter: "blur(10px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            transition={{ duration: 1.0, ease: "easeOut" }}
        >
            {/* Scroll Snap Points */}
            <div className="absolute top-0 w-full h-screen snap-start pointer-events-none" />
            <div className="absolute top-[100vh] w-full h-screen snap-start pointer-events-none" />
            <div className="absolute top-[200vh] w-full h-screen snap-start pointer-events-none" />
            <div className="absolute top-[300vh] w-full h-screen snap-start pointer-events-none" />
            <div className="sticky top-0 h-screen w-full overflow-hidden bg-[#050505]">
                <AnimatePresence>
                    {/* Theme Switch Overlay - only needed if we want to hide the swap */}
                    {/* We can optional disable this for faster feel, or keep it short */}
                </AnimatePresence>

                {/* BootLoader now dismisses as soon as Critical Path is ready */}
                <BootLoader progress={progressValue} complete={isReady} skip={hasIntroPlayed} />

                {/* Scroll Indicator */}
                {!isMobile && isReady && hasIntroPlayed && (
                    <motion.div
                        style={{ opacity: scrollIndicatorOpacity }}
                        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-40 flex flex-col items-center gap-2 pointer-events-none mix-blend-difference"
                    >
                        <span className="text-[10px] font-mono tracking-[0.2em] text-white/50">SCROLL TO EXPLORE</span>
                        <div className="w-[1px] h-8 bg-gradient-to-b from-white/0 via-white/50 to-white/0" />
                    </motion.div>
                )}

                {isMobile ? (
                    // Mobile Video Player
                    <video
                        ref={videoRef}
                        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                        src={product.mobileVideo}
                        poster={`${product.folder}/0001.${product.fileExtension}`}
                        muted
                        playsInline
                        loop
                        preload="auto"
                        onCanPlayThrough={handleVideoLoad}
                        onLoadedData={handleVideoLoad}
                        onError={handleVideoLoad} // Fail gracefully
                    />
                ) : (
                    // Desktop Canvas
                    <canvas
                        ref={canvasRef}
                        className="absolute inset-0 w-full h-full object-contain pointer-events-none"
                    />
                )}

                {/* Vignette Overlay for "Floating" Look */}
                <div className="absolute inset-0 pointer-events-none z-10 bg-[radial-gradient(circle_at_center,transparent_60%,#050505_100%)]" />

                <TextOverlays scrollYProgress={smoothProgress} product={product} />
            </div>
        </motion.div>
    );
}
