import React from 'react';
import { Field, Input, Select } from '../MetricInput';
import { DIAGNOSES } from '../../constants/medical';
import { PatientData } from '../../utils/scoring';

interface IdentificationPanelProps {
    data: PatientData;
    onUpdate: (key: string, value: string) => void;
}

export const IdentificationPanel: React.FC<IdentificationPanelProps> = ({ data, onUpdate }) => {
    return (
        <div>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#f1f5f9', marginBottom: 16 }}>🏥 Identificação do Paciente</h3>
            <div className="responsive-grid">
                <Field label="Paciente (iniciais)">
                    <Input
                        value={data.name || ''}
                        onChange={(e) => onUpdate('name', e.target.value)}
                        placeholder="J.E.F."
                    />
                </Field>
                <Field label="Leito">
                    <Input
                        value={data.bed || ''}
                        onChange={(e) => onUpdate('bed', e.target.value)}
                        placeholder="UTI-01"
                    />
                </Field>
                <Field label="Idade">
                    <Input
                        type="number"
                        value={data.age || ''}
                        onChange={(e) => onUpdate('age', e.target.value)}
                        placeholder="anos"
                    />
                </Field>
                <Field label="Peso (kg)">
                    <Input
                        type="number"
                        value={data.weight || ''}
                        onChange={(e) => onUpdate('weight', e.target.value)}
                        placeholder="70"
                    />
                </Field>
                <Field label="Diagnóstico">
                    <Select
                        value={data.dx || 'avci'}
                        onChange={(e) => onUpdate('dx', e.target.value)}
                        options={DIAGNOSES}
                    />
                </Field>
                <Field label="Dias VM">
                    <Input
                        type="number"
                        value={data.mvD || ''}
                        onChange={(e) => onUpdate('mvD', e.target.value)}
                        placeholder="0"
                    />
                </Field>
                <Field label="TOT (mm)">
                    <Input
                        value={data.ett || ''}
                        onChange={(e) => onUpdate('ett', e.target.value)}
                        placeholder="7.5"
                    />
                </Field>
                <Field label="Data">
                    <Input
                        type="date"
                        value={data.date || ''}
                        onChange={(e) => onUpdate('date', e.target.value)}
                    />
                </Field>
            </div>
            <Field label="Avaliador">
                <Input
                    value={data.eval || ''}
                    onChange={(e) => onUpdate('eval', e.target.value)}
                    placeholder="Nome"
                />
            </Field>
        </div>
    );
};
