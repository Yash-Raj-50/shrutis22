// ============================================
// ShrutiSelector Component - Choose Shruti for String
// ============================================

'use client';

import React, { useState, useRef, useCallback } from 'react';
import { Shruti, SwaraName } from '@/types';
import { SHRUTIS, getShrutisBySwara } from '@/constants/shrutis';

interface ShrutiSelectorProps {
    isOpen: boolean;
    currentShrutiId: number;
    currentOctave: number;
    onSelect: (shrutiId: number, octave: number) => void;
    onClose: () => void;
}

const SWARAS: SwaraName[] = ['Sa', 'Re', 'Ga', 'Ma', 'Pa', 'Dha', 'Ni'];

// Warm colors for selector
const SWARA_SELECTOR_COLORS: Record<SwaraName, string> = {
    Sa: '#e8a838',
    Re: '#b85c38',
    Ga: '#c9a227',
    Ma: '#d45a7a',
    Pa: '#7ab87e',
    Dha: '#c9964a',
    Ni: '#c490aa',
};

export function ShrutiSelector({
    isOpen,
    currentShrutiId,
    currentOctave,
    onSelect,
    onClose,
}: ShrutiSelectorProps) {
    const [selectedOctave, setSelectedOctave] = useState(currentOctave);
    const [displayedShruti, setDisplayedShruti] = useState<Shruti | null>(null);
    const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Handle hover with delay
    const handleMouseEnter = useCallback((shruti: Shruti) => {
        if (hideTimeoutRef.current) {
            clearTimeout(hideTimeoutRef.current);
            hideTimeoutRef.current = null;
        }
        if (hoverTimeoutRef.current) {
            clearTimeout(hoverTimeoutRef.current);
        }
        hoverTimeoutRef.current = setTimeout(() => {
            setDisplayedShruti(shruti);
        }, 150);
    }, []);

    const handleMouseLeave = useCallback(() => {
        if (hoverTimeoutRef.current) {
            clearTimeout(hoverTimeoutRef.current);
            hoverTimeoutRef.current = null;
        }
        hideTimeoutRef.current = setTimeout(() => {
            setDisplayedShruti(null);
        }, 300);
    }, []);

    if (!isOpen) return null;

    const handleSelect = (shruti: Shruti) => {
        onSelect(shruti.id, selectedOctave);
        onClose();
    };

    return (
        <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={onClose}
        >
            <div
                className="bg-[var(--bg-card)] rounded-2xl p-6 max-w-3xl w-full mx-4 max-h-[85vh] overflow-y-auto border border-[var(--border-color)] shadow-xl"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex justify-between items-center mb-5">
                    <div>
                        <h2 className="text-xl font-bold text-[var(--text-primary)]">Select Shruti</h2>
                        <p className="text-sm text-[var(--text-muted)] mt-1">Choose note for this string</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-lg bg-[var(--bg-tertiary)] text-[var(--text-muted)] hover:text-[var(--text-primary)] flex items-center justify-center transition-colors"
                    >
                        ✕
                    </button>
                </div>

                {/* Octave selector */}
                <div className="mb-5 p-4 bg-[var(--bg-primary)] rounded-xl">
                    <div className="flex items-center gap-4">
                        <span className="text-[var(--text-secondary)] text-sm">Octave:</span>
                        <div className="flex gap-2">
                            {[
                                { value: -1, label: 'मंद्र (Lower)' },
                                { value: 0, label: 'मध्य (Middle)' },
                                { value: 1, label: 'तार (Upper)' },
                            ].map(oct => (
                                <button
                                    key={oct.value}
                                    onClick={() => setSelectedOctave(oct.value)}
                                    className={`
                                        px-4 py-2 rounded-lg text-sm transition-all duration-150
                                        ${selectedOctave === oct.value
                                            ? 'bg-[var(--accent-saffron)] text-[var(--bg-primary)] font-medium'
                                            : 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:bg-[var(--border-color)]'
                                        }
                                    `}
                                >
                                    {oct.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Shruti info panel - fixed height */}
                <div className="mb-5 p-4 bg-[var(--bg-primary)] rounded-xl h-20 flex items-center">
                    {displayedShruti ? (
                        <div className="flex items-center gap-4">
                            <span
                                className="text-3xl font-bold w-12 text-center"
                                style={{ color: SWARA_SELECTOR_COLORS[displayedShruti.parentSwara] }}
                            >
                                {displayedShruti.shortName}
                            </span>
                            <div>
                                <div className="text-[var(--text-primary)] font-medium">{displayedShruti.name}</div>
                                <div className="text-[var(--text-muted)] text-sm">
                                    Ratio: <span className="font-mono">{displayedShruti.ratio[0]}:{displayedShruti.ratio[1]}</span>
                                    {' • '}
                                    <span className="font-mono">{displayedShruti.cents.toFixed(1)}</span> cents
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-[var(--text-muted)] text-sm">
                            Hover over a shruti to see details
                        </div>
                    )}
                </div>

                {/* Shruti grid by swara */}
                <div className="space-y-4">
                    {SWARAS.map(swara => {
                        const shrutis = getShrutisBySwara(swara);
                        const swaraColor = SWARA_SELECTOR_COLORS[swara];

                        return (
                            <div key={swara} className="flex items-start gap-3">
                                {/* Swara label */}
                                <div
                                    className="w-12 h-12 rounded-lg flex items-center justify-center font-bold text-base shrink-0"
                                    style={{
                                        backgroundColor: `${swaraColor}20`,
                                        color: swaraColor,
                                        border: `1px solid ${swaraColor}40`,
                                    }}
                                >
                                    {swara}
                                </div>

                                {/* Shrutis for this swara */}
                                <div className="flex flex-wrap gap-2">
                                    {shrutis.map(shruti => {
                                        const isSelected = currentShrutiId === shruti.id && currentOctave === selectedOctave;

                                        return (
                                            <button
                                                key={shruti.id}
                                                onClick={() => handleSelect(shruti)}
                                                onMouseEnter={() => handleMouseEnter(shruti)}
                                                onMouseLeave={handleMouseLeave}
                                                className={`
                                                    px-4 py-3 rounded-lg transition-all duration-150
                                                    flex flex-col items-center w-[80px]
                                                    bg-[var(--bg-card)] border
                                                    hover:bg-[var(--bg-tertiary)]
                                                    ${isSelected
                                                        ? 'border-[var(--accent-saffron)] ring-1 ring-[var(--accent-saffron)]'
                                                        : 'border-[var(--border-color)] hover:border-[var(--border-light)]'
                                                    }
                                                `}
                                                style={{
                                                    borderLeftWidth: '3px',
                                                    borderLeftColor: swaraColor,
                                                }}
                                            >
                                                <span
                                                    className="font-bold text-lg"
                                                    style={{ color: swaraColor }}
                                                >
                                                    {shruti.shortName}
                                                </span>
                                                <span className="text-xs text-[var(--text-muted)] font-mono">
                                                    {shruti.ratio[0]}:{shruti.ratio[1]}
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
