// ============================================
// ShrutiExplorer - Explore all 22 Shrutis
// ============================================

'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Shruti, SwaraName } from '@/types';
import { SHRUTIS, getShrutisBySwara } from '@/constants/shrutis';
import { ShrutiPlayer } from '@/audio/TanpuraEngine';

interface ShrutiExplorerProps {
    baseFrequency: number;
    volume: number;
    resonance: number;
    onVolumeChange: (volume: number) => void;
}

const SWARAS: SwaraName[] = ['Sa', 'Re', 'Ga', 'Ma', 'Pa', 'Dha', 'Ni'];

// Warmer colors for Indian aesthetic
const SWARA_WARM_COLORS: Record<SwaraName, { bg: string; text: string; border: string }> = {
    Sa: { bg: 'rgba(232, 168, 56, 0.15)', text: '#e8a838', border: 'rgba(232, 168, 56, 0.4)' },
    Re: { bg: 'rgba(184, 92, 56, 0.15)', text: '#b85c38', border: 'rgba(184, 92, 56, 0.4)' },
    Ga: { bg: 'rgba(201, 162, 39, 0.15)', text: '#c9a227', border: 'rgba(201, 162, 39, 0.4)' },
    Ma: { bg: 'rgba(139, 41, 66, 0.15)', text: '#d45a7a', border: 'rgba(139, 41, 66, 0.4)' },
    Pa: { bg: 'rgba(86, 130, 89, 0.15)', text: '#7ab87e', border: 'rgba(86, 130, 89, 0.4)' },
    Dha: { bg: 'rgba(139, 90, 43, 0.15)', text: '#c9964a', border: 'rgba(139, 90, 43, 0.4)' },
    Ni: { bg: 'rgba(130, 80, 110, 0.15)', text: '#c490aa', border: 'rgba(130, 80, 110, 0.4)' },
};

export function ShrutiExplorer({ baseFrequency, volume, resonance, onVolumeChange }: ShrutiExplorerProps) {
    const playerRef = useRef<ShrutiPlayer | null>(null);
    const [isInitialized, setIsInitialized] = useState(false);
    const [activeShruti, setActiveShruti] = useState<number | null>(null);
    const [selectedOctave, setSelectedOctave] = useState(0);
    const [hoveredShruti, setHoveredShruti] = useState<Shruti | null>(null);
    const [displayedShruti, setDisplayedShruti] = useState<Shruti | null>(null);
    const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Initialize player
    useEffect(() => {
        playerRef.current = new ShrutiPlayer();
        return () => {
            playerRef.current?.dispose();
            if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
            if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
        };
    }, []);

    // Update base frequency
    useEffect(() => {
        playerRef.current?.setBaseFrequency(baseFrequency);
    }, [baseFrequency]);

    // Update volume
    useEffect(() => {
        playerRef.current?.setVolume(volume);
    }, [volume]);

    // Update resonance
    useEffect(() => {
        playerRef.current?.setResonance(resonance);
    }, [resonance]);

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
        }, 150); // 150ms delay before showing
    }, []);

    const handleMouseLeave = useCallback(() => {
        if (hoverTimeoutRef.current) {
            clearTimeout(hoverTimeoutRef.current);
            hoverTimeoutRef.current = null;
        }
        hideTimeoutRef.current = setTimeout(() => {
            setDisplayedShruti(null);
        }, 300); // 300ms delay before hiding
    }, []);

    const handleShrutiClick = useCallback(async (shruti: Shruti) => {
        if (!playerRef.current) return;

        if (!isInitialized) {
            await playerRef.current.initialize();
            setIsInitialized(true);
        }

        setActiveShruti(shruti.id);
        setDisplayedShruti(shruti);
        playerRef.current.playNote(shruti.ratio, selectedOctave);

        // Reset active state after note plays
        setTimeout(() => setActiveShruti(null), 1500);
    }, [isInitialized, selectedOctave]);

    // Keyboard shortcuts for playing shrutis
    // Keys: q w e r t y u i o p [ ] for first 12, a s d f g h j k l ; ' for next 11
    useEffect(() => {
        const keyMap: Record<string, number> = {
            // Top row - first 12 shrutis (S to M2)
            'q': 1,  // Sa
            'w': 2,  // r1
            'e': 3,  // r2
            'r': 4,  // R1
            't': 5,  // R2
            'y': 6,  // g1
            'u': 7,  // g2
            'i': 8,  // G1
            'o': 9,  // G2
            'p': 10, // m1
            '[': 11, // m2
            ']': 12, // M1
            // Home row - next 11 shrutis (M2 to N2 + upper Sa)
            'a': 13, // M2
            's': 14, // Pa
            'd': 15, // d1
            'f': 16, // d2
            'g': 17, // D1
            'h': 18, // D2
            'j': 19, // n1
            'k': 20, // n2
            'l': 21, // N1
            ';': 22, // N2
            "'": 23, // Upper Sa (special case)
        };

        const handleKeyDown = (e: KeyboardEvent) => {
            // Ignore if typing in an input
            if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
                return;
            }

            const key = e.key.toLowerCase();
            const shrutiId = keyMap[key];

            if (shrutiId) {
                e.preventDefault();
                // Handle upper Sa specially
                if (shrutiId === 23) {
                    const upperSa = { ...SHRUTIS[0], id: 23, name: 'Upper Shadja', shortName: "S'" };
                    handleShrutiClick(upperSa);
                } else {
                    const shruti = SHRUTIS.find(s => s.id === shrutiId);
                    if (shruti) {
                        handleShrutiClick(shruti);
                    }
                }
            }

            // Octave switching with number keys
            if (e.key === '1') {
                setSelectedOctave(-1); // Lower
            } else if (e.key === '2') {
                setSelectedOctave(0);  // Middle
            } else if (e.key === '3') {
                setSelectedOctave(1);  // Upper
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleShrutiClick]);

    return (
        <div className="h-full flex flex-col">
            {/* Header */}
            <div className="p-6 border-b border-[var(--border-color)]">
                <h2 className="text-xl font-semibold text-[var(--text-primary)]">
                    Explore the 22 Shrutis
                </h2>
                <p className="text-sm text-[var(--text-muted)] mt-1">
                    Click or use keyboard to play shrutis
                </p>
            </div>

            {/* Octave selector and Volume */}
            <div className="px-6 py-4 border-b border-[var(--border-color)] flex flex-wrap items-center gap-6">
                {/* Octave */}
                <div className="flex items-center gap-3">
                    <span className="text-[var(--text-secondary)] text-sm">Octave:</span>
                    <div className="flex gap-2">
                        {[
                            { value: -1, label: 'मंद्र', key: '1' },
                            { value: 0, label: 'मध्य', key: '2' },
                            { value: 1, label: 'तार', key: '3' },
                        ].map(oct => (
                            <button
                                key={oct.value}
                                onClick={() => setSelectedOctave(oct.value)}
                                className={`
                                    px-3 py-1.5 rounded-lg text-sm transition-all duration-200
                                    ${selectedOctave === oct.value
                                        ? 'bg-[var(--accent-saffron)] text-[var(--bg-primary)] font-medium'
                                        : 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:bg-[var(--border-color)]'
                                    }
                                `}
                                title={`Press ${oct.key} to select`}
                            >
                                {oct.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Volume slider */}
                <div className="flex items-center gap-3">
                    <span className="text-[var(--text-secondary)] text-sm">Volume:</span>
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={volume * 100}
                        onChange={e => onVolumeChange(Number(e.target.value) / 100)}
                        className="w-24 h-2 bg-[var(--bg-tertiary)] rounded-lg appearance-none cursor-pointer
                            [&::-webkit-slider-thumb]:appearance-none
                            [&::-webkit-slider-thumb]:w-4
                            [&::-webkit-slider-thumb]:h-4
                            [&::-webkit-slider-thumb]:rounded-full
                            [&::-webkit-slider-thumb]:bg-[var(--accent-saffron)]
                            [&::-webkit-slider-thumb]:cursor-pointer"
                    />
                    <span className="text-[var(--accent-saffron)] font-mono text-sm w-10">
                        {Math.round(volume * 100)}%
                    </span>
                </div>
            </div>

            {/* Shruti info panel - fixed height */}
            <div className="px-6 py-4 border-b border-[var(--border-color)] h-[88px] flex items-center">
                {displayedShruti ? (
                    <div className="flex items-center gap-4">
                        <div
                            className="w-14 h-14 rounded-lg flex items-center justify-center text-2xl font-bold"
                            style={{
                                backgroundColor: SWARA_WARM_COLORS[displayedShruti.parentSwara].bg,
                                color: SWARA_WARM_COLORS[displayedShruti.parentSwara].text,
                                border: `1px solid ${SWARA_WARM_COLORS[displayedShruti.parentSwara].border}`,
                            }}
                        >
                            {displayedShruti.shortName}
                        </div>
                        <div>
                            <div className="text-[var(--text-primary)] font-medium">
                                {displayedShruti.name}
                            </div>
                            <div className="text-[var(--text-muted)] text-sm mt-1">
                                Ratio: <span className="font-mono">{displayedShruti.ratio[0]}:{displayedShruti.ratio[1]}</span>
                                {' • '}
                                <span className="font-mono">{displayedShruti.cents.toFixed(1)}</span> cents
                                {' • '}
                                Western ≈ {displayedShruti.westernApprox}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="text-[var(--text-muted)] text-sm">
                        Hover over a shruti to see details, click to play
                    </div>
                )}
            </div>

            {/* Main shruti display - wrapped, centered */}
            <div className="flex-1 overflow-y-auto p-6">
                {/* All 22 shrutis + upper Sa, wrapped and centered */}
                <div className="flex flex-wrap gap-2 justify-center pb-4">
                    {/* Generate all shrutis in chromatic order with upper Sa at end */}
                    {[...SHRUTIS, { ...SHRUTIS[0], id: 23, name: 'Upper Shadja', shortName: "S'" }].map((shruti, index) => {
                        const colors = SWARA_WARM_COLORS[shruti.parentSwara];
                        const isUpperSa = index === SHRUTIS.length;

                        return (
                            <button
                                key={shruti.id}
                                onClick={() => handleShrutiClick(shruti)}
                                onMouseEnter={() => handleMouseEnter(shruti)}
                                onMouseLeave={handleMouseLeave}
                                className={`
                                    shruti-button px-3 py-4 rounded-xl
                                    flex flex-col items-center justify-center
                                    w-[60px] h-[85px]
                                    ${activeShruti === shruti.id ? 'active' : ''}
                                    ${shruti.isCommon || isUpperSa ? '' : 'opacity-70'}
                                    transition-all duration-150
                                `}
                                style={{
                                    borderTopWidth: '4px',
                                    borderTopColor: colors.text,
                                }}
                            >
                                <span
                                    className="text-base font-bold"
                                    style={{ color: colors.text }}
                                >
                                    {shruti.shortName}
                                </span>
                                <span className="text-[9px] text-[var(--text-muted)] mt-1 font-mono">
                                    {isUpperSa ? '2:1' : `${shruti.ratio[0]}:${shruti.ratio[1]}`}
                                </span>
                                <span
                                    className="text-[8px] mt-0.5 opacity-70"
                                    style={{ color: colors.text }}
                                >
                                    {shruti.parentSwara}{isUpperSa ? "'" : ''}
                                </span>
                            </button>
                        );
                    })}
                </div>

                {/* Legend for swaras */}
                <div className="mt-4 pt-4 border-t border-[var(--border-color)]">
                    <div className="flex flex-wrap gap-3 justify-center">
                        {SWARAS.map(swara => {
                            const colors = SWARA_WARM_COLORS[swara];
                            const count = getShrutisBySwara(swara).length;
                            return (
                                <div
                                    key={swara}
                                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg"
                                    style={{
                                        backgroundColor: colors.bg,
                                        border: `1px solid ${colors.border}`,
                                    }}
                                >
                                    <span className="font-bold text-sm" style={{ color: colors.text }}>
                                        {swara}
                                    </span>
                                    <span className="text-xs opacity-70" style={{ color: colors.text }}>
                                        ({count})
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Keyboard shortcuts hint */}
                <div className="mt-4 pt-4 border-t border-[var(--border-color)]">
                    <p className="text-xs text-[var(--text-muted)] text-center mb-2">Keyboard Shortcuts</p>
                    <div className="flex flex-col gap-1 text-xs text-[var(--text-muted)] font-mono">
                        <div className="flex items-center justify-center gap-2">
                            <span className="text-[var(--text-secondary)]">S→M1:</span>
                            <span className="bg-[var(--bg-tertiary)] px-1.5 py-0.5 rounded">q w e r t y u i o p [ ]</span>
                        </div>
                        <div className="flex items-center justify-center gap-2">
                            <span className="text-[var(--text-secondary)]">M2→S&apos;:</span>
                            <span className="bg-[var(--bg-tertiary)] px-1.5 py-0.5 rounded">a s d f g h j k l ; &apos;</span>
                        </div>
                        <div className="flex items-center justify-center gap-2 mt-1">
                            <span className="text-[var(--text-secondary)]">Octave:</span>
                            <span className="bg-[var(--bg-tertiary)] px-1.5 py-0.5 rounded">1</span> मंद्र
                            <span className="bg-[var(--bg-tertiary)] px-1.5 py-0.5 rounded">2</span> मध्य
                            <span className="bg-[var(--bg-tertiary)] px-1.5 py-0.5 rounded">3</span> तार
                        </div>
                    </div>
                </div>
            </div>

            {/* Hint at bottom */}
            {!isInitialized && (
                <div className="px-6 py-4 bg-[var(--bg-secondary)] border-t border-[var(--border-color)]">
                    <p className="text-sm text-[var(--text-muted)] text-center">
                        🎵 Click any shruti or press a key to initialize audio
                    </p>
                </div>
            )}
        </div>
    );
}
