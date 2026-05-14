// ============================================
// useKeyboardShortcuts Hook
// ============================================

'use client';

import { useEffect, useCallback } from 'react';

interface KeyboardActions {
    togglePlay: () => void;
    volumeUp: () => void;
    volumeDown: () => void;
    selectString: (index: number) => void;
    closeModal: () => void;
    mute: () => void;
}

interface UseKeyboardShortcutsOptions {
    enabled?: boolean;
    enableTogglePlay?: boolean;
}

export function useKeyboardShortcuts(
    actions: KeyboardActions,
    { enabled = true, enableTogglePlay = true }: UseKeyboardShortcutsOptions = {}
) {
    const handleKeyDown = useCallback(
        (event: KeyboardEvent) => {
            if (!enabled) {
                return;
            }

            // Don't trigger shortcuts when typing in input fields
            if (
                event.target instanceof HTMLInputElement ||
                event.target instanceof HTMLTextAreaElement ||
                event.target instanceof HTMLSelectElement
            ) {
                return;
            }

            if (enableTogglePlay && event.key === 'Enter') {
                event.preventDefault();
                actions.togglePlay();
                return;
            }

            if (event.key === 'ArrowUp') {
                event.preventDefault();
                actions.volumeUp();
                return;
            }

            if (event.key === 'ArrowDown') {
                event.preventDefault();
                actions.volumeDown();
                return;
            }

            if (event.key === 'Escape') {
                event.preventDefault();
                actions.closeModal();
                return;
            }

            if (event.key.toLowerCase() === 'm') {
                event.preventDefault();
                actions.mute();
                return;
            }

            if (event.key === '1') {
                event.preventDefault();
                actions.selectString(0);
                return;
            }

            if (event.key === '2') {
                event.preventDefault();
                actions.selectString(1);
                return;
            }

            if (event.key === '3') {
                event.preventDefault();
                actions.selectString(2);
                return;
            }

            if (event.key === '4') {
                event.preventDefault();
                actions.selectString(3);
            }
        },
        [actions, enabled, enableTogglePlay]
    );

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);
}
