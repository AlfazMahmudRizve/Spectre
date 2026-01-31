'use client';
import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface BootLoaderProps {
    progress: number;
    complete: boolean;
    skip?: boolean;
}

const bootLogs = [
    "INITIALIZING_KERNEL...",
    "LOADING_VRAM_BUFFERS...",
    "MOUNTING_FILE_SYSTEM...",
    "CHECKING_INTEGRITY...",
    "ESTABLISHING_SECURE_LINK...",
    "DECRYPTING_ASSETS...",
    "ALLOCATING_MEMORY_BLOCKS...",
    "OPTIMIZING_RENDER_PIPELINE...",
    "SYNCING_PHYSICS_ENGINE...",
    "ACCESS_GRANTED."
];

export default function BootLoader({ progress, complete, skip = false }: BootLoaderProps) {
    const [logs, setLogs] = useState<string[]>([]);
    const scrollRef = useRef<HTMLDivElement>(null);
    const [show, setShow] = useState(!skip);

    // Handle exit delay
    useEffect(() => {
        if (complete) {
            // Wait a moment for "ACCESS_GRANTED" to be read, then fade out
            const timer = setTimeout(() => setShow(false), 800);
            return () => clearTimeout(timer);
        }
    }, [complete]);

    // Logic to reveal logs based on progress
    useEffect(() => {
        const logIndex = Math.floor((progress / 100) * (bootLogs.length - 1));
        const currentLogs = bootLogs.slice(0, logIndex + 1);
        // Add some random hex data for cyberpunk feel
        if (Math.random() > 0.7) {
            currentLogs.push(`0x${Math.floor(Math.random() * 16777215).toString(16).toUpperCase()}_OK`);
        }
        setLogs(currentLogs);
    }, [progress]);

    // Auto scroll to bottom
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [logs]);

    if (skip) return null;

    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center font-mono text-spectre-cyan text-sm sm:text-base"
                    exit={{ opacity: 0, y: -50 }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                >
                    <div className="w-full max-w-lg p-8 border border-spectre-grey/30 bg-spectre-grey/10 backdrop-blur-sm rounded-sm">
                        <div className="flex justify-between items-center mb-4 border-b border-spectre-cyan/30 pb-2">
                            <span>SPECTRE_OS v2.0</span>
                            <span>{Math.round(progress)}%</span>
                        </div>

                        <div ref={scrollRef} className="h-48 overflow-hidden flex flex-col justify-end space-y-1">
                            <AnimatePresence>
                                {logs.map((log, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="opacity-80"
                                    >
                                        {`> ${log}`}
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>

                        <div className="w-full h-1 bg-spectre-grey mt-6 relative overflow-hidden">
                            <motion.div
                                className="absolute top-0 left-0 h-full bg-spectre-cyan shadow-[0_0_10px_#00F0FF]"
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                transition={{ type: "tween", ease: "linear", duration: 0.2 }}
                            />
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
