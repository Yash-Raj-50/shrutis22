'use client';

import React, { CSSProperties, useId } from 'react';

interface SteppedSliderProps {
    min: number;
    max: number;
    step: number;
    value: number;
    onChange: (value: number) => void;
    accentColor?: string;
    className?: string;
    ariaLabel?: string;
}

export function SteppedSlider({
    min,
    max,
    step,
    value,
    onChange,
    accentColor = 'var(--accent-saffron)',
    className = '',
    ariaLabel,
}: SteppedSliderProps) {
    const id = useId();
    const totalSteps = Math.floor((max - min) / step);
    const dotCount = totalSteps + 1;
    const progress = ((value - min) / (max - min)) * 100;

    return (
        <div className={`relative px-1 py-2 ${className}`}>
            <div
                className="pointer-events-none absolute inset-x-1 top-1/2 -translate-y-1/2"
                aria-hidden="true"
            >
                <div className="relative h-2 rounded-full bg-[var(--bg-tertiary)]">
                    <div
                        className="absolute left-0 top-0 h-full rounded-full"
                        style={{ width: `${progress}%`, backgroundColor: accentColor }}
                    />
                    <div className="absolute inset-x-2 top-1/2 flex -translate-y-1/2 justify-between">
                        {Array.from({ length: dotCount }).map((_, index) => {
                            const isActive = index <= Math.round((value - min) / step);
                            return (
                                <span
                                    key={`${id}-dot-${index}`}
                                    className="h-1.5 w-1.5 rounded-full border"
                                    style={{
                                        backgroundColor: isActive ? 'var(--bg-card)' : 'var(--border-color)',
                                        borderColor: isActive ? accentColor : 'var(--bg-card)',
                                    }}
                                />
                            );
                        })}
                    </div>
                </div>
            </div>

            <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={value}
                tabIndex={-1}
                aria-label={ariaLabel}
                onChange={(e) => onChange(Number(e.target.value))}
                onPointerUp={(e) => e.currentTarget.blur()}
                className="stepped-slider relative z-10 h-8 w-full cursor-pointer appearance-none bg-transparent outline-none"
                style={{ '--slider-accent': accentColor } as CSSProperties}
            />
        </div>
    );
}
