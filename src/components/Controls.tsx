// ============================================
// Controls Component - Volume, Tempo, Pitch
// ============================================

'use client';

import React from 'react';
import { BASE_FREQUENCIES, TANPURA_PRESETS } from '@/constants/shrutis';
import { TanpuraPreset } from '@/types';

interface ControlsProps {
    masterVolume: number;
    baseFrequency: number;
    tempo: number;
    resonance: number;
    isPlaying: boolean;
    onVolumeChange: (volume: number) => void;
    onFrequencyChange: (frequency: number) => void;
    onTempoChange: (tempo: number) => void;
    onResonanceChange: (resonance: number) => void;
    onApplyPreset: (preset: TanpuraPreset) => void;
}

export function Controls({
    masterVolume,
    baseFrequency,
    tempo,
    resonance,
    isPlaying,
    onVolumeChange,
    onFrequencyChange,
    onTempoChange,
    onResonanceChange,
    onApplyPreset,
}: ControlsProps) {
    const getPitchName = (freq: number): string => {
        let closest = 'C4';
        let minDiff = Infinity;

        for (const [name, f] of Object.entries(BASE_FREQUENCIES)) {
            const diff = Math.abs(f - freq);
            if (diff < minDiff) {
                minDiff = diff;
                closest = name;
            }
        }
        return closest;
    };

    return (
        <div className="bg-[var(--bg-secondary)] rounded-xl p-5 space-y-5 border border-[var(--border-color)]">
            <h3 className="text-base font-semibold text-[var(--text-primary)]">Controls</h3>

            {/* Master Volume */}
            <div>
                <div className="flex justify-between mb-2">
                    <label className="text-[var(--text-secondary)] text-sm">Volume</label>
                    <span className="text-[var(--accent-saffron)] font-mono text-sm">
                        {Math.round(masterVolume * 100)}%
                    </span>
                </div>
                <input
                    type="range"
                    min="0"
                    max="100"
                    value={masterVolume * 100}
                    onChange={e => onVolumeChange(Number(e.target.value) / 100)}
                    className="w-full h-2 bg-[var(--bg-tertiary)] rounded-lg appearance-none cursor-pointer
                        [&::-webkit-slider-thumb]:appearance-none
                        [&::-webkit-slider-thumb]:w-4
                        [&::-webkit-slider-thumb]:h-4
                        [&::-webkit-slider-thumb]:rounded-full
                        [&::-webkit-slider-thumb]:bg-[var(--accent-saffron)]
                        [&::-webkit-slider-thumb]:cursor-pointer
                        [&::-webkit-slider-thumb]:border-2
                        [&::-webkit-slider-thumb]:border-[var(--bg-primary)]
                        [&::-webkit-slider-thumb]:shadow-md"
                />
            </div>

            {/* Base Pitch (Sa) */}
            <div>
                <div className="flex justify-between mb-2">
                    <label className="text-[var(--text-secondary)] text-sm">Sa (षड्ज)</label>
                    <span className="text-[var(--accent-gold)] font-mono text-sm">
                        {getPitchName(baseFrequency)}
                    </span>
                </div>
                <select
                    value={baseFrequency}
                    onChange={e => onFrequencyChange(Number(e.target.value))}
                    className="w-full bg-[var(--bg-tertiary)] text-[var(--text-primary)] rounded-lg px-3 py-2
                        border border-[var(--border-color)] focus:border-[var(--accent-saffron)] focus:outline-none
                        cursor-pointer"
                >
                    {Object.entries(BASE_FREQUENCIES).map(([name, freq]) => (
                        <option key={name} value={freq}>
                            {name} ({freq.toFixed(1)} Hz)
                        </option>
                    ))}
                </select>
            </div>

            {/* Tempo - for visual cycle speed */}
            <div>
                <div className="flex justify-between mb-2">
                    <label className="text-[var(--text-secondary)] text-sm">Cycle Speed</label>
                    <span className="text-[var(--text-muted)] font-mono text-sm">{tempo} BPM</span>
                </div>
                <input
                    type="range"
                    min="30"
                    max="120"
                    value={tempo}
                    onChange={e => onTempoChange(Number(e.target.value))}
                    className="w-full h-2 bg-[var(--bg-tertiary)] rounded-lg appearance-none cursor-pointer
                        [&::-webkit-slider-thumb]:appearance-none
                        [&::-webkit-slider-thumb]:w-4
                        [&::-webkit-slider-thumb]:h-4
                        [&::-webkit-slider-thumb]:rounded-full
                        [&::-webkit-slider-thumb]:bg-[var(--accent-rust)]
                        [&::-webkit-slider-thumb]:cursor-pointer
                        [&::-webkit-slider-thumb]:border-2
                        [&::-webkit-slider-thumb]:border-[var(--bg-primary)]"
                />
            </div>

            {/* Resonance/Sustain control */}
            <div>
                <div className="flex justify-between mb-2">
                    <label className="text-[var(--text-secondary)] text-sm">Sustain</label>
                    <span className="text-[var(--accent-gold)] font-mono text-sm">
                        {Math.round(resonance * 100)}%
                    </span>
                </div>
                <input
                    type="range"
                    min="0"
                    max="100"
                    value={resonance * 100}
                    onChange={e => onResonanceChange(Number(e.target.value) / 100)}
                    className="w-full h-2 bg-[var(--bg-tertiary)] rounded-lg appearance-none cursor-pointer
                        [&::-webkit-slider-thumb]:appearance-none
                        [&::-webkit-slider-thumb]:w-4
                        [&::-webkit-slider-thumb]:h-4
                        [&::-webkit-slider-thumb]:rounded-full
                        [&::-webkit-slider-thumb]:bg-[var(--accent-gold)]
                        [&::-webkit-slider-thumb]:cursor-pointer
                        [&::-webkit-slider-thumb]:border-2
                        [&::-webkit-slider-thumb]:border-[var(--bg-primary)]"
                />
            </div>

            {/* Presets */}
            <div>
                <label className="text-[var(--text-secondary)] text-sm block mb-2">Quick Tunings</label>
                <div className="grid grid-cols-1 gap-2">
                    {TANPURA_PRESETS.map((preset, index) => (
                        <button
                            key={index}
                            onClick={() => onApplyPreset(preset)}
                            className="bg-[var(--bg-tertiary)] hover:bg-[var(--border-color)] 
                                text-[var(--text-secondary)] hover:text-[var(--text-primary)]
                                text-sm px-3 py-2.5 rounded-lg transition-all duration-150 
                                text-left border border-transparent hover:border-[var(--border-light)]"
                            title={preset.description}
                        >
                            <span className="font-medium">{preset.name}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
