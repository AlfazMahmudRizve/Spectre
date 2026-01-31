'use client';
import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Howl } from 'howler';
import GhostButton from './ui/GhostButton';
import SectionWrapper from './ui/SectionWrapper';

export default function SoundTest() {
    const [mode, setMode] = useState<'linear' | 'tactile'>('linear');
    const [isPlaying, setIsPlaying] = useState(false);
    const soundRef = useRef<Howl | null>(null);

    // Stop audio on unmount or mode switch
    useEffect(() => {
        return () => {
            if (soundRef.current) {
                soundRef.current.stop();
            }
        };
    }, [mode]);

    const togglePlay = () => {
        if (isPlaying) {
            soundRef.current?.stop();
            setIsPlaying(false);
        } else {
            // Setup new sound
            if (soundRef.current) soundRef.current.unload();

            const audioPaths = {
                linear: '/sounds/linear_typing.wav',
                tactile: '/sounds/tactile_typing.mp3'
            };

            soundRef.current = new Howl({
                src: [audioPaths[mode]],
                loop: true,
                volume: 0.8,
                html5: true,
                onend: () => setIsPlaying(false)
            });

            soundRef.current.play();
            setIsPlaying(true);
        }
    };

    const switchMode = (newMode: 'linear' | 'tactile') => {
        if (mode === newMode) return;
        if (isPlaying) {
            soundRef.current?.stop();
            setIsPlaying(false);
        }
        setMode(newMode);
    };

    return (
        <SectionWrapper className="bg-black border-t border-white/10">
            <div className="text-center mb-12">
                <h2 className="text-4xl md:text-5xl font-grotesk font-bold text-white mb-2">SONIC <span className="text-spectre-cyan">LAB</span></h2>
                <p className="font-mono text-spectre-grey text-sm">TEST THE ACOUSTICS</p>
            </div>

            {/* Controls Container */}
            <div className="bg-spectre-black/50 border border-white/10 rounded-2xl p-8 md:p-12 backdrop-blur-sm relative overflow-hidden max-w-4xl mx-auto">

                {/* Mode Toggle */}
                <div className="flex justify-center mb-12">
                    <div className="grid grid-cols-2 bg-white/5 rounded-full p-1 border border-white/10 relative">
                        <motion.div
                            className="absolute top-1 bottom-1 w-[calc(50%-4px)] bg-spectre-cyan/20 rounded-full border border-spectre-cyan/50 shadow-[0_0_15px_rgba(0,240,255,0.3)]"
                            animate={{ left: mode === 'linear' ? '4px' : 'calc(50%)' }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                        <button
                            onClick={() => switchMode('linear')}
                            className={`px-8 py-2 text-sm font-mono relative z-10 transition-colors ${mode === 'linear' ? 'text-spectre-cyan font-bold' : 'text-spectre-grey hover:text-white'}`}
                        >
                            LINEAR (STEALTH)
                        </button>
                        <button
                            onClick={() => switchMode('tactile')}
                            className={`px-8 py-2 text-sm font-mono relative z-10 transition-colors ${mode === 'tactile' ? 'text-spectre-cyan font-bold' : 'text-spectre-grey hover:text-white'}`}
                        >
                            TACTILE (CYBER)
                        </button>
                    </div>
                </div>

                {/* Visualizer */}
                <div className="flex justify-center items-end gap-1 md:gap-2 h-40 mb-12 px-4">
                    {[...Array(20)].map((_, i) => (
                        <motion.div
                            key={i}
                            className={`w-2 md:w-3 rounded-t-sm ${isPlaying ? 'bg-spectre-cyan shadow-[0_0_10px_#00F0FF]' : 'bg-white/10'}`}
                            animate={{
                                height: isPlaying
                                    ? [20, Math.random() * 120 + 20, 20]
                                    : 4
                            }}
                            transition={{
                                repeat: Infinity,
                                duration: 0.5,
                                repeatType: "reverse",
                                delay: i * 0.05
                            }}
                        />
                    ))}
                </div>

                {/* Play Button */}
                <div className="flex justify-center">
                    <GhostButton
                        onClick={togglePlay}
                        className="w-20 h-20 rounded-full !px-0"
                        variant="outline"
                    >
                        {isPlaying ? (
                            <div className="flex gap-1.5">
                                <span className="w-1.5 h-6 bg-white" />
                                <span className="w-1.5 h-6 bg-white" />
                            </div>
                        ) : (
                            <div className="ml-1 w-0 h-0 border-t-[10px] border-t-transparent border-l-[18px] border-l-white border-b-[10px] border-b-transparent" />
                        )}
                    </GhostButton>
                </div>

            </div>
        </SectionWrapper>
    );
}
