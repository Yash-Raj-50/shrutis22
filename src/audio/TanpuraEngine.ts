// ============================================
// Audio Engine - Authentic Tanpura Synthesis using Karplus-Strong
// ============================================

import * as Tone from 'tone';
import { TanpuraConfig, TanpuraString, calculateFrequency } from '@/types';
import { getShrutiById } from '@/constants/shrutis';

const OUTPUT_GAIN_BOOST = 6.5;

/**
 * TanpuraEngine - Authentic tanpura drone using Karplus-Strong synthesis
 *
 * Creates realistic plucked string sound by:
 * - Using Tone.PluckSynth (Karplus-Strong algorithm)
 * - Sequential plucking of 4 strings in cycle
 * - Natural decay and resonance
 * - Proper volume control (zero = silence)
 */
export class TanpuraEngine {
    private pluckSynths: Tone.PluckSynth[] = [];
    private stringGains: Tone.Gain[] = [];
    private masterGain: Tone.Gain;
    private reverb: Tone.Reverb;
    private limiter: Tone.Limiter;
    private isInitialized = false;
    private isPlaying = false;
    private config: TanpuraConfig;

    // For the plucking cycle
    private pluckInterval: number | null = null;
    private currentPluckIndex = 0;
    private onPluckCallback: ((index: number) => void) | null = null;

    constructor(config: TanpuraConfig) {
        this.config = config;
        this.masterGain = new Tone.Gain(0);
        this.limiter = new Tone.Limiter(-6);
        this.reverb = new Tone.Reverb({
            decay: 8,
            wet: 0.4,
        });
    }

    /**
     * Set callback for pluck animation
     */
    setPluckCallback(callback: (index: number) => void): void {
        this.onPluckCallback = callback;
    }

    /**
     * Initialize the audio engine
     */
    async initialize(): Promise<void> {
        if (this.isInitialized) return;

        await Tone.start();
        await this.reverb.generate();

        // Create PluckSynth for each string (Karplus-Strong)
        // Higher base resonance for longer sustain even at 0%
        const resonanceValue = 0.99 + (this.config.resonance * 0.008); // 0.99 to 0.998
        const releaseValue = 0.05 + (this.config.resonance * 8); // 0.1 to 8.1 seconds

        for (let i = 0; i < 4; i++) {
            const stringVolume = this.config.strings[i].volume;
            const stringGain = new Tone.Gain(stringVolume === 0 ? 0 : stringVolume);

            const pluck = new Tone.PluckSynth({
                attackNoise: 0.25,
                dampening: 400, // Lower dampening = brighter, clearer lower notes
                resonance: resonanceValue,
                release: releaseValue,
            });

            pluck.connect(stringGain);
            stringGain.connect(this.reverb);

            this.pluckSynths.push(pluck);
            this.stringGains.push(stringGain);
        }

        this.reverb.connect(this.limiter);
        this.limiter.connect(this.masterGain);
        this.masterGain.toDestination();

        this.isInitialized = true;
    }

    private getOutputVolume(volume: number): number {
        return Math.max(0, volume * OUTPUT_GAIN_BOOST);
    }

    /**
     * Get frequency for a string
     */
    private getStringFrequency(stringIndex: number): number {
        const stringConfig = this.config.strings[stringIndex];
        const shruti = getShrutiById(stringConfig.shrutiId);
        if (!shruti) return 261.63;

        return calculateFrequency(
            this.config.baseFrequency,
            shruti.ratio,
            stringConfig.octave
        );
    }

    /**
     * Pluck a single string (internal - checks isPlaying)
     */
    private pluckString(stringIndex: number): void {
        if (!this.isPlaying) return;
        this.doPluck(stringIndex);
    }

    /**
     * Manual pluck for self-pluck mode (doesn't check isPlaying)
     */
    manualPluckString(stringIndex: number): void {
        if (!this.isInitialized) return;
        if (this.config.masterVolume === 0) return;

        // Ensure master gain is set for manual plucking
        this.masterGain.gain.value = this.getOutputVolume(this.config.masterVolume);
        this.doPluck(stringIndex);
    }

    /**
     * Actually pluck the string
     */
    private doPluck(stringIndex: number): void {
        const stringConfig = this.config.strings[stringIndex];
        if (!stringConfig.isActive || stringConfig.volume === 0) return;
        if (this.config.masterVolume === 0) return;

        const freq = this.getStringFrequency(stringIndex);
        const synth = this.pluckSynths[stringIndex];

        if (synth) {
            synth.triggerAttack(freq);
        }

        if (this.onPluckCallback) {
            this.onPluckCallback(stringIndex);
        }
    }

    /**
     * Start the tanpura drone
     */
    start(): void {
        if (!this.isInitialized || this.isPlaying) return;
        if (this.config.masterVolume === 0) return;

        this.masterGain.gain.value = this.getOutputVolume(this.config.masterVolume);
        this.isPlaying = true;
        this.startPluckCycle();
    }

    /**
     * Plucking cycle - authentic tanpura plays strings in sequence
     */
    private startPluckCycle(): void {
        const intervalMs = (60000 / this.config.tempo);

        this.pluckString(this.currentPluckIndex);
        this.currentPluckIndex = (this.currentPluckIndex + 1) % 4;

        this.pluckInterval = window.setInterval(() => {
            this.pluckString(this.currentPluckIndex);
            this.currentPluckIndex = (this.currentPluckIndex + 1) % 4;
        }, intervalMs);
    }

    /**
     * Stop the tanpura drone - immediate stop
     */
    stop(): void {
        if (!this.isPlaying) return;

        if (this.pluckInterval) {
            clearInterval(this.pluckInterval);
            this.pluckInterval = null;
        }

        this.masterGain.gain.rampTo(0, 0.3);
        this.isPlaying = false;
        this.currentPluckIndex = 0;
    }

    /**
     * Toggle play/pause
     */
    toggle(): void {
        if (this.isPlaying) {
            this.stop();
        } else {
            this.start();
        }
    }

    /**
     * Update configuration
     */
    updateConfig(newConfig: Partial<TanpuraConfig>): void {
        this.config = { ...this.config, ...newConfig };

        if (newConfig.masterVolume !== undefined) {
            const vol = newConfig.masterVolume === 0 ? 0 : this.getOutputVolume(newConfig.masterVolume);
            this.masterGain.gain.rampTo(vol, 0.1);
        }

        if (newConfig.strings) {
            newConfig.strings.forEach((string, index) => {
                if (this.stringGains[index]) {
                    const vol = string.volume === 0 ? 0 : string.volume;
                    this.stringGains[index].gain.rampTo(vol, 0.1);
                }
            });
        }

        if (newConfig.resonance !== undefined) {
            this.updateResonance(newConfig.resonance);
        }
    }

    /**
     * Update a single string
     */
    updateString(index: number, updates: Partial<TanpuraString>): void {
        if (index < 0 || index > 3) return;

        this.config.strings[index] = {
            ...this.config.strings[index],
            ...updates,
        };

        if (updates.volume !== undefined && this.stringGains[index]) {
            const vol = updates.volume === 0 ? 0 : updates.volume;
            this.stringGains[index].gain.rampTo(vol, 0.1);
        }
    }

    setMasterVolume(volume: number): void {
        this.config.masterVolume = Math.max(0, Math.min(1, volume));
        const vol = this.config.masterVolume === 0 ? 0 : this.getOutputVolume(this.config.masterVolume);
        this.masterGain.gain.rampTo(vol, 0.1);
    }

    setResonance(resonance: number): void {
        this.config.resonance = Math.max(0, Math.min(1, resonance));
        this.updateResonance(this.config.resonance);
    }

    private updateResonance(resonance: number): void {
        const resonanceValue = 0.99 + (resonance * 0.008); // 0.99 to 0.998
        const releaseValue = 0.05 + (resonance * 8); // 0.1 to 8.1 seconds

        this.pluckSynths.forEach(synth => {
            synth.resonance = resonanceValue;
            synth.release = releaseValue;
        });
    }

    setBaseFrequency(frequency: number): void {
        this.config.baseFrequency = frequency;
    }

    setTempo(tempo: number): void {
        this.config.tempo = Math.max(30, Math.min(120, tempo));
        // Restart pluck cycle with new tempo
        if (this.pluckInterval) {
            clearInterval(this.pluckInterval);
            this.startPluckCycle();
        }
    }

    getConfig(): TanpuraConfig {
        return { ...this.config };
    }

    getIsPlaying(): boolean {
        return this.isPlaying;
    }

    getIsInitialized(): boolean {
        return this.isInitialized;
    }

    dispose(): void {
        this.stop();

        this.pluckSynths.forEach(synth => synth.dispose());
        this.stringGains.forEach(gain => gain.dispose());
        this.masterGain.dispose();
        this.reverb.dispose();
        this.limiter.dispose();

        this.pluckSynths = [];
        this.stringGains = [];
        this.isInitialized = false;
    }
}

/**
 * Create default tanpura configuration
 */
export function createDefaultTanpuraConfig(): TanpuraConfig {
    return {
        baseFrequency: 261.63, // C4
        masterVolume: 1, // Full default volume
        tempo: 60,
        resonance: 0.5, // 50% sustain by default - already very resonant
        isPlaying: false,
        strings: [
            { stringNumber: 1, shrutiId: 14, octave: 0, isActive: true, volume: 0.7 }, // Pa
            { stringNumber: 2, shrutiId: 1, octave: 0, isActive: true, volume: 0.8 }, // Sa
            { stringNumber: 3, shrutiId: 1, octave: 0, isActive: true, volume: 0.8 }, // Sa
            { stringNumber: 4, shrutiId: 1, octave: -1, isActive: true, volume: 0.9 }, // Sa (lower)
        ],
    };
}

/**
 * Simple single note player for shruti exploration
 * Uses PluckSynth for softer, more natural plucked string sound
 */
export class ShrutiPlayer {
    private pluckSynth: Tone.PluckSynth | null = null;
    private filter: Tone.Filter | null = null;
    private reverb: Tone.Reverb | null = null;
    private gain: Tone.Gain | null = null;
    private limiter: Tone.Limiter | null = null;
    private isInitialized = false;
    private baseFrequency: number = 261.63;
    private volume: number = 1;
    private resonance: number = 1.0;

    async initialize(): Promise<void> {
        if (this.isInitialized) return;

        await Tone.start();

        this.reverb = new Tone.Reverb({ decay: 6, wet: 0.4 });
        await this.reverb.generate();

        this.filter = new Tone.Filter({
            frequency: 800,
            type: 'lowpass',
            rolloff: -24,
        });

        this.gain = new Tone.Gain(this.getOutputVolume(this.volume));
        this.limiter = new Tone.Limiter(-6);

        this.pluckSynth = new Tone.PluckSynth({
            attackNoise: 0.2,
            dampening: 350,
            resonance: 0.99 + (this.resonance * 0.008),
            release: 0.05 + (this.resonance * 8),
        });

        this.pluckSynth.connect(this.filter);
        this.filter.connect(this.gain);
        this.gain.connect(this.reverb);
        this.reverb.connect(this.limiter);
        this.limiter.toDestination();

        this.isInitialized = true;
    }

    private getOutputVolume(volume: number): number {
        return Math.max(0, volume * OUTPUT_GAIN_BOOST);
    }

    setBaseFrequency(freq: number): void {
        this.baseFrequency = freq;
    }

    setVolume(vol: number): void {
        this.volume = Math.max(0, Math.min(1, vol));
        if (this.gain) {
            this.gain.gain.rampTo(this.getOutputVolume(this.volume), 0.1);
        }
    }

    setResonance(res: number): void {
        this.resonance = Math.max(0, Math.min(1, res));
        if (this.pluckSynth) {
            this.pluckSynth.resonance = 0.99 + (this.resonance * 0.008);
            this.pluckSynth.release = 0.1 + (this.resonance * 8);
        }
    }

    playNote(ratio: [number, number], octave: number = 0): void {
        if (!this.pluckSynth || this.volume === 0) return;

        // Restore gain to normal volume in case it was muted
        if (this.gain) {
            this.gain.gain.value = this.getOutputVolume(this.volume);
        }

        const freq = calculateFrequency(this.baseFrequency, ratio, octave);
        this.pluckSynth.triggerAttack(freq);
    }

    stopNote(): void {
        if (!this.gain) return;
        // Immediately cut the gain to stop the note
        this.gain.gain.value = 0;
        // Reset the synth for the next note
        if (this.pluckSynth) {
            this.pluckSynth.triggerRelease();
        }
    }

    dispose(): void {
        this.pluckSynth?.dispose();
        this.filter?.dispose();
        this.gain?.dispose();
        this.reverb?.dispose();
        this.limiter?.dispose();
        this.isInitialized = false;
    }
}
