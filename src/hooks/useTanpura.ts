// ============================================
// useTanpura Hook - Audio Engine Integration
// ============================================

'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { TanpuraEngine, createDefaultTanpuraConfig } from '@/audio/TanpuraEngine';
import { TanpuraConfig, TanpuraString, TanpuraPreset } from '@/types';

interface UseTanpuraReturn {
    // State
    config: TanpuraConfig;
    isInitialized: boolean;
    isPlaying: boolean;

    // Actions
    initialize: () => Promise<void>;
    togglePlay: () => void;
    start: () => void;
    stop: () => void;
    pluckString: (index: number) => void;

    // Configuration
    setMasterVolume: (volume: number) => void;
    setBaseFrequency: (frequency: number) => void;
    setTempo: (tempo: number) => void;
    setResonance: (resonance: number) => void;
    updateString: (index: number, updates: Partial<TanpuraString>) => void;
    applyPreset: (preset: TanpuraPreset) => void;
}

export function useTanpura(initialConfig?: Partial<TanpuraConfig>): UseTanpuraReturn {
    const engineRef = useRef<TanpuraEngine | null>(null);
    const [config, setConfig] = useState<TanpuraConfig>(() => ({
        ...createDefaultTanpuraConfig(),
        ...initialConfig,
    }));
    const [isInitialized, setIsInitialized] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);

    // Initialize engine on mount
    useEffect(() => {
        if (!engineRef.current) {
            engineRef.current = new TanpuraEngine(config);
        }

        return () => {
            engineRef.current?.dispose();
            engineRef.current = null;
        };
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // Initialize audio (must be called after user interaction)
    const initialize = useCallback(async () => {
        if (!engineRef.current || isInitialized) return;

        try {
            await engineRef.current.initialize();
            setIsInitialized(true);
        } catch (error) {
            console.error('Failed to initialize audio:', error);
        }
    }, [isInitialized]);

    // Toggle play/pause
    const togglePlay = useCallback(() => {
        if (!engineRef.current || !isInitialized) return;

        engineRef.current.toggle();
        setIsPlaying(engineRef.current.getIsPlaying());
        setConfig(prev => ({ ...prev, isPlaying: engineRef.current!.getIsPlaying() }));
    }, [isInitialized]);

    // Start playback
    const start = useCallback(() => {
        if (!engineRef.current || !isInitialized || isPlaying) return;

        engineRef.current.start();
        setIsPlaying(true);
        setConfig(prev => ({ ...prev, isPlaying: true }));
    }, [isInitialized, isPlaying]);

    // Stop playback
    const stop = useCallback(() => {
        if (!engineRef.current || !isPlaying) return;

        engineRef.current.stop();
        setIsPlaying(false);
        setConfig(prev => ({ ...prev, isPlaying: false }));
    }, [isPlaying]);

    // Manual pluck a single string
    const pluckString = useCallback((index: number) => {
        if (!engineRef.current || !isInitialized) return;
        if (index < 0 || index > 3) return;
        engineRef.current.manualPluckString(index);
    }, [isInitialized]);

    // Set master volume
    const setMasterVolume = useCallback((volume: number) => {
        const clampedVolume = Math.max(0, Math.min(1, volume));
        engineRef.current?.setMasterVolume(clampedVolume);
        setConfig(prev => ({ ...prev, masterVolume: clampedVolume }));
    }, []);

    // Set base frequency
    const setBaseFrequency = useCallback((frequency: number) => {
        engineRef.current?.setBaseFrequency(frequency);
        setConfig(prev => ({ ...prev, baseFrequency: frequency }));
    }, []);

    // Set tempo
    const setTempo = useCallback((tempo: number) => {
        const clampedTempo = Math.max(30, Math.min(120, tempo));
        engineRef.current?.setTempo(clampedTempo);
        setConfig(prev => ({ ...prev, tempo: clampedTempo }));
    }, []);

    // Set resonance
    const setResonance = useCallback((resonance: number) => {
        const clampedResonance = Math.max(0, Math.min(1, resonance));
        engineRef.current?.setResonance(clampedResonance);
        setConfig(prev => ({ ...prev, resonance: clampedResonance }));
    }, []);

    // Update a single string
    const updateString = useCallback((index: number, updates: Partial<TanpuraString>) => {
        if (index < 0 || index > 3) return;

        engineRef.current?.updateString(index, updates);
        setConfig(prev => {
            const newStrings = [...prev.strings] as TanpuraConfig['strings'];
            newStrings[index] = { ...newStrings[index], ...updates };
            return { ...prev, strings: newStrings };
        });
    }, []);

    // Apply a preset
    const applyPreset = useCallback((preset: TanpuraPreset) => {
        const newStrings = config.strings.map((string, index) => ({
            ...string,
            shrutiId: preset.strings[index],
            octave: preset.octaves[index],
        })) as TanpuraConfig['strings'];

        engineRef.current?.updateConfig({ strings: newStrings });
        setConfig(prev => ({ ...prev, strings: newStrings }));
    }, [config.strings]);

    return {
        config,
        isInitialized,
        isPlaying,
        initialize,
        togglePlay,
        start,
        stop,
        pluckString,
        setMasterVolume,
        setBaseFrequency,
        setTempo,
        setResonance,
        updateString,
        applyPreset,
    };
}
