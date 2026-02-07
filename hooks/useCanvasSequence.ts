'use client';
import { useEffect, useRef, useState, useCallback } from 'react';
import { useScroll, useSpring, useTransform, MotionValue } from 'framer-motion';
import { Product } from '@/data/products';
import { useSequenceLoader } from './useSequenceLoader';

// Simple debounce utility
function debounce(fn: Function, ms: number) {
    let timer: NodeJS.Timeout;
    return (...args: any[]) => {
        clearTimeout(timer);
        timer = setTimeout(() => fn(...args), ms);
    };
}

interface UseCanvasSequenceProps {
    product: Product;
    containerRef: React.RefObject<HTMLDivElement | null>;
    isMobile: boolean;
}

export function useCanvasSequence({ product, containerRef, isMobile }: UseCanvasSequenceProps) {
    // 1. Scroll Setup
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    const smoothProgress = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    // 2. Asset Loading (Unified)
    const {
        frames: framesRef,
        progress,
        isCriticalLoaded,
        isFullLoaded
    } = useSequenceLoader(
        product.folder,
        product.frameCount,
        product.fileExtension,
        isMobile ? 10 : 25 // Load fewer critical frames on mobile for speed
    );

    // 3. Canvas Refs
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // 4. Render Logic
    const renderCanvas = useCallback((index: number) => {
        if (!canvasRef.current || !framesRef.current) return;

        // Fallback: Find nearest loaded frame
        let drawImg = framesRef.current[index];
        if (!drawImg) {
            for (let i = index - 1; i >= 0; i--) {
                if (framesRef.current[i]) {
                    drawImg = framesRef.current[i];
                    break;
                }
            }
        }

        if (!drawImg) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Auto-scale to fill/contain based on product specs
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

        // Apply Custom Visuals
        let scale = product.visuals?.scale || 1;

        // Mobile Adjustment: Zoom in to fill screen better (Portrait mode)
        if (isMobile) {
            scale *= 2.2; // Significant boost for portrait
        }

        const yOffset = (product.visuals?.yOffset || 0) * canvas.height;

        drawWidth *= scale;
        drawHeight *= scale;

        offsetX = (canvas.width - drawWidth) / 2;
        offsetY = (canvas.height - drawHeight) / 2 + yOffset;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(drawImg, offsetX, offsetY, drawWidth, drawHeight);
    }, [product.visuals, framesRef]); // Dependencies

    // 5. Scroll Loop
    useEffect(() => {
        let rafId: number;
        const resolutionScale = isMobile ? 0.6 : 1; // Reduce memory usage on mobile

        const loop = () => {
            // Unify: Desktop & Mobile both use Scroll Progress for frame index
            const currentScroll = smoothProgress.get();
            const maxFrame = product.frameCount - 1;
            const index = Math.min(maxFrame, Math.floor(currentScroll * maxFrame));

            renderCanvas(index);
            rafId = requestAnimationFrame(loop);
        };

        // Start loop only when critical frames are ready
        if (isCriticalLoaded) {
            rafId = requestAnimationFrame(loop);
        }

        // Resize Handler
        const handleResize = debounce(() => {
            if (canvasRef.current) {
                // Internal Resolution Scaling
                canvasRef.current.width = window.innerWidth * resolutionScale;
                canvasRef.current.height = window.innerHeight * resolutionScale;

                // Force re-render immediately
                const currentScroll = smoothProgress.get();
                const maxFrame = product.frameCount - 1;
                const index = Math.min(maxFrame, Math.floor(currentScroll * maxFrame));
                renderCanvas(index);
            }
        }, 100);

        // Initial setup
        if (canvasRef.current) {
            canvasRef.current.width = window.innerWidth * resolutionScale;
            canvasRef.current.height = window.innerHeight * resolutionScale;
        }

        window.addEventListener('resize', handleResize);

        return () => {
            if (rafId) cancelAnimationFrame(rafId);
            window.removeEventListener('resize', handleResize);

            // Aggressive Cleanup: Help GC reclaiming memory
            // We empty the array so the Image objects lose their references
            if (framesRef.current) {
                framesRef.current = [];
            }
        };

    }, [isCriticalLoaded, smoothProgress, product.frameCount, renderCanvas, isMobile, framesRef]);

    return {
        canvasRef,
        smoothProgress,
        progress: isMobile && isCriticalLoaded ? 100 : progress, // Fake 100% on mobile once critical is done 
        isReady: isCriticalLoaded
    };
}
