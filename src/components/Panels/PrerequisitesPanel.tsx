import React from 'react';
import { Checkbox } from '../MetricInput';
import { PrerequisitesData } from '../../utils/scoring';

interface PrerequisitesPanelProps {
    data: PrerequisitesData;
    onToggle: (key: string) => void;
    count: number;
}

export const PrerequisitesPanel: React.FC<PrerequisitesPanelProps> = ({ data, onToggle, count }) => {
    return (
        <div>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#f1f5f9', marginBottom: 16 }}>✅ Pré-Requisitos para Desmame</h3>
            <Checkbox checked={data.a} onChange={() => onToggle('a')} label="Controle da lesão primária" detail="Sem agravamento 48h" />
            <Checkbox checked={data.b} onChange={() => onToggle('b')} label="PIC ≤20 mmHg 24h" detail="Se monitorizada" />
            <Checkbox checked={data.c} onChange={() => onToggle('c')} label="Sedação mínima (RASS ≥ −2)" />
            <Checkbox checked={data.d} onChange={() => onToggle('d')} label="Hemodinâmica estável" detail="Sem aminas ou NE ≤0,1" />
            <Checkbox checked={data.e} onChange={() => onToggle('e')} label="Afebril (T <38,5°C)" />
            <Checkbox checked={data.f} onChange={() => onToggle('f')} label="Hb ≥7 g/dL" />
            <Checkbox checked={data.g} onChange={() => onToggle('g')} label="Sem status epilepticus" />
            <Checkbox checked={data.h} onChange={() => onToggle('h')} label="Albumina ≥2,5 g/dL" />

            <div style={{
                marginTop: 16,
                padding: 12,
                borderRadius: 8,
                background: count === 8 ? 'rgba(16,185,129,.1)' : 'rgba(245,158,11,.1)',
                border: '1px solid ' + (count === 8 ? 'rgba(16,185,129,.3)' : 'rgba(245,158,11,.3)'),
                fontSize: 14,
                fontWeight: 600,
                color: count === 8 ? '#10b981' : '#f59e0b'
            }}>
                {count}/8 atendidos{count < 8 && " — Otimizar"}
            </div>
        </div>
    );
};
