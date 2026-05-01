// ============================================
// Quiz Audio Engine - Plays shrutis for ear training
// ============================================

import * as Tone from 'tone';
import { calculateFrequency } from '@/types';
import { getShrutiById } from '@/constants/shrutis';

const OUTPUT_GAIN_BOOST = 2.75;

/**
 * QuizAudioEngine - Plays individual notes or sequences for quiz questions
 * Uses PluckSynth for authentic Indian string sound
 */
export class QuizAudioEngine {
    private synth: Tone.PluckSynth | null = null;
    private gain: Tone.Gain | null = null;
    private reverb: Tone.Reverb | null = null;
    private limiter: Tone.Limiter | null = null;
    private isInitialized = false;
    private baseFrequency: number;
    private volume: number;

    constructor(baseFrequency: number = 261.63, volume: number = 1) {
        this.baseFrequency = baseFrequency;
        this.volume = volume;
    }

    private getOutputVolume(volume: number): number {
        return Math.max(0, volume * OUTPUT_GAIN_BOOST);
    }

    /**
     * Initialize the audio engine
     */
    async initialize(): Promise<void> {
        if (this.isInitialized) return;

        await Tone.start();

        this.gain = new Tone.Gain(this.getOutputVolume(this.volume));
        this.reverb = new Tone.Reverb({
            decay: 4,
            wet: 0.3,
        });
        this.limiter = new Tone.Limiter(-6);

        await this.reverb.generate();

        this.synth = new Tone.PluckSynth({
            attackNoise: 0.3,
            dampening: 2000,
            resonance: 0.995,
            release: 4,
        });

        this.synth.connect(this.gain);
        this.gain.connect(this.reverb);
        this.reverb.connect(this.limiter);
        this.limiter.toDestination();

        this.isInitialized = true;
    }

    /**
     * Set base frequency (Sa)
     */
    setBaseFrequency(freq: number): void {
        this.baseFrequency = freq;
    }

    /**
     * Set volume
     */
    setVolume(vol: number): void {
        this.volume = vol;
        if (this.gain) {
            this.gain.gain.value = this.getOutputVolume(vol);
        }
    }

    /**
     * Get frequency for a shruti
     */
    private getFrequency(shrutiId: number, octaveOffset: number = 0): number {
        const shruti = getShrutiById(shrutiId);
        if (!shruti) return this.baseFrequency;

        return calculateFrequency(this.baseFrequency, shruti.ratio, octaveOffset);
    }

    /**
     * Play a single shruti
     */
    async playShruti(shrutiId: number, octaveOffset: number = 0): Promise<void> {
        if (!this.isInitialized) {
            await this.initialize();
        }

        if (!this.synth) return;

        const freq = this.getFrequency(shrutiId, octaveOffset);
        this.synth.triggerAttack(freq);
    }

    /**
     * Play a sequence of shrutis with timing
     */
    async playSequence(
        shrutiIds: number[],
        intervalMs: number = 600,
        onNotePlayed?: (index: number) => void
    ): Promise<void> {
        if (!this.isInitialized) {
            await this.initialize();
        }

        if (!this.synth) return;

        for (let i = 0; i < shrutiIds.length; i++) {
            const freq = this.getFrequency(shrutiIds[i], 0);
            this.synth.triggerAttack(freq);

            if (onNotePlayed) {
                onNotePlayed(i);
            }

            // Wait before next note (except for last note)
            if (i < shrutiIds.length - 1) {
                await new Promise(resolve => setTimeout(resolve, intervalMs));
            }
        }
    }

    /**
     * Stop any playing sounds
     */
    stop(): void {
        // PluckSynth naturally decays, no explicit stop needed
    }

    /**
     * Cleanup resources
     */
    dispose(): void {
        if (this.synth) {
            this.synth.dispose();
            this.synth = null;
        }
        if (this.gain) {
            this.gain.dispose();
            this.gain = null;
        }
        if (this.reverb) {
            this.reverb.dispose();
            this.reverb = null;
        }
        if (this.limiter) {
            this.limiter.dispose();
            this.limiter = null;
        }
        this.isInitialized = false;
    }

    /**
     * Check if initialized
     */
    getIsInitialized(): boolean {
        return this.isInitialized;
    }
}

// Singleton instance for the app
let quizAudioInstance: QuizAudioEngine | null = null;

export function getQuizAudioEngine(
    baseFrequency: number = 261.63,
    volume: number = 1
): QuizAudioEngine {
    if (!quizAudioInstance) {
        quizAudioInstance = new QuizAudioEngine(baseFrequency, volume);
    } else {
        quizAudioInstance.setBaseFrequency(baseFrequency);
        quizAudioInstance.setVolume(volume);
    }
    return quizAudioInstance;
}
