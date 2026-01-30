'use client';
import { useEffect, useRef, useState } from 'react';
import { useScroll, useTransform, motion } from 'framer-motion';
import CanvasLoader from './CanvasLoader';
import TextOverlays from './TextOverlays';

export default function ProductSequence() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [images, setImages] = useState<HTMLImageElement[]>([]);
    const [loaded, setLoaded] = useState(false);
    const [progress, setProgress] = useState(0);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    // Load images
    useEffect(() => {
        let loadedCount = 0;
        const totalFrames = 120;
        // Initialize with nulls but typed as array of nullable images
        const loadedImages: (HTMLImageElement | null)[] = new Array(totalFrames).fill(null);
        let active = true;

        const loadPromises = Array.from({ length: totalFrames }, (_, i) => {
            return new Promise<void>((resolve) => {
                const img = new Image();
                img.src = `/images/spectre/${i}.jpg`;
                img.onload = () => {
                    if (!active) return;
                    loadedCount++;
                    setProgress(Math.round((loadedCount / totalFrames) * 100));
                    loadedImages[i] = img;
                    resolve();
                };
                img.onerror = () => {
                    console.warn(`Failed to load frame ${i}`);
                    loadedCount++;
                    setProgress(Math.round((loadedCount / totalFrames) * 100));
                    resolve(); // resolve anyway
                };
            });
        });

        Promise.all(loadPromises).then(() => {
            if (active) {
                // Filter out any potential nulls if failure occurred (though we resolved)
                // If image failed, it stays null. We should filter or handle null in render.
                // For now, we cast but render assumes defined.
                // Better: Filter for type safety, but index mapping relies on position.
                // If index 40 fails, images[40] is null.
                setImages(loadedImages as HTMLImageElement[]);
                setLoaded(true);
            }
        });

        return () => { active = false; };
    }, []);

    // Draw logic
    useEffect(() => {
        if (!canvasRef.current || images.length === 0 || !loaded) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let requestAnimationFrameId: number;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        let currentFrameIndex = 0;

        const render = (index: number) => {
            currentFrameIndex = index;
            const img = images[index];
            if (!img) return;

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

        const handleResize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            render(currentFrameIndex);
        };

        handleResize();
        window.addEventListener('resize', handleResize);

        const unsubscribe = scrollYProgress.on("change", (latest) => {
            const index = Math.min(119, Math.floor(latest * 119));
            requestAnimationFrameId = requestAnimationFrame(() => render(index));
        });

        render(0);

        return () => {
            unsubscribe();
            window.removeEventListener('resize', handleResize);
            if (requestAnimationFrameId) cancelAnimationFrame(requestAnimationFrameId);
        }
    }, [loaded, scrollYProgress, images]);

    return (
        <>
            <CanvasLoader progress={progress} loaded={loaded} />
            <div ref={containerRef} className="h-[600vh] relative bg-spectre-black">
                <div className="sticky top-0 h-screen w-full overflow-hidden">
                    <canvas ref={canvasRef} className="absolute inset-0 w-full h-full object-contain pointer-events-none" />
                    <TextOverlays scrollYProgress={scrollYProgress} />
                </div>
            </div>
        </>
    )
}
