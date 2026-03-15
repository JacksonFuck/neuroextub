import React from 'react';
import { Field, Checkbox, Input } from '../MetricInput';
import { CuffLeakData } from '../../utils/scoring';

interface CuffLeakPanelProps {
    data: CuffLeakData;
    onUpdate: (key: string, value: any) => void;
}

export const CuffLeakPanel: React.FC<CuffLeakPanelProps> = ({ data, onUpdate }) => {
    const showWarning = data.done && +data.leak > 0 && +data.leak < 110;

    return (
        <div>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#f1f5f9', marginBottom: 16 }}>🎈 Cuff Leak Test</h3>
            <Checkbox checked={data.done} onChange={() => onUpdate('done', !data.done)} label="Cuff Leak Test realizado" />
            {data.done && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 12 }}>
                    <Field label="Volume (mL)" hint="≥110"><Input type="number" value={data.leak || ''} onChange={(e) => onUpdate('leak', e.target.value)} placeholder="150" /></Field>
                    <Field label="% do VC" hint="≥15%"><Input type="number" value={data.pct || ''} onChange={(e) => onUpdate('pct', e.target.value)} placeholder="20" /></Field>
                </div>
            )}
            {showWarning && (
                <div style={{ marginTop: 12, padding: 12, borderRadius: 8, background: "rgba(239,68,68,.1)", border: "1px solid rgba(239,68,68,.3)", fontSize: 13, color: "#fca5a5" }}>
                    ⚠️ Leak {"<"}110mL — Metilprednisolona 40mg IV 4/4h × 3-4 doses (Francois 2007)
                </div>
            )}
        </div>
    );
};
