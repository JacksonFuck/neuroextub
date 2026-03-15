import React from 'react';
import { Field, RadioGroup, Input } from '../MetricInput';
import { AirwayData } from '../../utils/scoring';

interface AirwayPanelProps {
    data: AirwayData;
    onUpdate: (key: string, value: any) => void;
    stg: number;
}

export const AirwayPanel: React.FC<AirwayPanelProps> = ({ data, onUpdate, stg }) => {
    return (
        <div>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#f1f5f9', marginBottom: 16 }}>🛡️ Proteção de Via Aérea (STAGE)</h3>
            <Field label="Deglutição">
                <RadioGroup value={data.sw} onChange={(v) => onUpdate('sw', v)} name="asw" options={[{ value: "present", label: "Presente (2)" }, { value: "weak", label: "Fraca (1)" }, { value: "absent", label: "Ausente (0)" }]} />
            </Field>
            <Field label="Protrusão lingual">
                <RadioGroup value={data.tong} onChange={(v) => onUpdate('tong', v)} name="to" options={[{ value: "yes", label: "Sim (2)" }, { value: "no", label: "Não (0)" }]} />
            </Field>
            <Field label="Tosse espontânea">
                <RadioGroup value={data.cS} onChange={(v) => onUpdate('cS', v)} name="cs" options={[{ value: "vigorous", label: "Vigorosa (2)" }, { value: "weak", label: "Fraca (1)" }, { value: "absent", label: "Ausente (0)" }]} />
            </Field>
            <Field label="Tosse c/ aspiração">
                <RadioGroup value={data.cA} onChange={(v) => onUpdate('cA', v)} name="ca" options={[{ value: "vigorous", label: "Vigorosa (2)" }, { value: "weak", label: "Fraca (1)" }, { value: "absent", label: "Ausente (0)" }]} />
            </Field>
            <Field label="Reflexo de gag">
                <RadioGroup value={data.gag} onChange={(v) => onUpdate('gag', v)} name="ga" options={[{ value: "present", label: "Presente" }, { value: "weak", label: "Fraco" }, { value: "absent", label: "Ausente" }]} />
            </Field>
            <Field label="Acúmulo salivar">
                <RadioGroup value={data.sal} onChange={(v) => onUpdate('sal', v)} name="sa" options={[{ value: "no", label: "Não" }, { value: "yes", label: "Sim" }]} />
            </Field>
            <Field label="PEF (L/min)" hint="≥60">
                <Input type="number" value={data.pef} onChange={(e) => onUpdate('pef', e.target.value)} placeholder="80" />
            </Field>

            <div style={{
                marginTop: 12,
                padding: 12,
                borderRadius: 8,
                background: stg >= 8 ? 'rgba(16,185,129,.1)' : stg >= 6 ? 'rgba(245,158,11,.1)' : 'rgba(239,68,68,.1)',
                border: '1px solid ' + (stg >= 8 ? 'rgba(16,185,129,.3)' : stg >= 6 ? 'rgba(245,158,11,.3)' : 'rgba(239,68,68,.3)')
            }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: stg >= 8 ? "#10b981" : stg >= 6 ? "#f59e0b" : "#ef4444" }}>
                    STAGE: {stg}/10 {stg >= 9 ? "— Imediata" : stg >= 6 ? "— Condicional" : "— CI"}
                </div>
            </div>
        </div>
    );
};
