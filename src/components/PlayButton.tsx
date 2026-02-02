// ============================================
// PlayButton Component - Main Play/Pause Control
// ============================================

'use client';

import React from 'react';

interface PlayButtonProps {
    isPlaying: boolean;
    isInitialized: boolean;
    onToggle: () => void;
    onInitialize: () => Promise<void>;
}

export function PlayButton({
    isPlaying,
    isInitialized,
    onToggle,
    onInitialize,
}: PlayButtonProps) {
    const handleClick = async () => {
        if (!isInitialized) {
            await onInitialize();
        }
        onToggle();
    };

    return (
        <button
            onClick={handleClick}
            className={`
                relative w-20 h-20 rounded-full
                flex items-center justify-center
                transition-all duration-300 ease-out
                transform hover:scale-105 active:scale-95
                border-2
                ${isPlaying
                    ? 'bg-[var(--accent-maroon)] border-[var(--accent-maroon)] hover:bg-[var(--accent-maroon)]/90'
                    : 'bg-[var(--accent-saffron)] border-[var(--accent-saffron)] hover:bg-[var(--accent-saffron)]/90'
                }
            `}
            style={{
                boxShadow: isPlaying
                    ? '0 0 30px rgba(139, 41, 66, 0.5)'
                    : '0 0 30px rgba(232, 168, 56, 0.4)',
            }}
            title={isPlaying ? 'Pause (Space)' : 'Play (Space)'}
        >
            {/* Pulse animation when playing */}
            {isPlaying && (
                <div
                    className="absolute inset-0 rounded-full animate-ping opacity-20"
                    style={{ backgroundColor: 'var(--accent-maroon)' }}
                />
            )}

            {/* Icon */}
            {isPlaying ? (
                <svg
                    className="w-8 h-8 text-[var(--cream)]"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                >
                    <rect x="6" y="4" width="4" height="16" rx="1" />
                    <rect x="14" y="4" width="4" height="16" rx="1" />
                </svg>
            ) : (
                <svg
                    className="w-8 h-8 text-[var(--bg-primary)] ml-1"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path d="M8 5v14l11-7z" />
                </svg>
            )}
        </button>
    );
}
