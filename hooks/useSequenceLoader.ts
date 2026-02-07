import { useState, useEffect, useRef, useCallback } from 'react';

interface SequenceLoaderResult {
    frames: React.MutableRefObject<(HTMLImageElement | null)[]>;
    progress: number;
    isCriticalLoaded: boolean;
    isFullLoaded: boolean;
    isFirstFrameLoaded: boolean;
}

export function useSequenceLoader(
    basePath: string,
    frameCount: number,
    extension: string = 'webp',
    criticalCount: number = 20
): SequenceLoaderResult {
    const framesRef = useRef<(HTMLImageElement | null)[]>(new Array(frameCount).fill(null));
    const [progress, setProgress] = useState(0);
    const [isCriticalLoaded, setIsCriticalLoaded] = useState(false);
    const [isFullLoaded, setIsFullLoaded] = useState(false);
    const [isFirstFrameLoaded, setIsFirstFrameLoaded] = useState(false);
    const abortControllerRef = useRef<AbortController | null>(null);

    const loadSequence = useCallback(async () => {
        // Cleanup previous load
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
        const controller = new AbortController();
        abortControllerRef.current = controller;

        // Reset State
        framesRef.current = new Array(frameCount).fill(null);
        setProgress(0);
        setIsCriticalLoaded(false);
        setIsFullLoaded(false);
        setIsFirstFrameLoaded(false);

        let loadedCritical = 0;

        // Helper to load a single image
        const loadImage = (index: number): Promise<void> => {
            return new Promise((resolve) => {
                const img = new Image();
                img.src = `${basePath}/${index}.${extension}`;

                img.onload = () => {
                    if (controller.signal.aborted) return;
                    framesRef.current[index] = img;
                    if (index === 0) setIsFirstFrameLoaded(true);
                    resolve();
                };

                img.onerror = () => {
                    console.warn(`Failed to load frame ${index}`);
                    resolve(); // Resolve anyway to continue
                };
            });
        };

        try {
            // 1. Critical Phase (Parallel)
            // We load critical frames in batches or parallel to be fast
            const criticalPromises = [];
            for (let i = 0; i < criticalCount; i++) {
                const p = loadImage(i).then(() => {
                    if (controller.signal.aborted) return;
                    loadedCritical++;
                    setProgress(Math.round((loadedCritical / criticalCount) * 100));
                });
                criticalPromises.push(p);
            }

            await Promise.all(criticalPromises);

            if (controller.signal.aborted) return;
            setIsCriticalLoaded(true);

            // 2. Background Phase (Sequential or Batched to yield network)
            // We load the rest silently.
            // Using small batches to avoid blocking
            const batchSize = 5;
            for (let i = criticalCount; i < frameCount; i += batchSize) {
                if (controller.signal.aborted) return;

                const batchPromises = [];
                for (let j = i; j < Math.min(i + batchSize, frameCount); j++) {
                    batchPromises.push(loadImage(j));
                }
                await Promise.all(batchPromises);

                // Small delay to yield to main thread/network interactions if needed
                await new Promise(r => setTimeout(r, 10));
            }

            if (!controller.signal.aborted) {
                setIsFullLoaded(true);
            }

        } catch (error) {
            console.error("Sequence loader halted", error);
        }

    }, [basePath, frameCount, criticalCount, extension]);

    useEffect(() => {
        loadSequence();
        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, [loadSequence]);

    return {
        frames: framesRef,
        progress, // 0-100 based on Critical Path
        isCriticalLoaded,
        isFullLoaded,
        isFirstFrameLoaded
    };
}
