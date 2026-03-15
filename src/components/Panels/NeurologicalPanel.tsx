import React from 'react';
import { Box, Field, Select, RadioGroup, Checkbox, Input } from '../MetricInput';
import { NeurologicalData, PatientData } from '../../utils/scoring';

interface NeurologicalPanelProps {
    neu: NeurologicalData;
    pat: PatientData;
    onUpdate: (key: string, value: any) => void;
    four: number;
    gcs: number;
    vis: number;
}

export const NeurologicalPanel: React.FC<NeurologicalPanelProps> = ({ neu, pat, onUpdate, four, gcs, vis }) => {
    const numOpts = (arr: number[]) => arr.map((v) => ({ value: String(v), label: String(v) }));

    return (
        <div>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#f1f5f9', marginBottom: 16 }}>🧠 Avaliação Neurológica</h3>

            <Box bg="rgba(59,130,246,.06)" border="rgba(59,130,246,.15)">
                <div style={{ fontSize: 14, fontWeight: 700, color: '#93c5fd', marginBottom: 12 }}>FOUR Score</div>
                <Field label="Ocular (E)" hint="4=segue · 3=aberta · 2=som · 1=dor · 0=fechada">
                    <Select value={neu.fE} onChange={(e) => onUpdate('fE', e.target.value)} options={[4, 3, 2, 1, 0].map(v => ({ value: String(v), label: 'E' + v }))} />
                </Field>
                <Field label="Motor (M)" hint="4=comandos · 3=localiza · 2=flexão · 1=extensão · 0=nada">
                    <Select value={neu.fM} onChange={(e) => onUpdate('fM', e.target.value)} options={[4, 3, 2, 1, 0].map(v => ({ value: String(v), label: 'M' + v }))} />
                </Field>
                <Field label="Tronco (B)" hint="4=pupilar+corneano · 0=tudo ausente">
                    <Select value={neu.fB} onChange={(e) => onUpdate('fB', e.target.value)} options={[4, 3, 2, 1, 0].map(v => ({ value: String(v), label: 'B' + v }))} />
                </Field>
                <Field label="Respiração (R)" hint="4=regular · 1=acima vent · 0=apneia">
                    <Select value={neu.fR} onChange={(e) => onUpdate('fR', e.target.value)} options={[4, 3, 2, 1, 0].map(v => ({ value: String(v), label: 'R' + v }))} />
                </Field>
                <div style={{ fontSize: 15, fontWeight: 700, color: four >= 12 ? '#10b981' : four >= 10 ? '#f59e0b' : '#ef4444' }}>
                    FOUR: {four}/16 {four >= 12 ? '✅' : four >= 10 ? '⚠️' : '🔴'}
                </div>
            </Box>

            <Box bg="rgba(139,92,246,.06)" border="rgba(139,92,246,.15)">
                <div style={{ fontSize: 14, fontWeight: 700, color: '#c4b5fd', marginBottom: 12 }}>GCS</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                    <Field label="E"><Select value={neu.gE} onChange={(e) => onUpdate('gE', e.target.value)} options={[4, 3, 2, 1].map(v => ({ value: String(v), label: 'E' + v }))} /></Field>
                    <Field label="V"><Select value={neu.gV} onChange={(e) => onUpdate('gV', e.target.value)} options={[5, 4, 3, 2, 1].map(v => ({ value: String(v), label: 'V' + v }))} /></Field>
                    <Field label="M"><Select value={neu.gM} onChange={(e) => onUpdate('gM', e.target.value)} options={[6, 5, 4, 3, 2, 1].map(v => ({ value: String(v), label: 'M' + v }))} /></Field>
                </div>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#c4b5fd' }}>GCS: {gcs}/15</div>
            </Box>

            <Box bg="rgba(16,185,129,.06)" border="rgba(16,185,129,.15)">
                <div style={{ fontSize: 14, fontWeight: 700, color: '#6ee7b7', marginBottom: 12 }}>VISAGE Score</div>
                <Field label="Perseguição visual">
                    <RadioGroup value={neu.vp} onChange={(v) => onUpdate('vp', v)} name="vp" options={[{ value: 'yes', label: 'Sim (2)' }, { value: 'no', label: 'Não (0)' }]} />
                </Field>
                <Field label="Deglutição espontânea">
                    <RadioGroup value={neu.sw} onChange={(v) => onUpdate('sw', v)} name="nsw" options={[{ value: 'yes', label: 'Sim (2)' }, { value: 'no', label: 'Não (0)' }]} />
                </Field>
                <div style={{ fontSize: 13, color: '#94a3b8', margin: '8px 0' }}>
                    Idade: {pat.age ? (+pat.age < 60 ? pat.age + "a→2" : pat.age + "a→0") : "?"} · Motor: {neu.gM === "6" ? "M6→2" : "M" + neu.gM + "→0"}
                </div>
                <div style={{ fontSize: 15, fontWeight: 700, color: vis >= 6 ? '#10b981' : vis >= 4 ? '#f59e0b' : '#ef4444' }}>
                    VISAGE: {vis}/8 {vis >= 8 ? "🟢" : vis >= 6 ? "🟡" : vis >= 4 ? "🟠" : "🔴"}
                </div>
            </Box>

            <Field label="RASS">
                <Select
                    value={neu.rass}
                    onChange={(e) => onUpdate('rass', e.target.value)}
                    options={[{ value: "4", label: "+4" }, { value: "3", label: "+3" }, { value: "2", label: "+2" }, { value: "1", label: "+1" }, { value: "0", label: "0 Alerta" }, { value: "-1", label: "-1" }, { value: "-2", label: "-2" }, { value: "-3", label: "-3" }, { value: "-4", label: "-4" }, { value: "-5", label: "-5" }]}
                />
            </Field>

            <Field label="Pupilas">
                <RadioGroup
                    value={neu.pup}
                    onChange={(v) => onUpdate('pup', v)}
                    name="pu"
                    options={[{ value: "bilateral", label: "Bilateral" }, { value: "unilateral", label: "Unilateral" }, { value: "absent", label: "Ausente" }]}
                />
            </Field>

            <Checkbox checked={neu.icp} onChange={() => onUpdate('icp', !neu.icp)} label="PIC monitorizada" />

            {neu.icp && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginLeft: 24 }}>
                    <Field label="PIC (mmHg)">
                        <Input type="number" value={neu.icpV} onChange={(e) => onUpdate('icpV', e.target.value)} placeholder="15" />
                    </Field>
                    <Field label="PPC (mmHg)">
                        <Input type="number" value={neu.ppcV} onChange={(e) => onUpdate('ppcV', e.target.value)} placeholder="70" />
                    </Field>
                </div>
            )}
        </div>
    );
};
