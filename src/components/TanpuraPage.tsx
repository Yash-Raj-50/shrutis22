// ============================================
// TanpuraSection - Tanpura Drone Interface
// ============================================

'use client';

import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { UseTanpuraReturn } from '@/hooks/useTanpura';
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
    onSettingsChange: (updates: Partial<GlobalAudioSettings>) => void;
    tanpura: UseTanpuraReturn;
    isActive?: boolean;
}

export function TanpuraSection({
    onSettingsChange,
    tanpura,
    isActive = true,
}: TanpuraSectionProps) {
    const [selectedStringIndex, setSelectedStringIndex] = useState<number | null>(null);
    const [isSelectorOpen, setIsSelectorOpen] = useState(false);
    const [previousVolume, setPreviousVolume] = useState(0.7);
    const [pluckingString, setPluckingString] = useState<number | null>(null);

    // Sync global settings when tanpura config changes
    useEffect(() => {
        onSettingsChange({
            baseFrequency: tanpura.config.baseFrequency,
            resonance: tanpura.config.resonance,
        });
    }, [onSettingsChange, tanpura.config.baseFrequency, tanpura.config.resonance]);

    // Setup pluck callback for visual feedback
    useEffect(() => {
        if (tanpura.isPlaying) {
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
    }, [tanpura.isPlaying, tanpura.config.tempo]);

    // Handle manual string pluck
    const handleManualPluck = useCallback((index: number) => {
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
    }, [tanpura]);

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
            togglePlay: async () => {
                if (!tanpura.isInitialized) {
                    await tanpura.initialize();
                }
                tanpura.togglePlay();
            },
            volumeUp: () => tanpura.setMasterVolume(Math.min(1, tanpura.config.masterVolume + 0.05)),
            volumeDown: () => tanpura.setMasterVolume(Math.max(0, tanpura.config.masterVolume - 0.05)),
            selectString: handleManualPluck,
            closeModal: handleCloseModal,
            mute: handleMute,
        }),
        [tanpura, handleManualPluck, handleCloseModal, handleMute]
    );

    useKeyboardShortcuts(keyboardActions, { enabled: isActive, enableTogglePlay: false });

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
                                        Click to start audio
                                    </p>
                                )}

                                <p className="text-[var(--text-muted)] text-sm text-center">Click strings or use keys 1-4</p>
                            </div>

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
                                        isPlaying={tanpura.isPlaying}
                                        isPlucking={pluckingString === index}
                                        onSelect={handleManualPluck}
                                        onEdit={handleStringSelect}
                                        editButtonOnly
                                    />
                                ))}
                            </div>

                            {/* Instructions */}
                            <div className="text-center text-[var(--text-muted)] text-sm space-y-1">
                                <p>Use the note icon to change shruti</p>
                                <p className="text-xs">
                                    Keyboard: <kbd className="px-1.5 py-0.5 bg-[var(--bg-tertiary)] rounded text-xs mx-1">Option/Alt + T</kbd> Play/Pause autoplay
                                    <kbd className="px-1.5 py-0.5 bg-[var(--bg-tertiary)] rounded text-xs mx-1">1-4</kbd> Pluck string
                                </p>
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
