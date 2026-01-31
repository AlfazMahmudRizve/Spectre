'use client';
import { useEffect, useRef, useState, useCallback } from 'react';
import { useScroll, AnimatePresence, motion } from 'framer-motion';
import BootLoader from './BootLoader';
import TextOverlays from './TextOverlays';
import { useEditionStore } from '@/store/editionStore';

// Simple debounce utility
function debounce(fn: Function, ms: number) {
    let timer: NodeJS.Timeout;
    return (...args: any[]) => {
        clearTimeout(timer);
        timer = setTimeout(() => fn(...args), ms);
    };
}

export default function ProductSequence() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [loaded, setLoaded] = useState(false);
    const [progress, setProgress] = useState(0);

    // Store Subscription
    const { currentEdition, config } = useEditionStore();
    const [isLoadingTheme, setIsLoadingTheme] = useState(false);

    // Cache for frames
    const framesRef = useRef<HTMLImageElement[]>([]);
    const abortControllerRef = useRef<AbortController | null>(null);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    const loadImages = useCallback(async () => {
        // Cancel previous load if active
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
        const controller = new AbortController();
        abortControllerRef.current = controller;

        setIsLoadingTheme(true);
        const frameCount = 120;
        let loadedCount = 0;
        const newFrames: HTMLImageElement[] = [];

        // Explicitly clear memory
        framesRef.current = [];

        try {
            for (let i = 0; i < frameCount; i++) {
                if (controller.signal.aborted) return;

                const img = new Image();
                img.src = `${config.sequencePath}/${i}.webp`;

                await new Promise<void>((resolve) => {
                    img.onload = () => {
                        if (controller.signal.aborted) return;
                        loadedCount++;
                        setProgress(Math.round((loadedCount / frameCount) * 100));
                        resolve();
                    };
                    img.onerror = () => {
                        console.warn(`Failed frame ${i}`);
                        loadedCount++;
                        resolve();
                    };
                });
                newFrames.push(img);
            }

            if (!controller.signal.aborted) {
                framesRef.current = newFrames;
                setLoaded(true);
                setIsLoadingTheme(false);

                // Initial draw
                const ctx = canvasRef.current?.getContext('2d');
                if (ctx && newFrames[0]) {
                    requestAnimationFrame(() => {
                        if (canvasRef.current) {
                            ctx.drawImage(newFrames[0], 0, 0, canvasRef.current.width, canvasRef.current.height);
                        }
                    });
                }
            }
        } catch (e) {
            console.error("Sequence load error", e);
        }
    }, [config.sequencePath, config.name]);

    // Effect to trigger load
    useEffect(() => {
        loadImages();
        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
            framesRef.current = [];
        };
    }, [loadImages]);

    // Draw Loop
    useEffect(() => {
        if (!canvasRef.current || !loaded) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let rafId: number;

        const render = (index: number) => {
            if (!framesRef.current[index]) return;
            const img = framesRef.current[index];

            const canvasRatio = canvas.width / canvas.height;
            const imgRatio = img.width / img.height;
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

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
        };

        const handleResize = debounce(() => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            const currentScroll = scrollYProgress.get();
            const index = Math.min(119, Math.floor(currentScroll * 119));
            render(index);
        }, 100);

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        window.addEventListener('resize', handleResize);

        const unsubscribe = scrollYProgress.on("change", (latest) => {
            const index = Math.min(119, Math.floor(latest * 119));
            rafId = requestAnimationFrame(() => render(index));
        });

        render(0);

        return () => {
            unsubscribe();
            window.removeEventListener('resize', handleResize);
            if (rafId) cancelAnimationFrame(rafId);
        };
    }, [loaded, scrollYProgress, currentEdition]);

    return (
        <div ref={containerRef} className="h-[600vh] relative bg-spectre-black">
            <div className="sticky top-0 h-screen w-full overflow-hidden bg-black">
                <AnimatePresence>
                    {isLoadingTheme && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 z-50 bg-black/90 flex items-center justify-center font-mono text-spectre-cyan"
                        >
                            <span className="animate-pulse">LOADING_SEQUENCE::{config.name}</span>
                        </motion.div>
                    )}
                </AnimatePresence>
                <BootLoader progress={progress} complete={loaded} />
                <canvas ref={canvasRef} className="absolute inset-0 w-full h-full object-contain pointer-events-none" />
                <TextOverlays scrollYProgress={scrollYProgress} />
            </div>
        </div>
    );
}
