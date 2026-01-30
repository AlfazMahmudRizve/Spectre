'use client';
import { motion, AnimatePresence } from 'framer-motion';

interface CanvasLoaderProps {
    progress: number;
    loaded: boolean;
}

export default function CanvasLoader({ progress, loaded }: CanvasLoaderProps) {
    return (
        <AnimatePresence>
            {!loaded && (
                <motion.div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-spectre-black text-white"
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                >
                    <div className="flex flex-col items-center gap-6">
                        <h1 className="text-6xl font-grotesk font-bold tracking-[0.2em] animate-pulse">SPECTRE</h1>
                        <div className="w-96 h-1 bg-spectre-grey rounded-full overflow-hidden">
                            <motion.div
                                className="h-full bg-spectre-cyan"
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                            />
                        </div>
                        <p className="font-mono text-sm text-spectre-cyan tracking-widest">{Math.round(progress)}% SYSTEM LOAD</p>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
