// ============================================
// MotifBackground - Indian Art Motifs Scattered Background
// ============================================

'use client';

import React from 'react';

const MOTIFS = [
    '/motifs/mandala.png',
    '/motifs/peacock.png',
    '/motifs/lotus.png',
    '/motifs/elephant.png',
    '/motifs/paisley.png',
    '/motifs/palm_leaf.png',
];

// Scattered positions across the full viewport (percentage based)
const POSITIONS = [
    // Row 1
    { x: 3, y: 3 }, { x: 18, y: 5 }, { x: 33, y: 4 }, { x: 48, y: 6 }, { x: 63, y: 3 }, { x: 78, y: 5 }, { x: 93, y: 4 },
    // Row 2 (offset)
    { x: 10, y: 15 }, { x: 25, y: 17 }, { x: 40, y: 16 }, { x: 55, y: 18 }, { x: 70, y: 15 }, { x: 85, y: 17 },
    // Row 3
    { x: 3, y: 28 }, { x: 18, y: 30 }, { x: 33, y: 29 }, { x: 48, y: 31 }, { x: 63, y: 28 }, { x: 78, y: 30 }, { x: 93, y: 29 },
    // Row 4 (offset)
    { x: 10, y: 42 }, { x: 25, y: 44 }, { x: 40, y: 43 }, { x: 55, y: 45 }, { x: 70, y: 42 }, { x: 85, y: 44 },
    // Row 5
    { x: 3, y: 55 }, { x: 18, y: 57 }, { x: 33, y: 56 }, { x: 48, y: 58 }, { x: 63, y: 55 }, { x: 78, y: 57 }, { x: 93, y: 56 },
    // Row 6 (offset)
    { x: 10, y: 68 }, { x: 25, y: 70 }, { x: 40, y: 69 }, { x: 55, y: 71 }, { x: 70, y: 68 }, { x: 85, y: 70 },
    // Row 7
    { x: 3, y: 82 }, { x: 18, y: 84 }, { x: 33, y: 83 }, { x: 48, y: 85 }, { x: 63, y: 82 }, { x: 78, y: 84 }, { x: 93, y: 83 },
    // Row 8 (offset) - bottom
    { x: 10, y: 94 }, { x: 25, y: 96 }, { x: 40, y: 95 }, { x: 55, y: 97 }, { x: 70, y: 94 }, { x: 85, y: 96 },
];

export function MotifBackground() {
    return (
        <div className="motif-background" aria-hidden="true">
            {POSITIONS.map((pos, index) => (
                <img
                    key={index}
                    src={MOTIFS[index % MOTIFS.length]}
                    alt=""
                    style={{
                        left: `${pos.x}%`,
                        top: `${pos.y}%`,
                    }}
                />
            ))}
        </div>
    );
}
