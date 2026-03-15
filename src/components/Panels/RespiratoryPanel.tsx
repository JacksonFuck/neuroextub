import React from 'react';
import { Box, Field, Input, RadioGroup, Select } from '../MetricInput';
import { RespiratoryData } from '../../utils/scoring';

interface RespiratoryPanelProps {
    data: RespiratoryData;
    onUpdate: (key: string, value: any) => void;
}

export const RespiratoryPanel: React.FC<RespiratoryPanelProps> = ({ data, onUpdate }) => {
    const rsbiAuto = data.rr && data.vt ? Math.round(+data.rr / (+data.vt / 1000) * 10) / 10 : "";

    return (
        <div>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#f1f5f9', marginBottom: 16 }}>🫁 Avaliação Respiratória & TRE</h3>
            <div className="responsive-grid">
                <Field label="PaO₂/FiO₂" hint="≥200"><Input type="number" value={data.pf} onChange={(e) => onUpdate('pf', e.target.value)} placeholder="300" /></Field>
                <Field label="FiO₂ %" hint="≤40"><Input type="number" value={data.fio2} onChange={(e) => onUpdate('fio2', e.target.value)} placeholder="40" /></Field>
                <Field label="PEEP" hint="≤5-8"><Input type="number" value={data.peep} onChange={(e) => onUpdate('peep', e.target.value)} placeholder="5" /></Field>
                <Field label="FR (rpm)"><Input type="number" value={data.rr} onChange={(e) => onUpdate('rr', e.target.value)} placeholder="18" /></Field>
                <Field label="VC (mL)"><Input type="number" value={data.vt} onChange={(e) => onUpdate('vt', e.target.value)} placeholder="450" /></Field>
                <Field label="RSBI" hint="<105"><Input type="number" value={data.rsbi || rsbiAuto} onChange={(e) => onUpdate('rsbi', e.target.value)} placeholder="Auto" /></Field>
                <Field label="PImax" hint="< −25"><Input type="number" value={data.pim} onChange={(e) => onUpdate('pim', e.target.value)} placeholder="-30" /></Field>
                <Field label="CV (mL/kg)" hint=">10"><Input type="number" value={data.vc} onChange={(e) => onUpdate('vc', e.target.value)} placeholder="12" /></Field>
            </div>

            <Field label="Aspirações/8h">
                <Select value={data.sec} onChange={(e) => onUpdate('sec', e.target.value)} options={[{ value: "0", label: "0-1" }, { value: "2", label: "2-3" }, { value: "4", label: "4+" }]} />
            </Field>

            <Box bg="rgba(245,158,11,.06)" border="rgba(245,158,11,.15)">
                <div style={{ fontSize: 14, fontWeight: 700, color: '#fcd34d', marginBottom: 12 }}>⏱️ TRE</div>
                <Field label="Resultado">
                    <RadioGroup value={data.sbt} onChange={(v) => onUpdate('sbt', v)} name="sbt" options={[{ value: "not_done", label: "N/R" }, { value: "success", label: "✅ Sucesso" }, { value: "partial", label: "⚠️ Parcial" }, { value: "failed", label: "❌ Falha" }]} />
                </Field>
                <Field label="Duração">
                    <Select value={data.sbtD} onChange={(e) => onUpdate('sbtD', e.target.value)} options={[{ value: "30", label: "30min" }, { value: "60", label: "60min" }, { value: "120", label: "120min" }]} />
                </Field>
            </Box>
        </div>
    );
};
