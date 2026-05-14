// ============================================
// AppLayout - Main Application Layout with Sidebar
// ============================================

'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { Sidebar, SectionId } from './Sidebar';
import { TanpuraSection } from './TanpuraPage';
import { ShrutiExplorer } from './ShrutiExplorer';
import { LearnPage } from './LearnPage';
import { SettingsPage } from './SettingsPage';
import { ShortcutHelpModal } from './ShortcutHelpModal';
import { useTanpura } from '@/hooks/useTanpura';

// Global audio settings
interface GlobalAudioSettings {
    baseFrequency: number;
    masterVolume: number;
    resonance: number;
}

export function AppLayout() {
    const [activeSection, setActiveSection] = useState<SectionId>('tanpura');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [isShortcutModalOpen, setIsShortcutModalOpen] = useState(false);
    const [audioSettings, setAudioSettings] = useState<GlobalAudioSettings>({
        baseFrequency: 261.63, // C4
        masterVolume: 1,
        resonance: 0.5, // 50% sustain - already very resonant
    });
    
    // Global tanpura instance - persists across section changes
    const globalTanpura = useTanpura({
        baseFrequency: audioSettings.baseFrequency,
        masterVolume: audioSettings.masterVolume,
        resonance: audioSettings.resonance,
    });

    const updateAudioSettings = useCallback((updates: Partial<GlobalAudioSettings>) => {
        setAudioSettings(prev => ({ ...prev, ...updates }));
    }, []);

    const handleSectionChange = useCallback((section: SectionId) => {
        setActiveSection(section);
        setIsSidebarOpen(false);
    }, []);

    const handleTanpuraToggle = useCallback(async () => {
        if (!globalTanpura.isInitialized) {
            await globalTanpura.initialize();
        }
        globalTanpura.togglePlay();
    }, [globalTanpura]);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (
                event.target instanceof HTMLInputElement ||
                event.target instanceof HTMLTextAreaElement ||
                event.target instanceof HTMLSelectElement
            ) {
                return;
            }

            if (event.altKey && event.code === 'KeyT') {
                event.preventDefault();
                handleTanpuraToggle();
                return;
            }

            if (!event.altKey) return;

            const sectionMap: Record<string, SectionId> = {
                Digit1: 'tanpura',
                Digit2: 'explore',
                Digit3: 'learn',
                Digit4: 'settings',
            };

            const nextSection = sectionMap[event.code];
            if (!nextSection) return;

            event.preventDefault();
            handleSectionChange(nextSection);
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleSectionChange, handleTanpuraToggle]);

    return (
        <div className="flex flex-row-reverse h-screen overflow-hidden indian-pattern-overlay">
            {/* Sidebar */}
            <Sidebar
                activeSection={activeSection}
                onSectionChange={handleSectionChange}
                isOpen={isSidebarOpen}
                isCollapsed={isSidebarCollapsed}
                onClose={() => setIsSidebarOpen(false)}
                onToggleCollapse={() => setIsSidebarCollapsed(prev => !prev)}
                tanpuraIsPlaying={globalTanpura.isPlaying}
                tanpuraIsInitialized={globalTanpura.isInitialized}
                onTanpuraToggle={handleTanpuraToggle}
                onShowShortcuts={() => setIsShortcutModalOpen(true)}
            />

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col overflow-hidden bg-[var(--bg-primary)] relative z-10">
                {/* Top bar with Indian decorative element */}
                <div className="relative">
                    <div className="h-1 bg-gradient-to-r from-[var(--accent-saffron)] via-[var(--accent-rust)] to-[var(--accent-maroon)]" />
                    <div className="lg:hidden flex items-center justify-between px-4 py-3 bg-[var(--bg-secondary)] border-b border-[var(--border-color)]">
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-[var(--border-color)] bg-[var(--bg-card)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] transition-colors"
                            aria-label="Open sidebar"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                            Menu
                        </button>
                        <div className="text-right min-w-0">
                            <div className="text-sm font-medium text-[var(--text-primary)] truncate">
                                {activeSection === 'tanpura' && 'Tanpura'}
                                {activeSection === 'explore' && 'Play Shrutis'}
                                {activeSection === 'learn' && 'Learn & Quiz'}
                                {activeSection === 'settings' && 'Settings'}
                            </div>
                            <div className="text-xs text-[var(--text-muted)]">22 Shrutis</div>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-hidden">
                    <div className={activeSection === 'tanpura' ? 'h-full' : 'hidden'} aria-hidden={activeSection !== 'tanpura'}>
                        <TanpuraSection
                            onSettingsChange={updateAudioSettings}
                            tanpura={globalTanpura}
                            isActive={activeSection === 'tanpura'}
                        />
                    </div>

                    {activeSection === 'explore' && (
                        <ShrutiExplorer
                            baseFrequency={audioSettings.baseFrequency}
                            volume={audioSettings.masterVolume}
                            resonance={audioSettings.resonance}
                            onVolumeChange={(vol) => updateAudioSettings({ masterVolume: vol })}
                            onResonanceChange={(res) => updateAudioSettings({ resonance: res })}
                        />
                    )}

                    {activeSection === 'learn' && (
                        <LearnPage
                            baseFrequency={audioSettings.baseFrequency}
                            volume={audioSettings.masterVolume}
                        />
                    )}

                    {activeSection === 'settings' && (
                        <SettingsPage
                            baseFrequency={audioSettings.baseFrequency}
                            masterVolume={audioSettings.masterVolume}
                            resonance={audioSettings.resonance}
                            onBaseFrequencyChange={(freq) => updateAudioSettings({ baseFrequency: freq })}
                            onVolumeChange={(vol) => updateAudioSettings({ masterVolume: vol })}
                            onResonanceChange={(res) => updateAudioSettings({ resonance: res })}
                        />
                    )}
                </div>

            </main>
            <ShortcutHelpModal
                isOpen={isShortcutModalOpen}
                onClose={() => setIsShortcutModalOpen(false)}
            />
        </div>
    );
}
