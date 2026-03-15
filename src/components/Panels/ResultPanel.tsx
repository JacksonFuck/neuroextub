import React from 'react';
import { Box, ScoreBar } from '../MetricInput';
import { CalculationResult, NeurologicalData } from '../../utils/scoring';
import { RECOMMENDATION_DETAILS, RISK_LEVEL_COLORS, RISK_LEVEL_LABELS } from '../../constants/medical';

interface ResultPanelProps {
    sc: CalculationResult;
    neu: NeurologicalData;
    onPrint: () => void;
    onShowDisclaimer: () => void;
}

export const ResultPanel: React.FC<ResultPanelProps> = ({ sc, neu, onPrint, onShowDisclaimer }) => {
    const r = RECOMMENDATION_DETAILS[sc.rec as keyof typeof RECOMMENDATION_DETAILS] || RECOMMENDATION_DETAILS["?"];

    return (
        <div>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#f1f5f9', marginBottom: 16 }}>📊 Resultado</h3>
            <div style={{
                padding: 20,
                borderRadius: 12,
                background: "rgba(100,116,139,.06)",
                border: "2px solid " + r[2],
                textAlign: "center",
                marginBottom: 24
            }}>
                <div style={{ fontSize: 32 }}>{r[0]}</div>
                <div style={{ fontSize: 20, fontWeight: 800, color: r[2], marginTop: 8 }}>{r[1]}</div>
                <div style={{ fontSize: 14, color: "#cbd5e1", marginTop: 8 }}>
                    Risco: <span style={{ fontWeight: 700, color: RISK_LEVEL_COLORS[sc.rl] }}>{RISK_LEVEL_LABELS[sc.rl]}</span> ({sc.rf} fator{sc.rf !== 1 ? "es" : ""})
                </div>
            </div>

            <div className="responsive-grid" style={{ gap: 16, marginBottom: 24 }}>
                <Box bg="rgba(59,130,246,.06)" border="rgba(59,130,246,.15)" style={{ marginBottom: 0 }}>
                    <ScoreBar label="FOUR" value={sc.four} max={16} color={sc.four >= 12 ? "#10b981" : sc.four >= 10 ? "#f59e0b" : "#ef4444"} />
                    <div className="label-boost">≥12 · S92% E85%</div>
                </Box>
                <Box bg="rgba(16,185,129,.06)" border="rgba(16,185,129,.15)" style={{ marginBottom: 0 }}>
                    <ScoreBar label="VISAGE" value={sc.vis} max={8} color={sc.vis >= 6 ? "#10b981" : sc.vis >= 4 ? "#f59e0b" : "#ef4444"} />
                    <div className="label-boost">≥6 · AUC 0,75</div>
                </Box>
                <Box bg="rgba(245,158,11,.06)" border="rgba(245,158,11,.15)" style={{ marginBottom: 0 }}>
                    <ScoreBar label="STAGE" value={sc.stg} max={10} color={sc.stg >= 8 ? "#10b981" : sc.stg >= 6 ? "#f59e0b" : "#ef4444"} />
                    <div className="label-boost">≥9 imediata</div>
                </Box>
                <Box bg="rgba(139,92,246,.06)" border="rgba(139,92,246,.15)" style={{ marginBottom: 0 }}>
                    <ScoreBar label="BIPER" value={sc.bip} max={12} color={sc.bip > 9 ? "#10b981" : sc.bip >= 6 ? "#f59e0b" : "#ef4444"} />
                    <div className="label-boost">{">"}9 · S92% E87%</div>
                </Box>
            </div>

            <Box bg="rgba(139,92,246,.06)" border="rgba(139,92,246,.15)">
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, fontWeight: 600, flexWrap: "wrap" }}>
                    <span style={{ color: "#c4b5fd" }}>GCS: {sc.gcs} (E{neu.gE}V{neu.gV}M{neu.gM})</span>
                    <span style={{ color: sc.gcs >= 10 ? "#10b981" : "#f59e0b" }}>{sc.gcs < 8 ? "Não é CI absoluta" : ""}</span>
                </div>
            </Box>

            <Box bg="rgba(16,185,129,.04)" border="rgba(16,185,129,.12)">
                <div className="label-boost" style={{ color: "#6ee7b7", marginBottom: 6, fontSize: 14 }}>VISAGE Detalhado</div>
                <div className="responsive-grid" style={{ gap: 4, fontSize: 14 }}>
                    <span style={{ color: sc.vV ? "#10b981" : "#ef4444" }}>{sc.vV ? "✅" : "❌"} Perseguição ({sc.vV})</span>
                    <span style={{ color: sc.vS ? "#10b981" : "#ef4444" }}>{sc.vS ? "✅" : "❌"} Deglutição ({sc.vS})</span>
                    <span style={{ color: sc.vA ? "#10b981" : "#ef4444" }}>{sc.vA ? "✅" : "❌"} Idade {"<"}60 ({sc.vA})</span>
                    <span style={{ color: sc.vM ? "#10b981" : "#ef4444" }}>{sc.vM ? "✅" : "❌"} Motor M6 ({sc.vM})</span>
                </div>
            </Box>

            <div className="responsive-grid" style={{ marginTop: 20 }}>
                <button onClick={onPrint} style={{
                    padding: "14px 20px", /* increased padding */
                    borderRadius: 10,
                    border: "none",
                    background: "linear-gradient(135deg,#1e40af,#3b82f6)",
                    color: "#fff",
                    fontSize: 14,
                    fontWeight: 700,
                    cursor: "pointer",
                    minWidth: 180
                }}>📥 Baixar Relatório (HTML/PDF)</button>
                <button onClick={onShowDisclaimer} style={{
                    padding: "12px 20px",
                    borderRadius: 10,
                    border: "1px solid rgba(100,116,139,.3)",
                    background: "transparent",
                    color: "#94a3b8",
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: "pointer"
                }}>⚖️ Disclaimer</button>
            </div>
        </div>
    );
};
