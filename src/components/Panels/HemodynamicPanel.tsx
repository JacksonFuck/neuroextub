import React from 'react';
import { Field, Input, RadioGroup, Checkbox } from '../MetricInput';
import { HemodynamicData } from '../../utils/scoring';

interface HemodynamicPanelProps {
    data: HemodynamicData;
    onUpdate: (key: string, value: any) => void;
}

export const HemodynamicPanel: React.FC<HemodynamicPanelProps> = ({ data, onUpdate }) => {
    return (
        <div>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#f1f5f9', marginBottom: 16 }}>💊 Hemodinâmica & Metabólica</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <Field label="PAS"><Input type="number" value={data.sbp || ''} onChange={(e) => onUpdate('sbp', e.target.value)} placeholder="120" /></Field>
                <Field label="PAD"><Input type="number" value={data.dbp || ''} onChange={(e) => onUpdate('dbp', e.target.value)} placeholder="80" /></Field>
                <Field label="FC"><Input type="number" value={data.hr || ''} onChange={(e) => onUpdate('hr', e.target.value)} placeholder="80" /></Field>
                <Field label="T° (°C)"><Input type="number" value={data.temp || ''} onChange={(e) => onUpdate('temp', e.target.value)} placeholder="36.8" step="0.1" /></Field>
                <Field label="PCR" hint="<100"><Input type="number" value={data.crp || ''} onChange={(e) => onUpdate('crp', e.target.value)} placeholder="25" /></Field>
                <Field label="K⁺" hint="3,5-5,0"><Input type="number" value={data.k || ''} onChange={(e) => onUpdate('k', e.target.value)} placeholder="4.0" step="0.1" /></Field>
                <Field label="Hb" hint="≥7"><Input type="number" value={data.hb || ''} onChange={(e) => onUpdate('hb', e.target.value)} placeholder="10" step="0.1" /></Field>
                <Field label="pH"><Input type="number" value={data.ph || ''} onChange={(e) => onUpdate('ph', e.target.value)} placeholder="7.40" step="0.01" /></Field>
                <Field label="PaCO₂"><Input type="number" value={data.co2 || ''} onChange={(e) => onUpdate('co2', e.target.value)} placeholder="40" /></Field>
            </div>
            <Field label="Vasopressores">
                <RadioGroup value={data.vaso} onChange={(v) => onUpdate('vaso', v)} name="va" options={[{ value: "none", label: "Não" }, { value: "low", label: "Baixa" }, { value: "high", label: "Alta" }]} />
            </Field>
            <Checkbox checked={data.stable} onChange={() => onUpdate('stable', !data.stable)} label="PA estável (90-180)" />
            <Checkbox checked={data.arr} onChange={() => onUpdate('arr', !data.arr)} label="Arritmias presentes" />
        </div>
    );
};
