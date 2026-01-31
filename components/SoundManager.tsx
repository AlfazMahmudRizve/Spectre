'use client';
import { createContext, useContext, useState, useEffect, ReactNode, useRef } from 'react';
import { Howl } from 'howler';

interface SoundContextType {
    playHover: () => void;
    playClick: () => void;
    isMuted: boolean;
    toggleMute: () => void;
}

const SoundContext = createContext<SoundContextType | undefined>(undefined);

export function SoundProvider({ children }: { children: ReactNode }) {
    const [isMuted, setIsMuted] = useState(false);

    // Refs to hold Howl instances
    const hoverSound = useRef<Howl | null>(null);
    const clickSound = useRef<Howl | null>(null);

    useEffect(() => {
        hoverSound.current = new Howl({
            src: ['/sounds/hover.mp3'],
            volume: 0.2,
            preload: true,
            html5: true,
        });

        clickSound.current = new Howl({
            src: ['/sounds/click.mp3'],
            volume: 0.5,
            preload: true,
            html5: true,
        });

        return () => {
            hoverSound.current?.unload();
            clickSound.current?.unload();
        };
    }, []);

    const playHover = () => {
        if (!isMuted && hoverSound.current) {
            hoverSound.current.play();
        }
    };

    const playClick = () => {
        if (!isMuted && clickSound.current) {
            clickSound.current.play();
        }
    };

    const toggleMute = () => {
        setIsMuted(!isMuted);
    };

    return (
        <SoundContext.Provider value={{ playHover, playClick, isMuted, toggleMute }}>
            {children}
        </SoundContext.Provider>
    );
}

export function useSound() {
    const context = useContext(SoundContext);
    if (context === undefined) {
        throw new Error('useSound must be used within a SoundProvider');
    }
    return context;
}
