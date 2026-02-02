// ============================================
// AppLayout - Main Application Layout with Sidebar
// ============================================

'use client';

import React, { useState } from 'react';
import { Sidebar, SectionId } from './Sidebar';
import { TanpuraSection } from './TanpuraPage';
import { ShrutiExplorer } from './ShrutiExplorer';
import { LearnPage } from './LearnPage';
import { SettingsPage } from './SettingsPage';
import { MotifBackground } from './MotifBackground';

// Global audio settings
interface GlobalAudioSettings {
    baseFrequency: number;
    masterVolume: number;
    resonance: number;
}

export function AppLayout() {
    const [activeSection, setActiveSection] = useState<SectionId>('tanpura');
    const [audioSettings, setAudioSettings] = useState<GlobalAudioSettings>({
        baseFrequency: 261.63, // C4
        masterVolume: 0.7,
        resonance: 0.5, // 50% sustain - already very resonant
    });

    const updateAudioSettings = (updates: Partial<GlobalAudioSettings>) => {
        setAudioSettings(prev => ({ ...prev, ...updates }));
    };

    const renderContent = () => {
        switch (activeSection) {
            case 'tanpura':
                return (
                    <TanpuraSection
                        globalSettings={audioSettings}
                        onSettingsChange={updateAudioSettings}
                    />
                );
            case 'explore':
                return (
                    <ShrutiExplorer
                        baseFrequency={audioSettings.baseFrequency}
                        volume={audioSettings.masterVolume}
                        resonance={audioSettings.resonance}
                        onVolumeChange={(vol) => updateAudioSettings({ masterVolume: vol })}
                    />
                );
            case 'learn':
                return (
                    <LearnPage
                        baseFrequency={audioSettings.baseFrequency}
                        volume={audioSettings.masterVolume}
                    />
                );
            case 'settings':
                return (
                    <SettingsPage
                        baseFrequency={audioSettings.baseFrequency}
                        masterVolume={audioSettings.masterVolume}
                        onBaseFrequencyChange={(freq) => updateAudioSettings({ baseFrequency: freq })}
                        onVolumeChange={(vol) => updateAudioSettings({ masterVolume: vol })}
                    />
                );
            default:
                return (
                    <TanpuraSection
                        globalSettings={audioSettings}
                        onSettingsChange={updateAudioSettings}
                    />
                );
        }
    };

    return (
        <div className="flex flex-row-reverse h-screen overflow-hidden indian-pattern-overlay">
            {/* Motif Background Layer */}
            <MotifBackground />

            {/* Sidebar */}
            <Sidebar
                activeSection={activeSection}
                onSectionChange={setActiveSection}
            />

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col overflow-hidden bg-[var(--bg-primary)] relative z-10">
                {/* Top bar with Indian decorative element */}
                <div className="h-1 bg-gradient-to-r from-[var(--accent-saffron)] via-[var(--accent-rust)] to-[var(--accent-maroon)]" />

                {/* Content */}
                <div className="flex-1 overflow-hidden">
                    {renderContent()}
                </div>

                {/* Footer */}
                <footer className="px-6 py-3 bg-[var(--bg-secondary)] border-t border-[var(--border-color)]">
                    <div className="flex justify-between items-center text-xs text-[var(--text-muted)]">
                        <span>22 Shrutis v0.5.0 • Hindustani Classical Music</span>
                        <span>Built with ♪ for music learners. By Yash</span>
                    </div>
                </footer>
            </main>
        </div>
    );
}