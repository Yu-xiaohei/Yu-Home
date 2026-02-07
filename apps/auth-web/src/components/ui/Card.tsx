import type { ReactNode } from 'react';

interface CardProps {
    children: ReactNode;
    className?: string;
}

export function Card({ children, className = '' }: CardProps) {
    return (
        <div className={`glass-card animate-fade-in ${className}`}>
            {children}
        </div>
    );
}
