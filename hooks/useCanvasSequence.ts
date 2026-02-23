'use client';
import { useEffect, useRef, useCallback } from 'react';
import { useScroll, useSpring } from 'framer-motion';
import { Product } from '@/data/products';
import { useSequenceLoader } from './useSequenceLoader';

interface UseCanvasSequenceProps {
    product: Product;
    containerRef: React.RefObject<HTMLDivElement | null>;
    isMobile: boolean;
}

export function useCanvasSequence({ product, containerRef, isMobile }: UseCanvasSequenceProps) {
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    // Tuned for silk-smooth scrolling: lower stiffness = less "springy",
    // higher damping = less oscillation, smaller restDelta = more precise settling
    const smoothProgress = useSpring(scrollYProgress, {
        stiffness: 60,
        damping: 20,
        restDelta: 0.0005
    });

    const {
        frames: framesRef,
        progress,
        isCriticalLoaded,
        isFirstFrameLoaded
    } = useSequenceLoader(
        product.folder,
        product.frameCount,
        product.fileExtension,
        isMobile ? 10 : 25
    );

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const lastFrameIndex = useRef(-1);

    // Set canvas dimensions based on device pixel ratio for crisp rendering
    const setCanvasDimensions = useCallback(() => {
        if (!canvasRef.current) return;
        // Use full resolution on all devices — the 0.6 mobile downscale was causing blurriness
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        canvasRef.current.width = window.innerWidth * dpr;
        canvasRef.current.height = window.innerHeight * dpr;
    }, []);

    const renderCanvas = useCallback((index: number) => {
        if (!canvasRef.current || !framesRef.current) return;

        // Skip redundant draws
        if (index === lastFrameIndex.current) return;
        lastFrameIndex.current = index;

        // Find nearest loaded frame (fallback)
        let drawImg = framesRef.current[index];
        if (!drawImg) {
            for (let i = index - 1; i >= 0; i--) {
                if (framesRef.current[i]) { drawImg = framesRef.current[i]; break; }
            }
        }
        if (!drawImg) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const imgRatio = drawImg.width / drawImg.height;
        const canvasRatio = canvas.width / canvas.height;
        let drawWidth: number, drawHeight: number, offsetX: number, offsetY: number;

        if (imgRatio > canvasRatio) {
            drawWidth = canvas.width;
            drawHeight = canvas.width / imgRatio;
        } else {
            drawWidth = canvas.height * imgRatio;
            drawHeight = canvas.height;
        }

        // Apply product-specific visuals
        let scale = product.visuals?.scale || 1;

        // Mobile: use aspect-ratio-aware scaling instead of a hardcoded 2.2x multiplier
        if (isMobile) {
            const screenRatio = window.innerWidth / window.innerHeight;
            // Portrait screens need more zoom to fill the narrow viewport
            scale *= screenRatio < 0.6 ? 1.8 : 1.5;
        }

        const yOffset = (product.visuals?.yOffset || 0) * canvas.height;

        drawWidth *= scale;
        drawHeight *= scale;
        offsetX = (canvas.width - drawWidth) / 2;
        offsetY = (canvas.height - drawHeight) / 2 + yOffset;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(drawImg, offsetX, offsetY, drawWidth, drawHeight);
    }, [product.visuals, framesRef, isMobile]);

    // Main render loop — only starts when critical frames are ready
    useEffect(() => {
        let rafId: number;

        setCanvasDimensions();

        const loop = () => {
            const currentScroll = smoothProgress.get();
            const maxFrame = product.frameCount - 1;
            const index = Math.min(maxFrame, Math.floor(currentScroll * maxFrame));
            renderCanvas(index);
            rafId = requestAnimationFrame(loop);
        };

        if (isCriticalLoaded) {
            // Force render frame 0 immediately so it's never blank
            lastFrameIndex.current = -1;
            renderCanvas(0);
            rafId = requestAnimationFrame(loop);
        }

        const handleResize = () => {
            setCanvasDimensions();
            lastFrameIndex.current = -1; // Force re-render after resize
        };

        window.addEventListener('resize', handleResize);

        return () => {
            if (rafId) cancelAnimationFrame(rafId);
            window.removeEventListener('resize', handleResize);
            if (framesRef.current) {
                framesRef.current = [];
            }
        };
    }, [isCriticalLoaded, smoothProgress, product.frameCount, renderCanvas, setCanvasDimensions, framesRef]);

    // Immediate first-frame render (fix for "blank until scroll")
    useEffect(() => {
        if (isFirstFrameLoaded && canvasRef.current) {
            setCanvasDimensions();
            lastFrameIndex.current = -1;
            renderCanvas(0);
        }
    }, [isFirstFrameLoaded, renderCanvas, setCanvasDimensions]);

    return {
        canvasRef,
        smoothProgress,
        progress: isMobile && isCriticalLoaded ? 100 : progress,
        isReady: isCriticalLoaded
    };
}
