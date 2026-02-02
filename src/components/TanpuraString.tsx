// ============================================
// TanpuraString Component - Individual String Display
// ============================================

'use client';

import React from 'react';
import { TanpuraString as TanpuraStringType } from '@/types';
import { getShrutiById } from '@/constants/shrutis';

interface TanpuraStringProps {
    string: TanpuraStringType;
    index: number;
    isSelected: boolean;
    isPlaying: boolean;
    isPlucking?: boolean;
    onSelect: (index: number) => void;
    onToggleActive: (index: number) => void;
    onEdit?: (index: number) => void;
}

// Warm colors matching Indian aesthetic
const SWARA_WARM_COLORS: Record<string, string> = {
    Sa: '#e8a838',
    Re: '#b85c38',
    Ga: '#c9a227',
    Ma: '#d45a7a',
    Pa: '#7ab87e',
    Dha: '#c9964a',
    Ni: '#c490aa',
};

export function TanpuraStringComponent({
    string,
    index,
    isSelected,
    isPlaying,
    isPlucking = false,
    onSelect,
    onToggleActive,
    onEdit,
}: TanpuraStringProps) {
    const shruti = getShrutiById(string.shrutiId);

    if (!shruti) return null;

    const swaraColor = SWARA_WARM_COLORS[shruti.parentSwara] || '#e8a838';
    const octaveLabel = string.octave === -1 ? 'मंद्र' : string.octave === 1 ? 'तार' : 'मध्य';

    return (
        <div
            className={`
                relative flex flex-col items-center p-4 rounded-xl cursor-pointer
                transition-all duration-200 ease-in-out
                border
                ${isSelected
                    ? 'border-[var(--accent-saffron)] bg-[var(--bg-tertiary)]'
                    : 'border-[var(--border-color)] bg-[var(--bg-card)] hover:bg-[var(--bg-tertiary)] hover:border-[var(--border-light)]'
                }
                ${!string.isActive ? 'opacity-50' : ''}
            `}
            onClick={(e) => {
                if (e.shiftKey && onEdit) {
                    onEdit(index);
                } else {
                    onSelect(index);
                }
            }}
        >
            {/* String number */}
            <div className="absolute top-2 left-2 text-xs text-[var(--text-muted)] font-mono">
                {index + 1}
            </div>

            {/* Mute button */}
            <button
                className={`
                    absolute top-2 right-2 w-6 h-6 rounded-full text-xs
                    transition-all duration-150 flex items-center justify-center
                    ${string.isActive
                        ? 'bg-[var(--accent-saffron)]/20 text-[var(--accent-saffron)] border border-[var(--accent-saffron)]/40'
                        : 'bg-[var(--bg-tertiary)] text-[var(--text-muted)] border border-[var(--border-color)]'
                    }
                `}
                onClick={(e) => {
                    e.stopPropagation();
                    onToggleActive(index);
                }}
                title={string.isActive ? 'Mute string' : 'Unmute string'}
            >
                {string.isActive ? '♪' : '−'}
            </button>

            {/* String visualization - vertical line like tanpura string */}
            <div className="relative h-28 flex items-center justify-center mb-3">
                {/* String shadow/glow when active */}
                {isPlaying && string.isActive && (
                    <div
                        className="absolute w-6 h-full rounded-full opacity-20 animate-breathe"
                        style={{ backgroundColor: swaraColor }}
                    />
                )}

                {/* Pluck flash effect - big visible burst */}
                {isPlucking && string.isActive && (
                    <div
                        className="absolute w-16 h-16 rounded-full animate-pluck-flash"
                        style={{
                            backgroundColor: swaraColor,
                            boxShadow: `0 0 30px ${swaraColor}, 0 0 60px ${swaraColor}`,
                        }}
                    />
                )}

                {/* The actual string */}
                <div
                    className={`
                        h-full rounded-full transition-all
                        ${isPlucking ? 'string-plucked w-1.5' : 'w-0.5'}
                    `}
                    style={{
                        backgroundColor: string.isActive ? swaraColor : 'var(--text-muted)',
                        boxShadow: isPlucking && string.isActive
                            ? `0 0 20px ${swaraColor}, 0 0 40px ${swaraColor}, 0 0 60px ${swaraColor}50`
                            : isPlaying && string.isActive
                                ? `0 0 15px ${swaraColor}, 0 0 30px ${swaraColor}40`
                                : 'none',
                    }}
                />
            </div>

            {/* Shruti info */}
            <div
                className="text-2xl font-bold mb-0.5"
                style={{ color: string.isActive ? swaraColor : 'var(--text-muted)' }}
            >
                {shruti.shortName}
            </div>

            {/* Octave indicator */}
            <div className="text-[10px] text-[var(--text-muted)] mb-2">
                {octaveLabel}
            </div>

            {/* Volume indicator */}
            <div className="w-full h-1 bg-[var(--bg-primary)] rounded-full overflow-hidden">
                <div
                    className="h-full rounded-full transition-all duration-200"
                    style={{
                        width: `${string.volume * 100}%`,
                        backgroundColor: string.isActive ? swaraColor : 'var(--text-muted)',
                    }}
                />
            </div>
        </div>
    );
}
