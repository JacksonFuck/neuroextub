import React from 'react';
import { Box } from '../MetricInput';
import { CalculationResult, CuffLeakData } from '../../utils/scoring';

interface PostExtubationPanelProps {
    sc: CalculationResult;
    cu: CuffLeakData;
    onPrint: () => void;
}

export const PostExtubationPanel: React.FC<PostExtubationPanelProps> = ({ sc, cu, onPrint }) => {
    return (
        <div>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#f1f5f9', marginBottom: 16 }}>📋 Protocolo Pós-Extubação</h3>
            <Box bg="rgba(59,130,246,.06)" border="rgba(59,130,246,.15)">
                <div style={{ fontWeight: 700, color: "#93c5fd", marginBottom: 8 }}>🔧 Pré-Extubação</div>
                <div style={{ fontSize: 13, color: "#cbd5e1", lineHeight: 1.8 }}>
                    ☐ Cabeceira 30-45° · ☐ Aspirar NF+TOT · ☐ Desinflar cuff · ☐ Material de reintubação · ☐ VNI disponível
                    {cu.done && +cu.leak < 110 ? " · ☐ Metilprednisolona 40mg" : ""}
                </div>
            </Box>
            <Box bg="rgba(16,185,129,.06)" border="rgba(16,185,129,.15)">
                <div style={{ fontWeight: 700, color: "#6ee7b7", marginBottom: 8 }}>📊 Monitor 6h</div>
                <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", fontSize: 12, borderCollapse: "collapse", color: "#cbd5e1" }}>
                        <thead>
                            <tr style={{ borderBottom: "1px solid rgba(100,116,139,.2)" }}>
                                {["Período", "Parâmetros", "Alertas"].map((h) => <th key={h} style={{ padding: "6px 8px", textAlign: "left", color: "#94a3b8" }}>{h}</th>)}
                            </tr>
                        </thead>
                        <tbody>
                            {[
                                ["0-30min", "FR,SpO₂,RASS,voz", "FR>30→VNI"],
                                ["30-60min", "Saliva,PA", "Acúmulo→aspirar"],
                                ["1-2h", "PA,FC,FOUR", "FC>120→HIC?"],
                                ["2-3h", "PImax,VC", "PImax<-15→VNI"],
                                ["3-6h", "Gaso arterial", "PaCO₂>48→↑IPAP"]
                            ].map(([t, p, a], i) => (
                                <tr key={i} style={{ borderBottom: "1px solid rgba(100,116,139,.1)" }}>
                                    <td style={{ padding: "6px 8px", fontWeight: 600 }}>{t}</td>
                                    <td style={{ padding: "6px 8px" }}>{p}</td>
                                    <td style={{ padding: "6px 8px", color: "#fcd34d" }}>{a}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Box>
            <Box bg="rgba(239,68,68,.06)" border="rgba(239,68,68,.15)">
                <div style={{ fontWeight: 700, color: "#fca5a5", marginBottom: 8 }}>❌ Reintubação Imediata</div>
                <div style={{ fontSize: 13, color: "#cbd5e1", lineHeight: 1.8 }}>
                    Queda GCS ≥2 · SpO₂ {"<"}88% · FR {">"}35 sustentada · Fadiga resp · Aspiração maciça · Instab. hemodinâmica · Estridor refratário
                </div>
            </Box>

            <div style={{ padding: 12, borderRadius: 8, background: "rgba(239,68,68,.08)", border: "1px solid rgba(239,68,68,.2)", fontSize: 13, color: "#fca5a5", marginBottom: 16 }}>
                🚨 HIC rebote (12-23% em 6h): PaCO₂ 35-38. Lidocaína 2% se PIC {">"}20.
            </div>
            <div style={{ padding: 12, borderRadius: 8, background: "rgba(139,92,246,.08)", border: "1px solid rgba(139,92,246,.2)", fontSize: 13, color: "#c4b5fd" }}>
                🍽️ Disfagia obrigatória: GUSS-ICU 24h. FEES se detectada. 80% têm disfagia.
            </div>

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
            }}>📥 Baixar Relatório (HTML/PDF)</button>
        </div>
    );
};
