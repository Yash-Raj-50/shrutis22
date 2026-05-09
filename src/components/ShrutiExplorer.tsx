// ============================================
// ShrutiExplorer - Explore all 22 Shrutis
// ============================================

'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Shruti, SwaraName } from '@/types';
import { SHRUTIS } from '@/constants/shrutis';
import { ShrutiPlayer } from '@/audio/TanpuraEngine';
import { SectionHeader } from './SectionHeader';

interface ShrutiExplorerProps {
    baseFrequency: number;
    volume: number;
    resonance: number;
    onVolumeChange: (volume: number) => void;
    onResonanceChange?: (resonance: number) => void;
}

const UPPER_SA_ID = 23;
const RECENT_NOTES_LIMIT = 7;
const NOTE_HISTORY_COLUMNS = 13;
const NOTE_HISTORY_CENTER_COLUMN = Math.floor(NOTE_HISTORY_COLUMNS / 2);
type HistoryCell = { shruti: Shruti; historyIndex: number } | null;
type KeyBinding = { shrutiId: number; octaveOffset: number };
const SHRUTI_KEYBOARD_SHORTCUTS: Record<number, string[]> = {
    1: ['3', 'E', 'D', 'C'],
    2: ['4'],
    3: ['R'],
    4: ['F'],
    5: ['V'],
    6: ['5'],
    7: ['T'],
    8: ['G'],
    9: ['B'],
    10: ['6'],
    11: ['Y'],
    12: ['H'],
    13: ['N'],
    14: ['7', 'U', 'J', 'M'],
    15: ['8'],
    16: ['I'],
    17: ['K'],
    18: [','],
    19: ['9'],
    20: ['O'],
    21: ['L'],
    22: ['.'],
    23: ['0', 'P', ';', '/'],
};
const KEYBOARD_COLUMN_LABELS = ['3', '4', '5', '6', '7', '8', '9', '0'];
const KEYBOARD_ROW_LABELS = ['3', 'E', 'D', 'C'];
const KEYBOARD_PLAY_BINDINGS: Record<string, KeyBinding> = {
    '1': { shrutiId: 15, octaveOffset: -1 },
    '2': { shrutiId: 19, octaveOffset: -1 },
    '3': { shrutiId: 1, octaveOffset: 0 },
    '4': { shrutiId: 2, octaveOffset: 0 },
    '5': { shrutiId: 6, octaveOffset: 0 },
    '6': { shrutiId: 10, octaveOffset: 0 },
    '7': { shrutiId: 14, octaveOffset: 0 },
    '8': { shrutiId: 15, octaveOffset: 0 },
    '9': { shrutiId: 19, octaveOffset: 0 },
    '0': { shrutiId: UPPER_SA_ID, octaveOffset: 0 },
    '-': { shrutiId: 2, octaveOffset: 1 },
    '=': { shrutiId: 6, octaveOffset: 1 },
    q: { shrutiId: 16, octaveOffset: -1 },
    w: { shrutiId: 20, octaveOffset: -1 },
    e: { shrutiId: 1, octaveOffset: 0 },
    r: { shrutiId: 3, octaveOffset: 0 },
    t: { shrutiId: 7, octaveOffset: 0 },
    y: { shrutiId: 11, octaveOffset: 0 },
    u: { shrutiId: 14, octaveOffset: 0 },
    i: { shrutiId: 16, octaveOffset: 0 },
    o: { shrutiId: 20, octaveOffset: 0 },
    p: { shrutiId: UPPER_SA_ID, octaveOffset: 0 },
    '[': { shrutiId: 3, octaveOffset: 1 },
    ']': { shrutiId: 7, octaveOffset: 1 },
    a: { shrutiId: 17, octaveOffset: -1 },
    s: { shrutiId: 21, octaveOffset: -1 },
    d: { shrutiId: 1, octaveOffset: 0 },
    f: { shrutiId: 4, octaveOffset: 0 },
    g: { shrutiId: 8, octaveOffset: 0 },
    h: { shrutiId: 12, octaveOffset: 0 },
    j: { shrutiId: 14, octaveOffset: 0 },
    k: { shrutiId: 17, octaveOffset: 0 },
    l: { shrutiId: 21, octaveOffset: 0 },
    ';': { shrutiId: UPPER_SA_ID, octaveOffset: 0 },
    "'": { shrutiId: 4, octaveOffset: 1 },
    '\\': { shrutiId: 8, octaveOffset: 1 },
    z: { shrutiId: 18, octaveOffset: -1 },
    x: { shrutiId: 22, octaveOffset: -1 },
    c: { shrutiId: 1, octaveOffset: 0 },
    v: { shrutiId: 5, octaveOffset: 0 },
    b: { shrutiId: 9, octaveOffset: 0 },
    n: { shrutiId: 13, octaveOffset: 0 },
    m: { shrutiId: 14, octaveOffset: 0 },
    ',': { shrutiId: 18, octaveOffset: 0 },
    '.': { shrutiId: 22, octaveOffset: 0 },
    '/': { shrutiId: UPPER_SA_ID, octaveOffset: 0 },
};
const UPPER_SA: Shruti = {
    ...SHRUTIS[0],
    id: UPPER_SA_ID,
    name: 'Upper Shadja',
    shortName: "S'",
};
const SHRUTI_COLUMNS: Array<{ key: string; shrutis: Shruti[] }> = [
    { key: 'sa', shrutis: [SHRUTIS[0]] },
    { key: 're', shrutis: SHRUTIS.filter((shruti) => shruti.parentSwara === 'Re') },
    { key: 'ga', shrutis: SHRUTIS.filter((shruti) => shruti.parentSwara === 'Ga') },
    { key: 'ma', shrutis: SHRUTIS.filter((shruti) => shruti.parentSwara === 'Ma') },
    { key: 'pa', shrutis: SHRUTIS.filter((shruti) => shruti.parentSwara === 'Pa') },
    { key: 'dha', shrutis: SHRUTIS.filter((shruti) => shruti.parentSwara === 'Dha') },
    { key: 'ni', shrutis: SHRUTIS.filter((shruti) => shruti.parentSwara === 'Ni') },
    { key: 'upper-sa', shrutis: [UPPER_SA] },
];

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

export function ShrutiExplorer({ baseFrequency, volume, resonance, onVolumeChange, onResonanceChange }: ShrutiExplorerProps) {
    const playerRef = useRef<ShrutiPlayer | null>(null);
    const [isInitialized, setIsInitialized] = useState(false);
    const [activeShruti, setActiveShruti] = useState<number | null>(null);
    const [selectedOctave, setSelectedOctave] = useState(0);
    const [displayedShruti, setDisplayedShruti] = useState<Shruti | null>(null);
    const [recentShrutis, setRecentShrutis] = useState<Shruti[]>([]);
    const [queueMotionKey, setQueueMotionKey] = useState(0);
    const [isNotePlaying, setIsNotePlaying] = useState(false);
    const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const recentQueue = recentShrutis.slice(-RECENT_NOTES_LIMIT);
    const historyQueue = Array.from({ length: NOTE_HISTORY_COLUMNS }, () => null as HistoryCell);
    const queueStartColumn = NOTE_HISTORY_CENTER_COLUMN - recentQueue.length + 1;

    recentQueue.forEach((shruti, noteIndex) => {
        historyQueue[queueStartColumn + noteIndex] = {
            shruti,
            historyIndex: noteIndex,
        };
    });

    // Initialize player
    useEffect(() => {
        playerRef.current = new ShrutiPlayer();
        return () => {
            playerRef.current?.dispose();
            if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
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
    }, []);

    const handleShrutiClick = useCallback(async (shruti: Shruti, octaveOffset = 0) => {
        if (!playerRef.current) return;

        if (!isInitialized) {
            await playerRef.current.initialize();
            setIsInitialized(true);
        }

        setActiveShruti(shruti.id);
        setDisplayedShruti(shruti);
        setRecentShrutis((prev) => [...prev, shruti].slice(-RECENT_NOTES_LIMIT));
        setQueueMotionKey((prev) => prev + 1);
        setIsNotePlaying(true);
        const octaveToPlay = shruti.id === UPPER_SA_ID
            ? selectedOctave + octaveOffset + 1
            : selectedOctave + octaveOffset;
        playerRef.current.playNote(shruti.ratio, octaveToPlay);
    }, [isInitialized, selectedOctave]);

    const handleStopNote = useCallback(() => {
        if (!playerRef.current) return;
        playerRef.current.stopNote();
        setIsNotePlaying(false);
    }, []);

    // Keyboard shortcuts for playing shrutis
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Ignore if typing in an input
            if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
                return;
            }

            // Handle spacebar to stop current note
            if (e.code === 'Space') {
                e.preventDefault();
                handleStopNote();
                return;
            }

            const key = e.key.toLowerCase();
            const binding = KEYBOARD_PLAY_BINDINGS[key];

            if (binding) {
                e.preventDefault();
                if (binding.shrutiId === UPPER_SA_ID) {
                    const upperSa = { ...SHRUTIS[0], id: UPPER_SA_ID, name: 'Upper Shadja', shortName: "S'" };
                    handleShrutiClick(upperSa, binding.octaveOffset);
                } else {
                    const shruti = SHRUTIS.find(s => s.id === binding.shrutiId);
                    if (shruti) {
                        handleShrutiClick(shruti, binding.octaveOffset);
                    }
                }
            }

            if (e.shiftKey && e.key === '!') {
                setSelectedOctave(-1); // Lower
            } else if (e.shiftKey && e.key === '@') {
                setSelectedOctave(0);  // Middle
            } else if (e.shiftKey && e.key === '#') {
                setSelectedOctave(1);  // Upper
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleShrutiClick, handleStopNote]);

    return (
        <div className="h-full flex flex-col">
            {/* Header */}
            <SectionHeader
                title="Explore the 22 Shrutis"
                hindiTitle="श्रुतियों को देखें"
                description="Play, compare, and recognize each shruti across the octave."
            />

            {/* Octave selector and Volume */}
            <div className="px-6 py-4 border-b border-[var(--border-color)] flex flex-wrap items-center gap-6">
                {/* Octave */}
                <div className="flex items-center gap-3">
                    <span className="text-[var(--text-secondary)] text-sm">Octave:</span>
                    <div className="flex gap-2">
                        {[
                            { value: -1, label: 'Mandra', hindiLabel: 'मंद्र', key: '⇧1' },
                            { value: 0, label: 'Madhya', hindiLabel: 'मध्य', key: '⇧2' },
                            { value: 1, label: 'Taar', hindiLabel: 'तार', key: '⇧3' },
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
                                {oct.label} ({oct.hindiLabel}) <span className="inline-block px-2 py-1 rounded-md bg-[var(--bg-secondary)] text-[var(--text-muted)] text-xs font-mono border border-[var(--border-color)] opacity-60">{oct.key}</span>
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

                {/* Sustain slider */}
                <div className="flex items-center gap-3">
                    <span className="text-[var(--text-secondary)] text-sm">Sustain:</span>
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={resonance * 100}
                        onChange={e => onResonanceChange?.(Number(e.target.value) / 100)}
                        className="w-24 h-2 bg-[var(--bg-tertiary)] rounded-lg appearance-none cursor-pointer
                            [&::-webkit-slider-thumb]:appearance-none
                            [&::-webkit-slider-thumb]:w-4
                            [&::-webkit-slider-thumb]:h-4
                            [&::-webkit-slider-thumb]:rounded-full
                            [&::-webkit-slider-thumb]:bg-[var(--accent-saffron)]
                            [&::-webkit-slider-thumb]:cursor-pointer"
                    />
                    <span className="text-[var(--accent-saffron)] font-mono text-sm w-10">
                        {Math.round(resonance * 100)}%
                    </span>
                </div>
            </div>

            {/* Main shruti display */}
            <div className="flex-1 overflow-y-auto p-6 pl-2">
                <div className="overflow-x-auto">
                    <div className="mx-auto min-w-[760px] max-w-[1100px]">
                        <div className="mb-1.5 grid grid-cols-[1.5rem_repeat(8,minmax(0,1fr))] gap-3">
                            <div />
                            {KEYBOARD_COLUMN_LABELS.map((keyLabel) => (
                                <div
                                    key={keyLabel}
                                    className="text-center text-xs font-mono font-semibold uppercase tracking-[0.14em] text-[var(--text-muted)]"
                                >
                                    {keyLabel}
                                </div>
                            ))}
                        </div>

                        <div className="grid grid-cols-[1.5rem_1fr] gap-2">
                            <div className="grid grid-rows-4 gap-1 pt-1">
                                {KEYBOARD_ROW_LABELS.map((keyLabel) => (
                                    <div
                                        key={keyLabel}
                                        className="flex items-center justify-center text-xs font-mono font-semibold uppercase tracking-[0.14em] text-[var(--text-muted)]"
                                    >
                                        {keyLabel}
                                    </div>
                                ))}
                            </div>

                            <div className="grid grid-cols-2 gap-4 md:grid-cols-4 xl:grid-cols-8">
                                {SHRUTI_COLUMNS.map((column) => {
                                    return (
                                        <div
                                            key={column.key}
                                            className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] p-2"
                                        >
                                            <div className="space-y-2">
                                                {column.shrutis.map((shruti) => {
                                                    const shrutiColors = SWARA_WARM_COLORS[shruti.parentSwara];
                                                    const isUpperSa = shruti.id === UPPER_SA_ID;

                                                    return (
                                                        <button
                                                            key={shruti.id}
                                                            onClick={() => handleShrutiClick(shruti)}
                                                            onMouseEnter={() => handleMouseEnter(shruti)}
                                                            onMouseLeave={handleMouseLeave}
                                                            className={`
                                                                shruti-button w-full h-28 rounded-xl px-2 py-2 text-left transition-all duration-150 flex flex-col
                                                                ${activeShruti === shruti.id ? 'active' : ''}
                                                                ${shruti.isCommon || isUpperSa ? '' : 'opacity-75'}
                                                            `}
                                                            style={{
                                                                borderTopWidth: '4px',
                                                                borderTopColor: shrutiColors.text,
                                                            }}
                                                        >
                                                            <div className="flex items-start justify-between gap-2">
                                                                <span
                                                                    className="text-lg font-bold"
                                                                    style={{ color: shrutiColors.text }}
                                                                >
                                                                    {shruti.shortName}
                                                                </span>
                                                            </div>
                                                            <div className="mt-1 text-xs text-[var(--text-secondary)]">
                                                                {shruti.name}
                                                            </div>
                                                            {SHRUTI_KEYBOARD_SHORTCUTS[shruti.id] && (
                                                                <div className="mt-auto text-[0.65rem] text-[var(--text-muted)] font-mono leading-tight">
                                                                    {SHRUTI_KEYBOARD_SHORTCUTS[shruti.id].join(' / ')}
                                                                </div>
                                                            )}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Note history queue - same width as columns */}
                        <div className="mt-6 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] px-4 py-3">
                            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-around">
                                <div className="min-w-0 text-xs text-[var(--text-muted)] md:text-sm">
                                    {displayedShruti ? (
                                        <span className="block truncate">
                                            <span className="font-semibold text-[var(--text-primary)]">{displayedShruti.name}</span>
                                            {' • '}
                                            <span className="font-mono">{displayedShruti.ratio[0]}:{displayedShruti.ratio[1]}</span>
                                            {' • '}
                                            {displayedShruti.cents.toFixed(1)} cents
                                            {' • '}
                                            {displayedShruti.westernApprox}
                                            {' • '}
                                            Keys {SHRUTI_KEYBOARD_SHORTCUTS[displayedShruti.id].join(' / ')}
                                        </span>
                                    ) : (
                                        <span className="block truncate">Click a shruti or use the keyboard to start exploring</span>
                                    )}
                                </div>

                                <div className="overflow-hidden lg:flex lg:justify-end">
                                    <div key={queueMotionKey} className="animate-note-feed-shift flex justify-end">
                                        <div
                                            className="grid w-full max-w-3xl gap-x-2"
                                            style={{ gridTemplateColumns: `repeat(${NOTE_HISTORY_COLUMNS}, 1.75rem)` }}
                                        >
                                            {historyQueue.map((cell, cellIndex) => {
                                                const isLatest = cell !== null && cellIndex === NOTE_HISTORY_CENTER_COLUMN;
                                                const noteAge = cell ? recentQueue.length - 1 - cell.historyIndex : null;

                                                return (
                                                    <div
                                                        key={cell ? `${cell.shruti.id}-${cell.historyIndex}-${cellIndex}-${queueMotionKey}` : `empty-${cellIndex}-${queueMotionKey}`}
                                                        className="flex h-6 w-7 items-center justify-center text-xs font-semibold md:text-sm"
                                                        style={cell
                                                            ? isLatest
                                                                ? {
                                                                    color: 'var(--accent-saffron)',
                                                                }
                                                                : {
                                                                    color: 'var(--text-secondary)',
                                                                    opacity: noteAge !== null ? Math.max(0.42, 0.86 - noteAge * 0.1) : 0.6,
                                                                }
                                                            : {
                                                                color: 'var(--border-color)',
                                                                opacity: 0.55,
                                                            }}
                                                    >
                                                        {cell?.shruti.shortName ?? '.'}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            {/* Hint at bottom */}
            <div className="px-6 py-2 text-center text-xs text-[var(--text-muted)]">
                Press <span className="font-mono font-semibold">SPACE</span> to stop the current note
            </div>
        </div>
    );
}
