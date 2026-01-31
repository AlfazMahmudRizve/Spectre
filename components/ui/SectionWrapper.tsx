import { ReactNode } from 'react';

interface SectionWrapperProps {
    children: ReactNode;
    className?: string;
    id?: string;
}

export default function SectionWrapper({ children, className = '', id }: SectionWrapperProps) {
    return (
        <section id={id} className={`py-20 md:py-32 relative ${className}`}>
            <div className="max-w-7xl mx-auto px-6 md:px-12 w-full">
                {children}
            </div>
        </section>
    );
}
