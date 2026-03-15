import React from 'react';
import { Box } from '../MetricInput';
import { EVIDENCE, DISCLAIMER } from '../../constants/medical';

interface EvidencePanelProps {
    onPrint: () => void;
}

export const EvidencePanel: React.FC<EvidencePanelProps> = ({ onPrint }) => {
    return (
        <div>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#f1f5f9', marginBottom: 16 }}>📚 Evidências Científicas</h3>
            {EVIDENCE.map((e, i) => (
                <Box key={i} bg="rgba(100,116,139,.04)" border="rgba(100,116,139,.1)">
                    <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 4, background: "rgba(59,130,246,.15)", color: "#93c5fd", fontWeight: 600 }}>{e.tag}</span>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#e2e8f0", marginTop: 8 }}>{e.title}</div>
                    <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 4 }}>{e.ref}</div>
                    <div style={{ fontSize: 12, color: "#cbd5e1", marginTop: 8, padding: "8px 10px", background: "rgba(59,130,246,.05)", borderRadius: 6, borderLeft: "3px solid rgba(59,130,246,.3)" }}>
                        <strong>Uso:</strong> {e.use}
                    </div>
                </Box>
            ))}

            <div style={{ marginTop: 32, padding: 24, borderRadius: 12, background: "linear-gradient(135deg,rgba(30,64,175,.15),rgba(16,185,129,.1))", border: "1px solid rgba(59,130,246,.2)", textAlign: "center" }}>
                <div style={{ fontSize: 22, fontWeight: 800 }}><span style={{ color: "#3b82f6" }}>NEURO</span><span style={{ color: "#10b981" }}>EXTUB</span></div>
                <div style={{ fontSize: 13, color: "#94a3b8", marginTop: 8 }}>Protocolo de Extubação em Neurocríticos · v2.0</div>
                <div style={{ width: 60, height: 2, background: "linear-gradient(90deg,#3b82f6,#10b981)", margin: "16px auto", borderRadius: 1 }} />
                <div style={{ fontSize: 16, fontWeight: 700, color: "#e2e8f0", marginTop: 12 }}>Dr. Jackson Erasmo Fuck</div>
                <div style={{ fontSize: 13, color: "#94a3b8" }}>CRM/PR 21.528</div>
                <div style={{ fontSize: 12, color: "#64748b", marginTop: 8, lineHeight: 1.6 }}>
                    Médico Intensivista · Coordenador de UTI<br />
                    SAMUTI — Serviços de Atendimento de Urgência e Medicina Intensiva<br />
                    Professor Coordenador — Emergências e Terapia Intensiva — UNIPAR<br />
                    Umuarama, Paraná, Brasil
                </div>
            </div>

            <Box bg="rgba(245,158,11,.06)" border="rgba(245,158,11,.2)" style={{ marginTop: 24 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#fcd34d", marginBottom: 12 }}>⚖️ Termo de Responsabilidade</div>
                <div style={{ fontSize: 12, color: "#cbd5e1", lineHeight: 1.8, whiteSpace: "pre-line" }}>{DISCLAIMER}</div>
            </Box>

            <button onClick={onPrint} style={{
                marginTop: 16,
                width: "100%",
                padding: "12px",
                borderRadius: 10,
                border: "none",
                background: "linear-gradient(135deg,#1e40af,#3b82f6)",
                color: "#fff",
                fontSize: 14,
                fontWeight: 700,
                cursor: "pointer"
            }}>📥 Baixar Relatório Completo</button>
        </div>
    );
};
