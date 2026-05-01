// ============================================
// TanpuraSection - Tanpura Drone Interface
// ============================================

'use client';

import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { useTanpura } from '@/hooks/useTanpura';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import {
    TanpuraStringComponent,
    ShrutiSelector,
    Controls,
    PlayButton,
} from '@/components';
import { getShrutiById } from '@/constants/shrutis';
import { SectionHeader } from './SectionHeader';

interface GlobalAudioSettings {
    baseFrequency: number;
    masterVolume: number;
    resonance: number;
}

interface TanpuraSectionProps {
    globalSettings: GlobalAudioSettings;
    onSettingsChange: (updates: Partial<GlobalAudioSettings>) => void;
}

export function TanpuraSection({ globalSettings, onSettingsChange }: TanpuraSectionProps) {
    const tanpura = useTanpura({
        baseFrequency: globalSettings.baseFrequency,
        masterVolume: globalSettings.masterVolume,
        resonance: globalSettings.resonance,
    });
    const [selectedStringIndex, setSelectedStringIndex] = useState<number | null>(null);
    const [isSelectorOpen, setIsSelectorOpen] = useState(false);
    const [previousVolume, setPreviousVolume] = useState(0.7);
    const [pluckingString, setPluckingString] = useState<number | null>(null);
    const [isManualMode, setIsManualMode] = useState(true);

    // Sync global settings when tanpura config changes
    useEffect(() => {
        onSettingsChange({
            baseFrequency: tanpura.config.baseFrequency,
            masterVolume: tanpura.config.masterVolume,
            resonance: tanpura.config.resonance,
        });
    }, [tanpura.config.baseFrequency, tanpura.config.masterVolume, tanpura.config.resonance]);

    // Setup pluck callback for visual feedback
    useEffect(() => {
        // Only auto-animate in auto mode
        if (tanpura.isPlaying && !isManualMode) {
            const intervalMs = (60000 / tanpura.config.tempo);
            let index = 0;
            const interval = setInterval(() => {
                setPluckingString(index);
                // Flash stays visible for at least 600ms
                setTimeout(() => setPluckingString(null), Math.max(600, intervalMs * 0.8));
                index = (index + 1) % 4;
            }, intervalMs);
            return () => clearInterval(interval);
        }
    }, [tanpura.isPlaying, tanpura.config.tempo, isManualMode]);

    // Handle manual string pluck
    const handleManualPluck = useCallback((index: number) => {
        if (!isManualMode) return;
        if (!tanpura.isInitialized) {
            tanpura.initialize().then(() => {
                tanpura.pluckString(index);
                setPluckingString(index);
                setTimeout(() => setPluckingString(null), 800);
            });
        } else {
            tanpura.pluckString(index);
            setPluckingString(index);
            setTimeout(() => setPluckingString(null), 800);
        }
    }, [isManualMode, tanpura]);

    const handleStringSelect = useCallback((index: number) => {
        setSelectedStringIndex(index);
        setIsSelectorOpen(true);
    }, []);

    const handleShrutiSelect = useCallback(
        (shrutiId: number, octave: number) => {
            if (selectedStringIndex !== null) {
                tanpura.updateString(selectedStringIndex, { shrutiId, octave });
            }
        },
        [selectedStringIndex, tanpura]
    );

    const handleToggleActive = useCallback(
        (index: number) => {
            const string = tanpura.config.strings[index];
            tanpura.updateString(index, { isActive: !string.isActive });
        },
        [tanpura]
    );

    const handleCloseModal = useCallback(() => {
        setIsSelectorOpen(false);
        setSelectedStringIndex(null);
    }, []);

    const handleMute = useCallback(() => {
        if (tanpura.config.masterVolume > 0) {
            setPreviousVolume(tanpura.config.masterVolume);
            tanpura.setMasterVolume(0);
        } else {
            tanpura.setMasterVolume(previousVolume);
        }
    }, [tanpura, previousVolume]);

    const keyboardActions = useMemo(
        () => ({
            togglePlay: isManualMode ? () => { } : tanpura.togglePlay,
            volumeUp: () => tanpura.setMasterVolume(Math.min(1, tanpura.config.masterVolume + 0.05)),
            volumeDown: () => tanpura.setMasterVolume(Math.max(0, tanpura.config.masterVolume - 0.05)),
            selectString: isManualMode ? handleManualPluck : handleStringSelect,
            closeModal: handleCloseModal,
            mute: handleMute,
        }),
        [tanpura, isManualMode, handleStringSelect, handleManualPluck, handleCloseModal, handleMute]
    );

    useKeyboardShortcuts(keyboardActions);

    // Get current tuning description
    const getTuningDescription = () => {
        return tanpura.config.strings
            .map(s => {
                const shruti = getShrutiById(s.shrutiId);
                const oct = s.octave === -1 ? '↓' : s.octave === 1 ? '↑' : '';
                return shruti ? `${shruti.shortName}${oct}` : '?';
            })
            .join(' - ');
    };

    return (
        <div className="h-full flex flex-col">
            {/* Header */}
            <SectionHeader
                title="Tanpura Drone"
                hindiTitle="तानपुरा"
                description="Continuous drone for practice, tuning, and listening."
            />

            {/* Main content */}
            <div className="flex-1 overflow-y-auto">
                <div className="p-6">
                    <div className="grid lg:grid-cols-[1fr_280px] gap-8">
                        {/* Tanpura visualization */}
                        <div className="space-y-6">
                            {/* Mode toggle */}
                            <div className="flex justify-center">
                                <div className="inline-flex rounded-lg border border-[var(--border-color)] p-1 bg-[var(--bg-secondary)]">
                                    <button
                                        onClick={() => {
                                            setIsManualMode(false);
                                            if (tanpura.isPlaying) tanpura.stop();
                                        }}
                                        className={`
                                            px-4 py-2 rounded-md text-sm font-medium transition-all
                                            ${!isManualMode
                                                ? 'bg-[var(--accent-saffron)] text-white shadow-sm'
                                                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                                            }
                                        `}
                                    >
                                        Auto Play
                                    </button>
                                    <button
                                        onClick={() => {
                                            setIsManualMode(true);
                                            if (tanpura.isPlaying) tanpura.stop();
                                        }}
                                        className={`
                                            px-4 py-2 rounded-md text-sm font-medium transition-all
                                            ${isManualMode
                                                ? 'bg-[var(--accent-saffron)] text-white shadow-sm'
                                                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                                            }
                                        `}
                                    >
                                        Manual Pluck
                                    </button>
                                </div>
                            </div>

                            {/* Play button and status - only show in auto mode */}
                            {!isManualMode && (
                                <div className="flex flex-col items-center gap-4 py-4">
                                    <PlayButton
                                        isPlaying={tanpura.isPlaying}
                                        isInitialized={tanpura.isInitialized}
                                        onToggle={tanpura.togglePlay}
                                        onInitialize={tanpura.initialize}
                                    />

                                    {/* Status indicator */}
                                    <div className="flex items-center gap-3">
                                        <div className={`
                                        w-3 h-3 rounded-full transition-all duration-300
                                        ${tanpura.isPlaying
                                                ? 'bg-[var(--accent-saffron)] animate-breathe'
                                                : 'bg-[var(--text-muted)]'
                                            }
                                    `} />
                                        <span className="text-sm text-[var(--text-secondary)]">
                                            {tanpura.isPlaying ? 'Drone Active' : 'Ready to Play'}
                                        </span>
                                    </div>

                                    {!tanpura.isInitialized && (
                                        <p className="text-[var(--text-muted)] text-sm text-center">
                                            Click to start • Audio requires user interaction
                                        </p>
                                    )}
                                </div>
                            )}

                            {/* Manual mode instructions */}
                            {isManualMode && (
                                <div className="flex flex-col items-center gap-3 py-4">
                                    <div className="text-center">
                                        <p className="text-[var(--text-primary)] font-medium">Manual Pluck Mode</p>
                                        <p className="text-[var(--text-muted)] text-sm mt-1">Click on strings to pluck them</p>
                                    </div>
                                    {!tanpura.isInitialized && (
                                        <button
                                            onClick={tanpura.initialize}
                                            className="px-4 py-2 bg-[var(--accent-saffron)] text-white rounded-lg text-sm hover:opacity-90 transition-opacity"
                                        >
                                            Initialize Audio
                                        </button>
                                    )}
                                </div>
                            )}

                            {/* Current tuning display */}
                            <div className="text-center py-2 px-4 bg-[var(--bg-secondary)] rounded-lg">
                                <span className="text-[var(--text-muted)] text-sm">Current Tuning: </span>
                                <span className="text-[var(--accent-saffron)] font-medium">
                                    {getTuningDescription()}
                                </span>
                            </div>

                            {/* Strings display */}
                            <div className="grid grid-cols-4 gap-4">
                                {tanpura.config.strings.map((string, index) => (
                                    <TanpuraStringComponent
                                        key={index}
                                        string={string}
                                        index={index}
                                        isSelected={selectedStringIndex === index}
                                        isPlaying={tanpura.isPlaying || isManualMode}
                                        isPlucking={pluckingString === index}
                                        onSelect={isManualMode ? handleManualPluck : handleStringSelect}
                                        onToggleActive={handleToggleActive}
                                        onEdit={handleStringSelect}
                                    />
                                ))}
                            </div>

                            {/* Instructions */}
                            <div className="text-center text-[var(--text-muted)] text-sm space-y-1">
                                <p>{isManualMode ? 'Click to pluck • Shift+click to change note' : 'Click on a string to change its shruti'}</p>
                                {!isManualMode && (
                                    <p className="text-xs">
                                        Keyboard: <kbd className="px-1.5 py-0.5 bg-[var(--bg-tertiary)] rounded text-xs mx-1">Space</kbd> Play/Pause
                                        <kbd className="px-1.5 py-0.5 bg-[var(--bg-tertiary)] rounded text-xs mx-1">1-4</kbd> Select string
                                    </p>
                                )}
                                {isManualMode && (
                                    <p className="text-xs">
                                        Keyboard: <kbd className="px-1.5 py-0.5 bg-[var(--bg-tertiary)] rounded text-xs mx-1">1-4</kbd> Pluck string
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Controls panel */}
                        <aside>
                            <Controls
                                masterVolume={tanpura.config.masterVolume}
                                baseFrequency={tanpura.config.baseFrequency}
                                tempo={tanpura.config.tempo}
                                resonance={tanpura.config.resonance}
                                isPlaying={tanpura.isPlaying}
                                onVolumeChange={tanpura.setMasterVolume}
                                onFrequencyChange={tanpura.setBaseFrequency}
                                onTempoChange={tanpura.setTempo}
                                onResonanceChange={tanpura.setResonance}
                                onApplyPreset={tanpura.applyPreset}
                            />
                        </aside>
                    </div>
                </div>
            </div>

            {/* Shruti selector modal */}
            {selectedStringIndex !== null && (
                <ShrutiSelector
                    isOpen={isSelectorOpen}
                    currentShrutiId={tanpura.config.strings[selectedStringIndex].shrutiId}
                    currentOctave={tanpura.config.strings[selectedStringIndex].octave}
                    onSelect={handleShrutiSelect}
                    onClose={handleCloseModal}
                />
            )}
        </div>
    );
}

// Legacy export for compatibility
export { TanpuraSection as TanpuraPage };
