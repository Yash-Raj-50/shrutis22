// ============================================
// Settings Page - App Configuration and Management
// ============================================

'use client';

import React, { useState } from 'react';
import { SectionHeader } from './SectionHeader';

const PROGRESS_STORAGE_KEY = '22shrutis-quiz-progress';
const THEME_STORAGE_KEY = '22shrutis-theme';

type Theme = 'light' | 'dark' | 'system';

interface SettingsPageProps {
  baseFrequency: number;
  masterVolume: number;
  resonance: number;
  onBaseFrequencyChange: (freq: number) => void;
  onVolumeChange: (vol: number) => void;
  onResonanceChange: (res: number) => void;
}

// Common Sa (tonic) frequencies
const TONIC_OPTIONS = [
  { name: 'C (Low)', hindi: 'मध्य सप्तक', freq: 261.63 },
  { name: 'C# / Db', hindi: 'कोमल सप्तक', freq: 277.18 },
  { name: 'D', hindi: 'मध्य सप्तक', freq: 293.66 },
  { name: 'D# / Eb', hindi: 'कोमल सप्तक', freq: 311.13 },
  { name: 'E', hindi: 'मध्य सप्तक', freq: 329.63 },
  { name: 'F', hindi: 'मध्य सप्तक', freq: 349.23 },
  { name: 'F# / Gb', hindi: 'कोमल सप्तक', freq: 369.99 },
  { name: 'G', hindi: 'मध्य सप्तक', freq: 392.00 },
];

export function SettingsPage({
  baseFrequency,
  masterVolume,
  resonance,
  onBaseFrequencyChange,
  onVolumeChange,
  onResonanceChange,
}: SettingsPageProps) {
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem(THEME_STORAGE_KEY) as Theme | null) || 'system';
    }

    return 'system';
  });

  // Apply theme changes
  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);

    if (typeof window !== 'undefined') {
      localStorage.setItem(THEME_STORAGE_KEY, newTheme);

      if (newTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
      } else if (newTheme === 'light') {
        document.documentElement.removeAttribute('data-theme');
      } else {
        // System preference
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (prefersDark) {
          document.documentElement.setAttribute('data-theme', 'dark');
        } else {
          document.documentElement.removeAttribute('data-theme');
        }
      }
    }
  };

  // Get current tonic or closest match
  const currentTonic = TONIC_OPTIONS.find(t => Math.abs(t.freq - baseFrequency) < 1)
    || TONIC_OPTIONS[0];

  const handleResetProgress = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(PROGRESS_STORAGE_KEY);
      setResetSuccess(true);
      setShowResetConfirm(false);

      // Hide success message after 3 seconds
      setTimeout(() => setResetSuccess(false), 3000);
    }
  };

  const handleExportProgress = () => {
    if (typeof window !== 'undefined') {
      const progress = localStorage.getItem(PROGRESS_STORAGE_KEY);
      if (progress) {
        const blob = new Blob([progress], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `22shrutis-progress-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
      }
    }
  };

  const handleImportProgress = () => {
    if (typeof window !== 'undefined') {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.json';
      input.onchange = (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (e) => {
            try {
              const content = e.target?.result as string;
              JSON.parse(content); // Validate JSON
              localStorage.setItem(PROGRESS_STORAGE_KEY, content);
              window.location.reload(); // Reload to apply changes
            } catch {
              alert('Invalid progress file');
            }
          };
          reader.readAsText(file);
        }
      };
      input.click();
    }
  };

  return (
    <div className="h-full flex flex-col">
      <SectionHeader
        title="Settings"
        hindiTitle="सेटिंग्स"
        description="Customize your learning experience."
      />

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto p-6">

          {/* Success Message */}
          {resetSuccess && (
            <div className="mb-6 bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
              <svg className="w-5 h-5 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-green-700 font-medium">
                Progress reset successfully! Reload the page to see changes.
              </span>
            </div>
          )}

          {/* Appearance Settings */}
          <section className="bg-[var(--bg-card)] rounded-xl p-6 mb-6 border border-[var(--border-color)]">
            <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
              </svg>
              Appearance
            </h2>

            <div className="mb-2">
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-3">
                Theme
              </label>
              <div className="grid grid-cols-3 gap-3">
                {/* Light Mode */}
                <button
                  onClick={() => handleThemeChange('light')}
                  className={`
                  p-4 rounded-xl border-2 transition-all duration-200 text-center
                  ${theme === 'light'
                      ? 'bg-[var(--accent-cream)] border-[var(--accent-saffron)] shadow-sm'
                      : 'bg-[var(--bg-secondary)] border-[var(--border-color)] hover:border-[var(--accent-saffron)]'
                    }
                `}
                >
                  <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-gradient-to-br from-amber-100 to-orange-200 border-2 border-amber-300 flex items-center justify-center">
                    <svg className="w-5 h-5 text-amber-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" />
                    </svg>
                  </div>
                  <div className="font-medium text-[var(--text-primary)] text-sm">Light</div>
                  <div className="text-xs text-[var(--text-muted)]">Warm & Earthy</div>
                </button>

                {/* Dark Mode */}
                <button
                  onClick={() => handleThemeChange('dark')}
                  className={`
                  p-4 rounded-xl border-2 transition-all duration-200 text-center
                  ${theme === 'dark'
                      ? 'bg-[var(--accent-cream)] border-[var(--accent-saffron)] shadow-sm'
                      : 'bg-[var(--bg-secondary)] border-[var(--border-color)] hover:border-[var(--accent-saffron)]'
                    }
                `}
                >
                  <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-gradient-to-br from-indigo-800 to-slate-900 border-2 border-indigo-500 flex items-center justify-center">
                    <svg className="w-5 h-5 text-indigo-300" fill="currentColor" viewBox="0 0 24 24">
                      <path fillRule="evenodd" d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="font-medium text-[var(--text-primary)] text-sm">Dark</div>
                  <div className="text-xs text-[var(--text-muted)]">Indian Night</div>
                </button>

                {/* System */}
                <button
                  onClick={() => handleThemeChange('system')}
                  className={`
                  p-4 rounded-xl border-2 transition-all duration-200 text-center
                  ${theme === 'system'
                      ? 'bg-[var(--accent-cream)] border-[var(--accent-saffron)] shadow-sm'
                      : 'bg-[var(--bg-secondary)] border-[var(--border-color)] hover:border-[var(--accent-saffron)]'
                    }
                `}
                >
                  <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-gradient-to-br from-gray-200 to-gray-400 border-2 border-gray-400 flex items-center justify-center">
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="font-medium text-[var(--text-primary)] text-sm">System</div>
                  <div className="text-xs text-[var(--text-muted)]">Auto</div>
                </button>
              </div>
              <p className="text-xs text-[var(--text-muted)] mt-3">
                Light mode has warm, earthy tones. Dark mode features rich Indian blue and indigo.
              </p>
            </div>
          </section>

          {/* Audio Settings */}
          <section className="bg-[var(--bg-card)] rounded-xl p-6 mb-6 border border-[var(--border-color)]">
            <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              </svg>
              Audio Settings
            </h2>

            {/* Tonic (Sa) Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-3">
                Tonic (Sa) Pitch
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {TONIC_OPTIONS.map((tonic) => (
                  <button
                    key={tonic.freq}
                    onClick={() => onBaseFrequencyChange(tonic.freq)}
                    className={`
                                        px-4 py-3 rounded-lg border-2 transition-all duration-200 text-left
                                        ${Math.abs(currentTonic.freq - tonic.freq) < 1
                        ? 'bg-[var(--accent-cream)] border-[var(--accent-saffron)] shadow-sm'
                        : 'bg-[var(--bg-secondary)] border-[var(--border-color)] hover:border-[var(--accent-saffron)]'
                      }
                                    `}
                  >
                    <div className="font-semibold text-[var(--text-primary)] text-sm">
                      {tonic.name}
                    </div>
                    <div className="text-xs text-[var(--text-muted)] mt-0.5">
                      {tonic.freq.toFixed(2)} Hz
                    </div>
                  </button>
                ))}
              </div>
              <p className="text-xs text-[var(--text-muted)] mt-3">
                Select the pitch that matches your vocal range or preferred tuning
              </p>
            </div>

            {/* Master Volume */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-3">
                Master Volume: {Math.round(masterVolume * 100)}%
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={masterVolume * 100}
                onChange={(e) => onVolumeChange(Number(e.target.value) / 100)}
                className="w-full h-2 bg-[var(--bg-tertiary)] rounded-lg appearance-none cursor-pointer accent-[var(--accent-saffron)]"
              />
              <div className="flex justify-between text-xs text-[var(--text-muted)] mt-1">
                <span>Silent</span>
                <span>Maximum</span>
              </div>
            </div>

            {/* Master Sustain */}
            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-3">
                Master Sustain: {Math.round(resonance * 100)}%
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={resonance * 100}
                onChange={(e) => onResonanceChange(Number(e.target.value) / 100)}
                className="w-full h-2 bg-[var(--bg-tertiary)] rounded-lg appearance-none cursor-pointer accent-[var(--accent-saffron)]"
              />
              <div className="flex justify-between text-xs text-[var(--text-muted)] mt-1">
                <span>Dry</span>
                <span>Maximum Sustain</span>
              </div>
            </div>
          </section>

          {/* Progress Management */}
          <section className="bg-[var(--bg-card)] rounded-xl p-6 mb-6 border border-[var(--border-color)]">
            <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Progress Management
            </h2>

            <div className="space-y-3">
              {/* Export Progress */}
              <button
                onClick={handleExportProgress}
                className="w-full flex items-center justify-between px-4 py-3 rounded-lg border border-[var(--border-color)] bg-[var(--bg-secondary)] hover:bg-[var(--bg-tertiary)] transition-colors text-left"
              >
                <div>
                  <div className="font-medium text-[var(--text-primary)]">Export Progress</div>
                  <div className="text-xs text-[var(--text-muted)] mt-0.5">
                    Download your progress as a backup file
                  </div>
                </div>
                <svg className="w-5 h-5 text-[var(--text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </button>

              {/* Import Progress */}
              <button
                onClick={handleImportProgress}
                className="w-full flex items-center justify-between px-4 py-3 rounded-lg border border-[var(--border-color)] bg-[var(--bg-secondary)] hover:bg-[var(--bg-tertiary)] transition-colors text-left"
              >
                <div>
                  <div className="font-medium text-[var(--text-primary)]">Import Progress</div>
                  <div className="text-xs text-[var(--text-muted)] mt-0.5">
                    Restore progress from a backup file
                  </div>
                </div>
                <svg className="w-5 h-5 text-[var(--text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
              </button>

              {/* Reset Progress */}
              <button
                onClick={() => setShowResetConfirm(true)}
                className="w-full flex items-center justify-between px-4 py-3 rounded-lg border transition-colors text-left"
                style={{
                  borderColor: 'var(--danger-border)',
                  background: 'var(--danger-bg)',
                }}
              >
                <div>
                  <div className="font-medium" style={{ color: 'var(--danger-text)' }}>Reset All Progress</div>
                  <div className="text-xs mt-0.5" style={{ color: 'var(--danger-muted)' }}>
                    Clear all quiz progress and start fresh
                  </div>
                </div>
                <svg className="w-5 h-5" style={{ color: 'var(--danger-muted)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </section>

          {/* About */}
          <section className="bg-[var(--bg-card)] rounded-xl p-6 border border-[var(--border-color)]">
            <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              About
            </h2>

            <div className="space-y-3 text-sm text-[var(--text-secondary)]">
              <div className="flex justify-between py-2 border-b border-[var(--border-light)]">
                <span className="font-medium">Version</span>
                <span>0.6.0</span>
              </div>
              <div className="flex justify-between py-2 border-b border-[var(--border-light)]">
                <span className="font-medium">Music System</span>
                <span>Hindustani Classical</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="font-medium">Total Shrutis</span>
                <span>22</span>
              </div>
            </div>

            <div className="mt-6 p-4 bg-[var(--bg-secondary)] rounded-lg">
              <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                22 Shrutis is an ear-training application for learning to recognize the microtonal
                notes (shrutis) used in Hindustani Classical Music. All frequencies are calculated
                using traditional just intonation ratios relative to Sa (the tonic).
              </p>
            </div>
          </section>

          {/* Reset Confirmation Modal */}
          {showResetConfirm && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-[var(--bg-card)] rounded-2xl p-6 max-w-md w-full border border-[var(--border-color)] shadow-xl">
                <div className="text-center mb-6">
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                    style={{ background: 'var(--danger-soft-bg)' }}
                  >
                    <svg className="w-8 h-8" style={{ color: 'var(--danger-muted)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">
                    Reset All Progress?
                  </h3>
                  <p className="text-sm text-[var(--text-secondary)]">
                    This will permanently delete all your quiz progress, scores, and unlocked stages.
                    This action cannot be undone.
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowResetConfirm(false)}
                    className="flex-1 px-4 py-3 rounded-lg border border-[var(--border-color)] text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleResetProgress}
                    className="flex-1 px-4 py-3 rounded-lg text-white transition-colors font-medium"
                    style={{ background: 'var(--danger-solid)' }}
                  >
                    Reset Progress
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
