// ============================================
// useKeyboardShortcuts Hook
// ============================================

'use client';

import { useEffect, useCallback } from 'react';
import { KEYBOARD_SHORTCUTS } from '@/constants/shrutis';

interface KeyboardActions {
    togglePlay: () => void;
    volumeUp: () => void;
    volumeDown: () => void;
    selectString: (index: number) => void;
    closeModal: () => void;
    mute: () => void;
}

export function useKeyboardShortcuts(actions: KeyboardActions) {
    const handleKeyDown = useCallback(
        (event: KeyboardEvent) => {
            // Don't trigger shortcuts when typing in input fields
            if (
                event.target instanceof HTMLInputElement ||
                event.target instanceof HTMLTextAreaElement
            ) {
                return;
            }

            const shortcut = KEYBOARD_SHORTCUTS.find(s => s.key === event.key);

            if (!shortcut) return;

            // Prevent default for handled keys
            event.preventDefault();

            switch (shortcut.action) {
                case 'togglePlay':
                    actions.togglePlay();
                    break;
                case 'volumeUp':
                    actions.volumeUp();
                    break;
                case 'volumeDown':
                    actions.volumeDown();
                    break;
                case 'selectString1':
                    actions.selectString(0);
                    break;
                case 'selectString2':
                    actions.selectString(1);
                    break;
                case 'selectString3':
                    actions.selectString(2);
                    break;
                case 'selectString4':
                    actions.selectString(3);
                    break;
                case 'closeModal':
                    actions.closeModal();
                    break;
                case 'mute':
                    actions.mute();
                    break;
            }
        },
        [actions]
    );

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);
}
