'use client';
import { useEffect, useRef, useState, useCallback } from 'react';
import { useScroll, AnimatePresence, motion } from 'framer-motion';
import BootLoader from './BootLoader';
import TextOverlays from './TextOverlays';
import { useProductStore } from '@/store/productStore';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { useSequenceLoader } from '@/hooks/useSequenceLoader';

// Simple debounce utility
function debounce(fn: Function, ms: number) {
    let timer: NodeJS.Timeout;
    return (...args: any[]) => {
        clearTimeout(timer);
        timer = setTimeout(() => fn(...args), ms);
    };
}

export default function ProductSequence() {
    const isMobile = useMediaQuery('(max-width: 768px)');
    const { activeProduct } = useProductStore();

    // Custom Hook for Progressive Loading (Desktop Only)
    // Critical Path: Load first 25 frames (Hero Loop) immediately.
    // Background: Load rest silently.
    const {
        frames: framesRef,
        progress,
        isCriticalLoaded,
        isFullLoaded
    } = useSequenceLoader(
        activeProduct.folder,
        activeProduct.frameCount,
        activeProduct.fileExtension,
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

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    // --- Mobile: Video Logic ---
    const handleVideoLoad = () => {
        setMobileLoaded(true);
    };

    // Effect: Load Assets based on Device
    // This useEffect is now simplified as useSequenceLoader handles desktop loading
    useEffect(() => {
        if (isMobile) {
            // Reset for mobile
            setMobileLoaded(false);
            // Video loading is handled by onCanPlayThrough
        }
        // Desktop loading is handled by useSequenceLoader
    }, [isMobile, activeProduct.folder, activeProduct.fileExtension]); // Re-run if product folder changes

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
            const scale = activeProduct.visuals?.scale || 1;
            const yOffset = (activeProduct.visuals?.yOffset || 0) * canvas.height;

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
                const currentScroll = scrollYProgress.get();
                const maxFrame = activeProduct.frameCount - 1;
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

        const unsubscribe = scrollYProgress.on("change", (latest) => {
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
                const maxFrame = activeProduct.frameCount - 1;
                const index = Math.min(maxFrame, Math.floor(latest * maxFrame));
                rafId = requestAnimationFrame(() => renderCanvas(index));
            }
        });

        // Initial Paint loop to ensure first frame renders as soon as available
        if (!isMobile && isCriticalLoaded) {
            renderCanvas(0);
        }

        return () => {
            unsubscribe();
            window.removeEventListener('resize', handleResize);
            if (rafId) cancelAnimationFrame(rafId);
        };
    }, [scrollYProgress, isMobile, isCriticalLoaded, framesRef]); // Re-bind when critical loaded

    // Determine Loading State
    const isReady = isMobile ? mobileLoaded : isCriticalLoaded;
    const progressValue = isMobile ? (mobileLoaded ? 100 : 0) : progress;

    return (
        <div ref={containerRef} className="h-[300vh] relative bg-spectre-black">
            <div className="sticky top-0 h-screen w-full overflow-hidden bg-black">
                <AnimatePresence>
                    {/* Theme Switch Overlay - only needed if we want to hide the swap */}
                    {/* We can optional disable this for faster feel, or keep it short */}
                </AnimatePresence>

                {/* BootLoader now dismisses as soon as Critical Path is ready */}
                <BootLoader progress={progressValue} complete={isReady} />

                {isMobile ? (
                    // Mobile Video Player
                    <video
                        ref={videoRef}
                        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                        src={activeProduct.mobileVideo}
                        muted
                        playsInline
                        preload="auto"
                        onCanPlayThrough={handleVideoLoad}
                    />
                ) : (
                    // Desktop Canvas
                    <canvas
                        ref={canvasRef}
                        className="absolute inset-0 w-full h-full object-contain pointer-events-none"
                    />
                )}

                <TextOverlays scrollYProgress={scrollYProgress} />
            </div>
        </div>
    );
}
