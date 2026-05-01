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
    const [audioSettings, setAudioSettings] = useState<GlobalAudioSettings>({
        baseFrequency: 261.63, // C4
        masterVolume: 1,
        resonance: 0.5, // 50% sustain - already very resonant
    });

    const updateAudioSettings = (updates: Partial<GlobalAudioSettings>) => {
        setAudioSettings(prev => ({ ...prev, ...updates }));
    };

    const handleSectionChange = (section: SectionId) => {
        setActiveSection(section);
        setIsSidebarOpen(false);
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
            {/* Sidebar */}
            <Sidebar
                activeSection={activeSection}
                onSectionChange={handleSectionChange}
                isOpen={isSidebarOpen}
                isCollapsed={isSidebarCollapsed}
                onClose={() => setIsSidebarOpen(false)}
                onToggleCollapse={() => setIsSidebarCollapsed(prev => !prev)}
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
                                {activeSection === 'explore' && 'Explore Shrutis'}
                                {activeSection === 'learn' && 'Learn & Quiz'}
                                {activeSection === 'settings' && 'Settings'}
                            </div>
                            <div className="text-xs text-[var(--text-muted)]">22 Shrutis</div>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-hidden">
                    {renderContent()}
                </div>

            </main>
        </div>
    );
}
