// ============================================
// Stage List Component - Shows all available stages
// ============================================

'use client';

import React from 'react';
import { QuizStage } from '@/types/quiz';
import { StageCard } from './StageCard';

interface StageListProps {
    stages: QuizStage[];
    onStageSelect: (stageId: string) => void;
}

export function StageList({ stages, onStageSelect }: StageListProps) {
    // Group stages by tier
    const tiers = [
        { name: 'Foundation', hindiName: 'नींव', stages: stages.filter(s => s.order <= 1) },
        { name: 'Shuddha Swaras', hindiName: 'शुद्ध स्वर', stages: stages.filter(s => s.order >= 2 && s.order <= 4) },
        { name: 'Building Thaat', hindiName: 'थाट निर्माण', stages: stages.filter(s => s.order >= 5 && s.order <= 7) },
        { name: 'Komal & Teevra', hindiName: 'कोमल-तीव्र', stages: stages.filter(s => s.order >= 8 && s.order <= 10) },
        { name: 'Sequences', hindiName: 'स्वर-समूह', stages: stages.filter(s => s.order >= 11 && s.order <= 12) },
        { name: 'Aroha-Avaroha', hindiName: 'आरोह-अवरोह', stages: stages.filter(s => s.order >= 13) },
    ];

    return (
        <div className="space-y-8">
            {tiers.map((tier, tierIndex) => (
                tier.stages.length > 0 && (
                    <div key={tierIndex}>
                        {/* Tier Header */}
                        <div className="flex items-center gap-3 mb-4">
                            <div className="flex items-center gap-2">
                                <span className="text-2xl font-bold text-[var(--text-primary)]">
                                    {tier.name}
                                </span>
                                <span className="text-lg text-[var(--accent-rust)]">
                                    {tier.hindiName}
                                </span>
                            </div>
                            <div className="flex-1 h-px bg-gradient-to-r from-[var(--border-color)] to-transparent" />
                        </div>

                        {/* Stage Cards Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {tier.stages.map(stage => (
                                <StageCard
                                    key={stage.id}
                                    stage={stage}
                                    onClick={() => onStageSelect(stage.id)}
                                />
                            ))}
                        </div>
                    </div>
                )
            ))}
        </div>
    );
}
