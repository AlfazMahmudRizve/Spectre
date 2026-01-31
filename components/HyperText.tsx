'use client';
import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';

interface HyperTextProps {
    text: string;
    duration?: number;
    className?: string;
}

const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()_+~`|}{[]:;?><,./-=";

export default function HyperText({ text, duration = 800, className }: HyperTextProps) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });
    const [displayText, setDisplayText] = useState("");
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (!isInView) return;

        let iteration = 0;
        const totalIterations = 10; // How many scrambles per letter logic

        // We can just scramble the whole thing for 'duration'
        // But aiming for a decoder effect: left to right

        if (intervalRef.current) clearInterval(intervalRef.current);

        intervalRef.current = setInterval(() => {
            setDisplayText((prev) =>
                text.split("").map((letter, index) => {
                    if (index < iteration) {
                        return text[index];
                    }
                    return characters[Math.floor(Math.random() * characters.length)];
                }).join("")
            );

            if (iteration >= text.length) {
                if (intervalRef.current) clearInterval(intervalRef.current);
            }

            iteration += 1 / 3; // Slow down letter locking
        }, 30);

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [isInView, text]);

    return (
        <span ref={ref} className={className}>
            {displayText || text /* Fallback to text if JS broken or initial */}
        </span>
    );
}
