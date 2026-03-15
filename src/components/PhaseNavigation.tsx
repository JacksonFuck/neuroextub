import React from 'react';
import styles from './PhaseNavigation.module.css';

interface PhaseNavigationProps {
    phases: string[];
    currentPhase: number;
    onPhaseChange: (index: number) => void;
    scoresSummary?: {
        four: number;
        vis: number;
        stg: number;
    };
}

export const PhaseNavigation: React.FC<PhaseNavigationProps> = ({ phases, currentPhase, onPhaseChange, scoresSummary }) => {
    return (
        <div className={styles.header}>
            <div className={styles.container}>
                <div className={styles.titleRow}>
                    <div>
                        <h1 className={styles.title}>
                            <span className={styles.accentBlue}>NEURO</span>
                            <span className={styles.accentGreen}>EXTUB</span>
                            <span className={styles.subtitle}>Neurocríticos</span>
                        </h1>
                        <div className={styles.author}>Dr. Jackson E. Fuck · CRM/PR 21.528 · SAMUTI</div>
                    </div>
                    <div className={styles.version}>v2.0</div>
                </div>

                <div className={styles.progressTrack}>
                    {phases.map((p, i) => (
                        <button
                            key={i}
                            onClick={() => onPhaseChange(i)}
                            className={`${styles.stepIndicator} ${i < currentPhase ? styles.completed : i === currentPhase ? styles.active : ''}`}
                            title={p}
                        />
                    ))}
                </div>

                <div className={styles.statusRow}>
                    <span className={styles.phaseInfo}>
                        {currentPhase + 1}/{phases.length} · {phases[currentPhase]}
                    </span>
                    {currentPhase >= 1 && currentPhase <= 6 && scoresSummary && (
                        <span className={styles.scoresBrief}>
                            F:{scoresSummary.four} V:{scoresSummary.vis} S:{scoresSummary.stg}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};
